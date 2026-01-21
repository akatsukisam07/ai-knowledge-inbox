# AI Knowledge Inbox

## Overview
AI Knowledge Inbox is a minimal, production-style web application that allows a user to save short notes or URLs and ask questions over the saved content using a simple Retrieval-Augmented Generation (RAG) pipeline.

The project is intentionally scoped to demonstrate backend API design, semantic search, basic AI integration, and a functional React frontend without overengineering.

---

## Features

### Content Ingestion
- Add plain text notes
- Add URLs (page content fetched server-side)
- Store raw content with metadata:
  - source type (note or URL)
  - timestamp
- Single-user, no authentication

### Semantic Search + RAG
- Text chunking with a simple, deterministic strategy
- Embedding generation using a lightweight embedding function (Used Local embeddings)
- In-memory vector store for semantic similarity search
- Retrieve top relevant chunks for a given question
- Generate an answer using retrieved context
- Return cited source snippets with relevance scores

### Frontend
- React frontend built with Vite
- Add note input
- Display list of inputs
- Add URL input
- Ask question interface
- Display generated answer
- Display source snippets
- Client-side validation to prevent empty submissions
- Clear, minimal UI 

---

## Architecture

- frontend/ React + Vite frontend
- backend/
- app/
- ingest.py Content ingestion (notes and URLs)
- query.py Semantic search and RAG query endpoint
- items.py List stored content
- chunking.py Text chunking logic
- embeddings.py Embedding abstraction
- vector_store.py Simple in-memory vector store
- state.py Shared application state
- main.py FastAPI app entry point



#Setup Instructions

##Backend

cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload


Backend runs at: http://localhost:8000

##Frontend

cd frontend
npm install
npm run dev


##Frontend runs at: http://localhost:5173

#Design Tradeoffs

Vector Store: Uses an in-memory vector store for simplicity and fast iteration. Not suitable for persistence or large-scale data.

Chunking Strategy: Fixed-size chunking to keep behavior predictable and debuggable.

Embeddings: Abstracted embedding logic allows swapping OpenAI or local embedding models.

Answer Generation: Uses a deterministic placeholder synthesizer instead of a full LLM to keep the project lightweight and free.

State Management: Global in-memory state simplifies implementation but limits scalability.
