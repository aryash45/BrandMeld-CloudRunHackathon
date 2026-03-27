"""
Factory Service - Content Generation
Generates brand-aligned content using Gemini
"""

import asyncio
import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai

router = APIRouter()

def _create_model(system_instruction: str) -> genai.GenerativeModel:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable not set")

    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        "gemini-2.0-flash-exp",
        system_instruction=system_instruction,
    )

# ─── Shared System Instruction ────────────────────────────────────────────────

GENERATOR_SYSTEM_INSTRUCTION = """You are 'BrandMeld,' an expert personal branding and marketing AI.

**CORE DIRECTIVE:**
Your goal is to ghostwrite content that sounds EXACTLY like the persona defined in [BRAND_VOICE].

**CRITICAL STYLE RULES:**
1. **Personal Identity:** If the brand voice implies an individual (a founder, creator, or thought leader), ALWAYS use "I" and "my" instead of "we" or "us".
2. **Authenticity Over Corporate Speak:** Avoid buzzwords like "synergy," "leveraging," or "cutting-edge" unless the brand voice explicitly uses them. Prefer simple, punchy, human language.
3. **Format:** Use short paragraphs. Use formatting (bolding, lists) to make it readable on social platforms.
4. **Tone:** Be opinionated. Good personal brands have a point of view.
5. **Output:** Return ONLY the content in Markdown. Do not include introductory filler like "Here is a post for you."

Analyze the provided [BRAND_VOICE] deeply before writing. Match the sentence length, vocabulary complexity, and emotional range.
"""


# ─── Feature: Single-Platform Generation (existing) ──────────────────────────

class ContentGenerationRequest(BaseModel):
    brand_voice: str
    content_request: str

class ContentGenerationResponse(BaseModel):
    generated_content: str
    success: bool
    message: str = ""

@router.post("/generate", response_model=ContentGenerationResponse)
async def generate_content(request: ContentGenerationRequest):
    """Generate brand-aligned content using Gemini."""
    try:
        model = _create_model(GENERATOR_SYSTEM_INSTRUCTION)
        prompt = f"""
**AUTHOR/BRAND VOICE PROFILE:**
---
{request.brand_voice}
---

**CONTENT TASK:**
---
{request.content_request}
---
"""
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(temperature=0.8, top_p=0.95),
        )
        return ContentGenerationResponse(
            generated_content=response.text,
            success=True,
            message="Content generated successfully",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")


@router.get("/health")
async def factory_health():
    """Health check for factory service."""
    return {"status": "healthy", "service": "factory"}


# ─── Feature 1: Multi-Platform Batch Generation ───────────────────────────────

PLATFORM_CONSTRAINTS = {
    "twitter": """PLATFORM: X / Twitter Thread
- Write as a numbered thread (1/, 2/, 3/, etc.)
- Each tweet must be under 280 characters INCLUDING the number prefix
- Start with a strong hook tweet that stands alone
- End with a call to action or summary tweet
- No filler. Every tweet must add value.""",

    "linkedin": """PLATFORM: LinkedIn Post
- Use the Hook-Story-Insight-CTA format
- Hook: first 2 lines must make someone stop scrolling (no "Excited to share..." openers)
- 150-300 words total
- Short paragraphs (1-2 sentences max)
- End with a single clear question or call to action
- 3-5 relevant hashtags on the last line""",

    "instagram": """PLATFORM: Instagram Caption
- Conversational and authentic — this is a person talking, not a brand
- 100-150 words
- Start with an attention-grabbing first line (shows before "more..." cutoff)
- Break into short punchy paragraphs
- End with 5-8 relevant hashtags on a new line""",

    "newsletter": """PLATFORM: Email Newsletter Section
- Thought-leadership opener paragraph (2-3 sentences)
- 250-400 words total
- Use subheadings if helpful
- Write like you're emailing a smart friend, not broadcasting to a list
- End with a clear CTA (reply, click, share)
- NO subject line — just the body content""",
}

class BatchGenerationRequest(BaseModel):
    brand_voice: str
    content_request: str
    platforms: list[str]

class BatchGenerationResponse(BaseModel):
    results: dict[str, str]
    success: bool
    message: str = ""

async def _generate_for_platform(brand_voice: str, content_request: str, platform: str) -> tuple[str, str]:
    """Generate content for a single platform. Returns (platform, content)."""
    constraints = PLATFORM_CONSTRAINTS.get(platform, "")
    model = _create_model(GENERATOR_SYSTEM_INSTRUCTION)
    prompt = f"""
**AUTHOR/BRAND VOICE PROFILE:**
---
{brand_voice}
---

**CONTENT TASK:**
---
{content_request}
---

**PLATFORM REQUIREMENTS (FOLLOW STRICTLY):**
---
{constraints}
---
"""
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(temperature=0.8, top_p=0.95),
    )
    return (platform, response.text)

