from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ingest import router as ingest_router
from app.query import router as query_router
from app.items import router as items_router  

app = FastAPI(title="AI Knowledge Inbox")

# --------------------
# CORS CONFIG
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# ROUTERS
# --------------------
app.include_router(ingest_router)
app.include_router(query_router)
app.include_router(items_router)
