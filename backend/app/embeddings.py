from sentence_transformers import SentenceTransformer
from typing import List


_embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Generate vector embeddings for a list of texts.
    Runs fully locally, no external API calls.
    """
    return _embedding_model.encode(texts, convert_to_numpy=True).tolist()
