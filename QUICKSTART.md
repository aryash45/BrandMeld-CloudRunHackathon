# BrandMeld Cloud Run Hackathon - Quick Start Guide

## Project Structure ✅

Your project is now properly organized into:

- **backend/** - Python FastAPI server with Gemini integration
- **frontend/** - React + Vite dashboard

## Quick Start Commands

### 1. Start Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
python -m uvicorn app.main:app --reload --port 8080
```

### 2. Start Frontend (Terminal 2)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### 3. Access the Application

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Docs (Swagger)**: http://localhost:8080/docs

## What Changed?

✅ **Separated backend and frontend** into distinct folders
✅ **Created Python FastAPI backend** with three core services:

- Discovery (brand voice analysis)
- Factory (content generation)
- Auditor (quality checking)
  ✅ **Updated frontend** to call backend API instead of direct Gemini calls
  ✅ **Added Dockerfile** for Cloud Run deployment
  ✅ **Secured API keys** - now only stored in backend

## Next Steps

1. **Get API Key**: https://makersuite.google.com/app/apikey
2. **Test locally** using the commands above
3. **Deploy to Cloud Run** using instructions in README.md

---

See [README.md](README.md) for detailed documentation.
