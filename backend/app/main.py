from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services.discovery import DiscoveryService
from app.services.supabase import SupabaseService
from app.services.factory import router as factory_router
from app.services.auditor import router as auditor_router
from app.services.imagen import router as imagen_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(factory_router, prefix="/api/factory", tags=["factory"])
app.include_router(auditor_router, prefix="/api/auditor", tags=["auditor"])
app.include_router(imagen_router, prefix="/api/imagen", tags=["imagen"])

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/v1/discovery")
async def discover(url: str):
    try:
        service = DiscoveryService()
        dna = await service.extract_dna(url)
        dna_data = dna.model_dump()
        dna_data["url"] = url
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to analyze brand: {exc}") from exc

    try:
        db = SupabaseService()
        saved_data = await db.save_brand_dna(dna_data)
        if isinstance(saved_data, list) and saved_data:
            return {"status": "success", "data": saved_data[0]}
        if saved_data:
            return {"status": "success", "data": saved_data}
    except Exception:
        pass

    return {"status": "success", "data": dna_data}
