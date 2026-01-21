from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import Literal
from datetime import datetime
import requests
from bs4 import BeautifulSoup

from app.chunking import chunk_text
from app.embeddings import embed_texts
from app.state import vector_store

router = APIRouter(prefix="/ingest")


# In-memory registry for raw content (used for items)
CONTENT_REGISTRY: list[dict] = []


class IngestionPayload(BaseModel):
    source_kind: Literal["note", "url"]
    payload: str


def fetch_clean_text(url: str) -> str:
    """
    Fetch a URL and extract readable text.
    Intentionally simple and deterministic.
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; AIKnowledgeInbox/1.0)"
        }
        response = requests.get(url, headers=headers, timeout=8)
        response.raise_for_status()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to fetch URL: {str(e)}"
        )

    soup = BeautifulSoup(response.text, "html.parser")

    # Removing non-content elements
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    text = soup.get_text(separator=" ")
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    return " ".join(lines)


@router.post("")
def ingest_content(data: IngestionPayload):
    """
    Ingest either a plain text note or a URL.
    Content is chunked, embedded, and stored in the vector store.
    """

    # Resolving content
    if data.source_kind == "note":
        text = data.payload.strip()
        if not text:
            raise HTTPException(
                status_code=400,
                detail="Note content cannot be empty"
            )

    elif data.source_kind == "url":
        text = fetch_clean_text(data.payload)

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid source_kind"
        )

    # Storing raw content 
    record_id = len(CONTENT_REGISTRY)
    CONTENT_REGISTRY.append(
        {
            "id": record_id,
            "source_kind": data.source_kind,
            "source_value": data.payload,
            "created_at": datetime.utcnow().isoformat(),
        }
    )

    # Chunking → Embedding → Storing
    chunks = chunk_text(text)
    vectors = embed_texts(chunks)

    for chunk, vector in zip(chunks, vectors):
        vector_store.add(
            vector,
            metadata={
                "text": chunk,
                "source_kind": data.source_kind,
                "record_id": record_id,
            },
        )

    return {
        "status": "stored",
        "record_id": record_id,
        "chunks_added": len(chunks),
        "source_kind": data.source_kind,
    }
