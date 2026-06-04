from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import APP_NAME

from app.database import Base
from app.database import engine

from app.routers.feeds import router as feeds_router


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=APP_NAME,
    description="Travel Content Agent API",
    version="1.0.0"
)

# =====================================
# CORS
# =====================================

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# Routers
# =====================================

app.include_router(feeds_router)


@app.get("/")
def root():
    return {
        "application": APP_NAME,
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }