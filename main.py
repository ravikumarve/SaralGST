"""
SaralGST Backend API
=====================

FastAPI-based microservice for GST rate lookup.
Built for Indian small businesses to verify GST 2.0 rates.

Tech Stack:
- FastAPI (Python 3.12)
- JSON file as data store
- Gemini Flash for NLP with fallback
- HMAC token authentication
- IP-based rate limiting

Author: SaralGST Team
Version: 1.0.0
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
import json
import os
from pathlib import Path
from datetime import datetime, timezone
from contextlib import asynccontextmanager
import logging

# Import config and routers
from config import Config
from routers import lookup, validate

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="SaralGST API",
    description="India's simplest GST rate checker - GST 2.0 compliant",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Validate configuration on startup
try:
    Config.validate()
except Exception as e:
    logger.error(f"Configuration validation failed: {e}")
    raise

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# API Version middleware
@app.middleware("http")
async def add_api_version_header(request: Request, call_next):
    """Add X-API-Version header to all responses."""
    response = await call_next(request)
    response.headers["X-API-Version"] = Config.API_VERSION
    return response
# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Rate limit exceeded handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Handle rate limit exceeded errors"""
    return JSONResponse(
        status_code=429,
        content={
            "error": "rate_limit_exceeded",
            "message": "Aaj ke 3 lookups ho gaye. Kal phir aayein ya upgrade karein.",
            "details": "Free tier: 3 lookups per day per IP address.",
            "upgrade_url": "https://saralgst.in/upgrade"
        }
    )

# Include routers
app.include_router(lookup.router)
app.include_router(validate.router)

# Load GST rates data at startup
def load_rates_data():
    """Load GST rates from JSON file"""
    try:
        with open(Config.RATES_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Validate data structure
        if "version" not in data or "items" not in data:
            raise ValueError("Invalid rates data structure")
        
        logger.info(f"Loaded {len(data['items'])} GST rate items")
        return data
    except Exception as e:
        logger.error(f"Failed to load rates data: {e}")
        raise

# Cache rates in memory
rates_data = load_rates_data()

# Health check response model
class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    data_version: str
    timestamp: str
    items_count: int

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    Returns API status, version, and data version.
    Used for monitoring and uptime checks.
    """
    return HealthResponse(
        status="ok",
        version=Config.API_VERSION,
        data_version=Config.DATA_VERSION,
        timestamp=datetime.now(timezone.utc).isoformat(),
        items_count=len(rates_data["items"])
    )

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": "SaralGST API",
        "version": Config.API_VERSION,
        "description": "India's simplest GST rate checker",
        "data_version": Config.DATA_VERSION,
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "lookup": "/api/lookup",
            "validate_key": "/api/validate-key"
        }
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_error",
            "message": "Internal server error. Please try again later."
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("SaralGST API starting up...")
    logger.info(f"Data version: {Config.DATA_VERSION}")
    logger.info(f"Items loaded: {len(rates_data['items'])}")
    logger.info(f"Rate limits - Free: {Config.RATE_LIMIT_FREE}/day, Paid: {Config.RATE_LIMIT_PAID}/day")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("SaralGST API shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
