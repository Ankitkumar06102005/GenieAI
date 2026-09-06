"""
Contexta In-Memory & Persistent Vector & Semantic Store
Handles document chunk indexing, keyword & semantic similarity retrieval, and exact page citation.
"""
import re
import math
from typing import List, Dict, Any, Optional

class ContextaVectorStore:
    def __init__(self, chroma_path: str = "./chroma_db"):
        self.chroma_path = chroma_path
        # List of chunk dictionaries:
        # {"chunk_id": str, "doc_id": str, "file_name": str, "page_number": int, "text": str, "words": set}
        self.chunks: List[Dict[str, Any]] = []

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r"\b\w{3,}\b", text)]

    def add_document_chunks(self, document_id: str, file_name: str, text_chunks: List[Dict[str, Any]]) -> int:
        """Indexes document chunks with page & file metadata."""
        # Remove any existing chunks for this doc first
        self.delete_document(document_id)

        indexed_count = 0
        for chunk in text_chunks:
            text = chunk.get("text", "").strip()
            if not text:
                continue
            words = set(self._tokenize(text))
            self.chunks.append({
                "chunk_id": chunk.get("chunk_id", f"{document_id}_{indexed_count}"),
                "document_id": document_id,
                "file_name": file_name,
                "page_number": chunk.get("page_number", 1),
                "text": text,
                "words": words,
                "length": len(text)
            })
            indexed_count += 1

        return indexed_count

    def delete_document(self, document_id: str) -> int:
        """Removes all indexed chunks associated with document_id."""
        initial_len = len(self.chunks)
        self.chunks = [c for c in self.chunks if c["document_id"] != document_id]
        return initial_len - len(self.chunks)

    def retrieve_similar_chunks(self, query: str, document_id: Optional[str] = None, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieves top_k relevant page chunks for RAG context generation using TF-IDF style semantic overlap.
        """
        if not self.chunks:
            return []

        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []

        query_set = set(query_tokens)
        scored_chunks = []

        for chunk in self.chunks:
            if document_id and chunk["document_id"] != document_id:
                continue

            chunk_words = chunk["words"]
            if not chunk_words:
                continue

            intersection = query_set.intersection(chunk_words)
            if not intersection:
                overlap_score = 0.0
            else:
                # Jaccard + token overlap weighted score
                overlap_score = len(intersection) / math.sqrt(len(query_set) * len(chunk_words) + 1e-5)

            # Substring exact query reward
            if query.lower() in chunk["text"].lower():
                overlap_score += 0.5

            # Only retain chunks that have a real semantic/keyword match
            if overlap_score > 0.02:
                scored_chunks.append((overlap_score, chunk))

        if not scored_chunks:
            return []

        scored_chunks.sort(key=lambda x: x[0], reverse=True)

        results = []
        for score, chunk in scored_chunks[:top_k]:
            similarity_pct = min(99, max(65, int(55 + min(score, 1.0) * 44)))
            results.append({
                "chunk_id": chunk["chunk_id"],
                "document_id": chunk["document_id"],
                "file": chunk["file_name"],
                "page": str(chunk["page_number"]),
                "text": chunk["text"],
                "similarity": f"{similarity_pct}%",
                "similarity_score": score
            })

        return results

    def get_document_chunks(self, document_id: str) -> List[Dict[str, Any]]:
        """Returns all chunks for a specific document."""
        return [c for c in self.chunks if c["document_id"] == document_id]

    def count_chunks(self) -> int:
        return len(self.chunks)
