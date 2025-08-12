import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Absolute imports for app modules
from app.routes import survey_routes, voice_routes, analytics_routes, response_routes
from app.database import Base, engine
from app.models import survey, question, response, user, enumerator

# Setup basic logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

app = FastAPI(title="AI Smart Survey Tool")

# CORS setup
origins = [
    "http://localhost:5173",                         # Local frontend (Vite dev server)
    "https://ai-smart-survey-tool.vercel.app",
    "https://ai-smart-survey-tool-mu.vercel.app",    # Replace with your actual Vercel domain after first deploy
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route
@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Survey Tool API is running!"}

# Render health check route
@app.get("/healthz")
def health_check():
    return {"status": "ok"}

# OpenAI API Key test endpoint
@app.get("/test-openai-key")
def test_openai_key():
    key = os.getenv("OPENAI_API_KEY")
    if key:
        preview = key[:4] + "***" if len(key) > 4 else key
        logging.info("OpenAI API key detected and loaded.")
        return {"key_exists": True, "key_preview": preview}
    else:
        logging.warning("OpenAI API key NOT found in environment variables.")
        return {"key_exists": False, "key_preview": None}

# API routes (all support advanced features in their router logic)
app.include_router(survey_routes.router, prefix="/api/surveys", tags=["Surveys"])
app.include_router(voice_routes.router, prefix="/api/voice", tags=["Voice"])
app.include_router(analytics_routes.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(response_routes.router, prefix="/api/responses", tags=["Responses"])

# Create tables on startup
print("📌 Creating all tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")