@router.post("/batch-generate", response_model=BatchGenerationResponse)
async def batch_generate_content(request: BatchGenerationRequest):
    """Generate brand-aligned content for multiple platforms simultaneously."""
    valid_platforms = list(PLATFORM_CONSTRAINTS.keys())
    requested = [p for p in request.platforms if p in valid_platforms]
    if not requested:
        raise HTTPException(
            status_code=400,
            detail=f"No valid platforms. Choose from: {valid_platforms}",
        )
    try:
        tasks = [
            _generate_for_platform(request.brand_voice, request.content_request, platform)
            for platform in requested
        ]
        results_list = await asyncio.gather(*tasks)
        results = dict(results_list)
        return BatchGenerationResponse(
            results=results,
            success=True,
            message=f"Generated for: {', '.join(requested)}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch generation failed: {str(e)}")


# ─── Feature 2: Inline Content Editing ────────────────────────────────────────

EDIT_INSTRUCTIONS = {
    "shorter":  "Make this significantly shorter (aim for 40-60% of original length). Cut filler ruthlessly. Keep the core message.",
    "longer":   "Expand this content. Add supporting points, a brief story or example, or more depth. Don't add fluff.",
    "casual":   "Rewrite this in a more casual, conversational tone. Sound like a smart friend texting, not a professional writing.",
    "formal":   "Rewrite this in a more professional, polished tone. Suitable for a board presentation or formal publication.",
    "hook":     "Rewrite ONLY the opening (first 1-2 sentences) to be more compelling as a hook. Leave the rest intact.",
    "punchy":   "Rewrite this to be punchier. Shorter sentences. Stronger verbs. More direct. Cut all hedging language.",
}

class EditContentRequest(BaseModel):
    original_content: str
    brand_voice: str
    edit_command: str

class EditContentResponse(BaseModel):
    edited_content: str
    success: bool
    message: str = ""

@router.post("/edit", response_model=EditContentResponse)
async def edit_content(request: EditContentRequest):
    """Apply an editing command to existing content while preserving brand voice."""
    instruction = EDIT_INSTRUCTIONS.get(request.edit_command)
    if not instruction:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid edit_command. Choose from: {list(EDIT_INSTRUCTIONS.keys())}",
        )
    try:
        model = _create_model(GENERATOR_SYSTEM_INSTRUCTION)
        prompt = f"""
**AUTHOR/BRAND VOICE PROFILE:**
---
{request.brand_voice}
---

**ORIGINAL CONTENT TO EDIT:**
---
{request.original_content}
---

**EDITING INSTRUCTION:**
{instruction}

Return ONLY the revised content. No commentary, no "Here is the edited version:". Just the content.
"""
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(temperature=0.7, top_p=0.92),
        )
        return EditContentResponse(
            edited_content=response.text,
            success=True,
            message=f"Applied edit: {request.edit_command}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Edit failed: {str(e)}")
