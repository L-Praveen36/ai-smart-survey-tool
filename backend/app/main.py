from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import survey_routes, voice_routes, analytics_routes, response_routes
from .database import Base, engine
from .models import survey, question, response, user, enumerator

app = FastAPI(title="AI Smart Survey Tool")

# CORS setup
origins = [
    "http://localhost:5173",                    # Local frontend (Vite dev server)
    "https://ai-smart-survey-tool.vercel.app",     # Replace with your actual Vercel domain after first deploy
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

# API routes
app.include_router(survey_routes.router, prefix="/api/surveys", tags=["Surveys"])
app.include_router(voice_routes.router, prefix="/api/voice", tags=["Voice"])
app.include_router(analytics_routes.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(response_routes.router, prefix="/api/responses", tags=["Responses"])

# Create tables
print("📌 Creating all tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")
