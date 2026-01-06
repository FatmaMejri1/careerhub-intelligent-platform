from fastapi import APIRouter
from datetime import datetime
import psutil

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Smart Career AI",
        "timestamp": datetime.utcnow().isoformat(),
        "memory_usage": psutil.Process().memory_percent(),
        "cpu_usage": psutil.cpu_percent(interval=1)
    }

@router.get("/version")
async def get_version():
    """Get API version"""
    return {
        "version": "1.0.0",
        "environment": "development"  # Change based on config
    }