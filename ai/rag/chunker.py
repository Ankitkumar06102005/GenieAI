"""
Semantic Text Chunker for Contexta AI RAG Engine
Splits document pages into semantic chunks with overlap for ChromaDB embedding storage.
"""

class SemanticChunker:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_document_pages(self, pages: list[dict], file_name: str) -> list[dict]:
        """Splits page content into overlapping semantic chunks with file & page metadata."""
        chunks = []
        chunk_counter = 1

        for page_data in pages:
            page_num = page_data["page_number"]
            text = page_data["content"]
            
            if len(text) <= self.chunk_size:
                chunks.append({
                    "chunk_id": f"{file_name}_p{page_num}_c{chunk_counter}",
                    "file_name": file_name,
                    "page_number": page_num,
                    "text": text
                })
                chunk_counter += 1
            else:
                start = 0
                while start < len(text):
                    end = start + self.chunk_size
                    chunk_text = text[start:end]
                    
                    chunks.append({
                        "chunk_id": f"{file_name}_p{page_num}_c{chunk_counter}",
                        "file_name": file_name,
                        "page_number": page_num,
                        "text": chunk_text.strip()
                    })
                    chunk_counter += 1
                    start += (self.chunk_size - self.chunk_overlap)
                    
        return chunks
