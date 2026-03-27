"""
Auditor Service - Content Brand Voice Auditing
Validates content against brand voice guidelines using Gemini
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os

router = APIRouter()

def _create_model() -> genai.GenerativeModel:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable not set")

    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        'gemini-2.0-flash-exp',
        system_instruction=AUDIT_SYSTEM_INSTRUCTION,
    )

class ContentAuditRequest(BaseModel):
    brand_voice: str
    content_to_audit: str

class ContentAuditResponse(BaseModel):
    audit_report: str
    success: bool
    message: str = ""

AUDIT_SYSTEM_INSTRUCTION = """You are a Personal Brand Editor. Your job is to ensure content sounds authentic to the author, not like ChatGPT.

Provide a structured Markdown report:
1.  **Alignment Score:** 1-100.
2.  **Voice Analysis:** Does it sound like the person? (Too formal? Too casual? Too many emojis?)
3.  **Fixes:** Specific rewrites to make it sound more like the defined Voice Profile.
4.  **Verdict:** "Publish" or "Rewrite".
"""

@router.post("/audit", response_model=ContentAuditResponse)
async def audit_content(request: ContentAuditRequest):
    """
    Audit content against brand voice guidelines
    """
    try:
        model = _create_model()
        
        prompt = f"""
**TARGET VOICE PROFILE:**
---
{request.brand_voice}
---

**DRAFT CONTENT:**
---
{request.content_to_audit}
---
"""
        
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(temperature=0.5)
        )
        
        return ContentAuditResponse(
            audit_report=response.text,
            success=True,
            message="Content audited successfully"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to audit content: {str(e)}"
        )

@router.get("/health")
async def auditor_health():
    """Health check for auditor service"""
    return {"status": "healthy", "service": "auditor"}
