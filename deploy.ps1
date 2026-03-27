# BrandMeld Cloud Run Deployment Script (Windows)

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = "your-gcp-project-id"
)

Write-Host "🚀 BrandMeld Cloud Run Deployment" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$Region = "us-central1"
$ServiceName = "brandmeld-api"

# Check if gcloud is installed
if (!(Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ gcloud CLI not found. Please install: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}

# Set project
Write-Host "📦 Setting project to: $ProjectId" -ForegroundColor Yellow
gcloud config set project $ProjectId

# Deploy backend to Cloud Run
Write-Host ""
Write-Host "🔨 Building and deploying backend to Cloud Run..." -ForegroundColor Yellow
Set-Location backend

# Check for .env file
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "❗ Please edit backend/.env and add your GEMINI_API_KEY before deploying!" -ForegroundColor Red
    exit 1
}

# Get Gemini API key from .env
$envContent = Get-Content .env
$apiKeyLine = $envContent | Where-Object { $_ -match "GEMINI_API_KEY=" }
$GeminiApiKey = ($apiKeyLine -split "=")[1].Trim()

if ([string]::IsNullOrEmpty($GeminiApiKey) -or $GeminiApiKey -eq "your_gemini_api_key_here") {
    Write-Host "❌ GEMINI_API_KEY not set in backend/.env" -ForegroundColor Red
    Write-Host "Please add your Gemini API key to backend/.env" -ForegroundColor Red
    exit 1
}

# Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Green
gcloud run deploy $ServiceName `
  --source . `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --set-env-vars GEMINI_API_KEY=$GeminiApiKey `
  --min-instances 0 `
  --max-instances 10 `
  --memory 512Mi `
  --timeout 60s

# Get the service URL
$ServiceUrl = gcloud run services describe $ServiceName --region $Region --format="value(status.url)"

Write-Host ""
Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
Write-Host "📍 Service URL: $ServiceUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update frontend/.env.production with: VITE_API_URL=$ServiceUrl"
Write-Host "2. Build frontend: cd frontend && npm run build"
Write-Host "3. Deploy frontend to Cloud Storage or Firebase Hosting"
Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
