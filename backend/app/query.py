from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from app.embeddings import embed_texts
from app.state import vector_store


router = APIRouter(prefix="/query")



class QueryRequest(BaseModel):
    question: str
    top_k: int = 3


class SourceSnippet(BaseModel):
    text: str
    score: float


class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceSnippet]


def simple_answer_synthesizer(question: str, contexts: List[str]) -> str:
    """
    Free, deterministic answer generator.
    Acts as a placeholder for an LLM.
    """
    if not contexts:
        return "I could not find relevant information in the saved content."

    joined_context = " ".join(contexts[:2])
    return f"Based on the saved content, {joined_context[:400]}..."


@router.post("", response_model=QueryResponse)
def query_knowledge(req: QueryRequest):
    


    if not vector_store._vectors:
        raise HTTPException(status_code=400, detail="No content indexed yet")


    query_vector = embed_texts([req.question])[0]
    results = vector_store.search(query_vector, top_k=req.top_k)

    contexts = []
    sources = []

    for score, meta in results:
        contexts.append(meta["text"])
        sources.append(
            SourceSnippet(
                text=meta["text"][:200],
                score=round(score, 4)
            )
        )

    answer = simple_answer_synthesizer(req.question, contexts)

    return QueryResponse(
        answer=answer,
        sources=sources
    )
