import os
import shutil
from pathlib import Path
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.domain import DocumentSchema
from app.core.config import settings
from app.core.engine import vector_store, chunker
from ai.utils.pdf_parser import DocumentParser

router = APIRouter()

# Initialize document registry with seeded docs
DOCUMENT_VAULT: List[DocumentSchema] = [
    DocumentSchema(id="1", name="OperatingSystems_Ch4.pdf", pages=42, size="1.2 MB", status="AI Ready", chunks_count=12),
    DocumentSchema(id="2", name="DataStructures_B-Trees.docx", pages=18, size="850 KB", status="AI Ready", chunks_count=8),
    DocumentSchema(id="3", name="DBMS_Normalization.pdf", pages=64, size="2.4 MB", status="AI Ready", chunks_count=16),
]

@router.get("/documents", response_model=List[DocumentSchema])
def list_documents():
    return DOCUMENT_VAULT

@router.post("/documents/upload", response_model=DocumentSchema)
async def upload_document(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file filename provided")

    # Ensure upload directory exists
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    dest_path = upload_dir / file.filename
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Calculate readable file size
    size_bytes = os.path.getsize(dest_path)
    if size_bytes >= 1024 * 1024:
        size_str = f"{size_bytes / (1024 * 1024):.1f} MB"
    else:
        size_str = f"{max(1, size_bytes // 1024)} KB"

    # Parse document pages
    try:
        pages = DocumentParser.parse(str(dest_path))
    except Exception:
        pages = [{"page_number": 1, "content": f"Content from uploaded document {file.filename}"}]

    # Chunk and index
    doc_id = str(len(DOCUMENT_VAULT) + 1)
    text_chunks = chunker.chunk_document_pages(pages, file.filename)
    indexed_count = vector_store.add_document_chunks(doc_id, file.filename, text_chunks)

    doc = DocumentSchema(
        id=doc_id,
        name=file.filename,
        pages=len(pages),
        size=size_str,
        status="AI Ready",
        chunks_count=indexed_count
    )
    DOCUMENT_VAULT.insert(0, doc)
    return doc

@router.delete("/documents/{doc_id}")
def delete_document(doc_id: str):
    global DOCUMENT_VAULT
    DOCUMENT_VAULT = [d for d in DOCUMENT_VAULT if d.id != doc_id]
    vector_store.delete_document(doc_id)
    return {"message": "Document removed from AI Knowledge Base", "id": doc_id}
