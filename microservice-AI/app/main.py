from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import sys

# Configure logging
logger.remove()
logger.add(sys.stdout, format="<green>{time}</green> <level>{message}</level>", level="INFO")
logger.add("logs/ai_service.log", rotation="500 MB", retention="10 days")

# Create FastAPI app
app = FastAPI(
    title="Smart Career AI Service",
    description="AI-powered quiz generation and career recommendations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from app.api import health, quiz, analysis, recommendations

# Include routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("Starting Smart Career AI Service...")
    # Initialize services here

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("Shutting down Smart Career AI Service...")

if __name__ == "__main__":
    import uvicorn
    from app.config import settings
    
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
        log_level="info"
    )