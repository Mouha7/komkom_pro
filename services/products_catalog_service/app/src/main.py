from fastapi import FastAPI
from fastapi.responses import JSONResponse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Products Catalog Service",
    description="Microservice for managing products",
    version="1.0.0",
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse(status_code=200, content={"status": "healthy"})

# Readiness check endpoint
@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint"""
    return JSONResponse(status_code=200, content={"status": "ready"})

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Products Catalog Service", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
