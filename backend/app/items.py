from fastapi import APIRouter
from app.ingest import CONTENT_REGISTRY

router = APIRouter(prefix="/items")

@router.get("")
def list_items():
    return CONTENT_REGISTRY
