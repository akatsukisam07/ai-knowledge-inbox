from typing import List, Dict, Any
import math


class SimpleVectorStore:
    def __init__(self):
        self._vectors: List[List[float]] = []
        self._metadata: List[Dict[str, Any]] = []

    def add(self, vector: List[float], metadata: Dict[str, Any]):
        self._vectors.append(vector)
        self._metadata.append(metadata)

    def _cosine_similarity(self, v1: List[float], v2: List[float]) -> float:
        dot = sum(a * b for a, b in zip(v1, v2))
        norm1 = math.sqrt(sum(a * a for a in v1))
        norm2 = math.sqrt(sum(b * b for b in v2))

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return dot / (norm1 * norm2)

    def search(self, query_vector: List[float], top_k: int = 5):
        scored = []

        for vec, meta in zip(self._vectors, self._metadata):
            score = self._cosine_similarity(query_vector, vec)
            scored.append((score, meta))

        scored.sort(key=lambda x: x[0], reverse=True)
        return scored[:top_k]
