import asyncio
import logging
import os
import re
from html import unescape
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from google import genai
from playwright.async_api import async_playwright
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class BrandDNA(BaseModel):
    brand_name: str
    primary_hex: str
    typography: list[str]
    voice_personality : str
    banned_concepts: list[str]

class DiscoveryService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        self.client = genai.Client(api_key=api_key)

    def _normalize_url(self, url: str) -> str:
        candidate = url.strip()
        if not candidate:
            raise ValueError("A website URL is required for brand discovery")

        if "://" not in candidate:
            candidate = f"https://{candidate}"

        parsed = urlparse(candidate)
        if not parsed.scheme or not parsed.netloc:
            raise ValueError("Brand discovery currently requires a valid website URL, for example https://example.com")

        return candidate

    async def _capture_site_screenshot(self, normalized_url: str) -> bytes | None:
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                try:
                    page = await browser.new_page(viewport={"width": 1440, "height": 2200})
                    await page.goto(normalized_url, wait_until="domcontentloaded", timeout=20000)
                    await page.wait_for_timeout(1500)
                    return await page.screenshot(full_page=True)
                finally:
                    await browser.close()
        except Exception as exc:
            logger.warning("Playwright screenshot capture failed for %s: %s", normalized_url, exc)
            return None

    def _extract_meta_content(self, html_content: str, meta_name: str) -> str | None:
        patterns = [
            rf'<meta[^>]*name=["\']{meta_name}["\'][^>]*content=["\'](.*?)["\']',
            rf'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']{meta_name}["\']',
            rf'<meta[^>]*property=["\']og:{meta_name}["\'][^>]*content=["\'](.*?)["\']',
            rf'<meta[^>]*content=["\'](.*?)["\'][^>]*property=["\']og:{meta_name}["\']',
        ]
        for pattern in patterns:
            match = re.search(pattern, html_content, flags=re.IGNORECASE | re.DOTALL)
            if match:
                return unescape(re.sub(r"\s+", " ", match.group(1))).strip()
        return None

    def _build_page_context(self, normalized_url: str) -> str | None:
        request = Request(
            normalized_url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/133.0.0.0 Safari/537.36"
                )
            },
        )
        try:
            with urlopen(request, timeout=15) as response:
                content_type = (response.headers.get("Content-Type") or "").lower()
                if content_type and "text/html" not in content_type and "application/xhtml+xml" not in content_type:
                    return None
                html_bytes = response.read(250000)
        except (HTTPError, URLError, TimeoutError, OSError) as exc:
            logger.warning("Direct page fetch failed for %s: %s", normalized_url, exc)
            return None

        html_content = html_bytes.decode("utf-8", errors="ignore")

        title_match = re.search(r"<title[^>]*>(.*?)</title>", html_content, flags=re.IGNORECASE | re.DOTALL)
        title = unescape(re.sub(r"\s+", " ", title_match.group(1))).strip() if title_match else ""
        meta_description = self._extract_meta_content(html_content, "description")

        visible_text = re.sub(r"(?is)<(script|style|noscript|svg).*?>.*?</\1>", " ", html_content)
        visible_text = re.sub(r"(?is)<!--.*?-->", " ", visible_text)
        visible_text = re.sub(r"(?is)<[^>]+>", " ", visible_text)
        visible_text = unescape(re.sub(r"\s+", " ", visible_text)).strip()

        context_parts = [
            f"Website URL: {normalized_url}",
            f"Hostname: {urlparse(normalized_url).netloc}",
        ]
        if title:
            context_parts.append(f"Page title: {title}")
        if meta_description:
            context_parts.append(f"Meta description: {meta_description}")
        if visible_text:
            context_parts.append(f"Visible text excerpt: {visible_text[:6000]}")

        return "\n".join(context_parts)

    async def extract_dna(self,url:str)->BrandDNA:
        normalized_url = self._normalize_url(url)
        screenshot, page_context = await asyncio.gather(
            self._capture_site_screenshot(normalized_url),
            asyncio.to_thread(self._build_page_context, normalized_url),
        )

        if screenshot is None and not page_context:
            raise RuntimeError(
                "Brand discovery could not access the website. Browser capture was blocked "
                "and the page could not be fetched directly. Try a public URL or allow the browser runtime."
            )

        prompt = """
        Analyze this brand's website and return BrandDNA JSON.
        Use the screenshot when it is available.
        If only text context is available, infer carefully from the copy, metadata, and page structure.
        Keep the output grounded in evidence from the provided context.
        """
        contents: list[object] = [prompt, f"Target website: {normalized_url}"]
        if page_context:
            contents.append(page_context)
        if screenshot is not None:
            contents.append(genai.types.Part.from_bytes(screenshot,mime_type = "image/png"))

        response = self.client.models.generate_content(
            model = "gemini-2.0-flash-exp",
            contents = contents,
            config = genai.types.GenerateContentConfig(
                response_mime_type = "application/json",
                response_schema=BrandDNA,
                thinking_config ={"thinking_level":"high"}
            )
        )
        if response.parsed is None:
            raise RuntimeError("Brand discovery returned an empty response from Gemini")
        return response.parsed
