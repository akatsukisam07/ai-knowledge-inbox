from app.vector_store import SimpleVectorStore

# Single shared vector store instance
# ingest and query need same shared instance
vector_store = SimpleVectorStore()
