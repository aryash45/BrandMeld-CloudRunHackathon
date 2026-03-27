#!/bin/bash
# BrandMeld Cloud Run Deployment Script

set -e  # Exit on error

echo "🚀 BrandMeld Cloud Run Deployment"
echo "=================================="

# Configuration
PROJECT_ID=${1:-"your-gcp-project-id"}
REGION="us-central1"
SERVICE_NAME="brandmeld-api"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "📝 Please login to gcloud..."
    gcloud auth login
fi

# Set project
echo "📦 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Deploy backend to Cloud Run
echo ""
echo "🔨 Building and deploying backend to Cloud Run..."
cd backend

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "❗ Please edit backend/.env and add your GEMINI_API_KEY before deploying!"
    exit 1
fi

# Get Gemini API key from .env
GEMINI_API_KEY=$(grep GEMINI_API_KEY .env | cut -d '=' -f2)

if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your_gemini_api_key_here" ]; then
    echo "❌ GEMINI_API_KEY not set in backend/.env"
    echo "Please add your Gemini API key to backend/.env"
    exit 1
fi

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 60s

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)")

echo ""
echo "✅ Backend deployed successfully!"
echo "📍 Service URL: $SERVICE_URL"
echo ""
echo "Next steps:"
echo "1. Update frontend/.env.production with: VITE_API_URL=$SERVICE_URL"
echo "2. Build frontend: cd frontend && npm run build"
echo "3. Deploy frontend to Cloud Storage or Firebase Hosting"
echo ""
echo "🎉 Deployment complete!"
