"""
Unit Test Suite for Contexta AI Intelligence Layer
Tests: GenieGatekeeper, SemanticChunker, ContextaVectorStore, KnowledgeGenie, WisdomGenie, ChallengeGenie.
"""
import sys
from pathlib import Path
import pytest

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from ai.agents.genie_gatekeeper import GenieGatekeeper
from ai.agents.knowledge_genie import KnowledgeGenie
from ai.agents.wisdom_genie import WisdomGenie
from ai.agents.challenge_genie import ChallengeGenie
from ai.rag.chunker import SemanticChunker
from ai.rag.vector_store import ContextaVectorStore
from ai.gateway.manager import AIGatewayManager

@pytest.fixture
def gatekeeper():
    return GenieGatekeeper()

@pytest.fixture
def chunker():
    return SemanticChunker(chunk_size=300, chunk_overlap=50)

@pytest.fixture
def vector_store():
    return ContextaVectorStore()

@pytest.fixture
def gateway():
    return AIGatewayManager()

def test_genie_gatekeeper_routing(gatekeeper):
    quiz_res = gatekeeper.classify_intent("Generate 5 MCQs on Deadlocks")
    assert "Challenge Genie" in quiz_res["selected_agent"]

    summary_res = gatekeeper.classify_intent("Summarize chapter 3 notes")
    assert "Wisdom Genie" in summary_res["selected_agent"]

    concept_res = gatekeeper.classify_intent("What is a binary search tree?")
    assert "Knowledge Genie" in concept_res["selected_agent"]

def test_semantic_chunker(chunker):
    pages = [
        {
            "page_number": 1,
            "content": "Short page text."
        },
        {
            "page_number": 2,
            "content": "A" * 700  # Longer than chunk_size (300)
        }
    ]
    chunks = chunker.chunk_document_pages(pages, "TestDoc.pdf")
    assert len(chunks) >= 3
    assert chunks[0]["file_name"] == "TestDoc.pdf"
    assert chunks[0]["page_number"] == 1
    assert "chunk_id" in chunks[0]

def test_vector_store_indexing_and_retrieval(vector_store):
    chunks = [
        {
            "chunk_id": "c1",
            "page_number": 5,
            "text": "Cache coherency protocols like MESI maintain consistent state in multicore architectures."
        },
        {
            "chunk_id": "c2",
            "page_number": 12,
            "text": "Deadlock avoidance ensures that the system never enters an unsafe state using Banker's Algorithm."
        }
    ]
    
    indexed = vector_store.add_document_chunks("doc_test", "OS_Notes.pdf", chunks)
    assert indexed == 2

    # Query matching chunk 2
    results = vector_store.retrieve_similar_chunks("Deadlock avoidance banker", document_id="doc_test")
    assert len(results) >= 1
    top = results[0]
    assert "Deadlock" in top["text"]
    assert top["page"] == "12"
    assert top["file"] == "OS_Notes.pdf"

    # Delete
    deleted = vector_store.delete_document("doc_test")
    assert deleted == 2
    assert len(vector_store.retrieve_similar_chunks("Deadlock", document_id="doc_test")) == 0

def test_knowledge_genie_grounded_answer(gateway, vector_store):
    chunks = [{
        "chunk_id": "test_c1",
        "page_number": 22,
        "text": "Virtual Memory uses paging and page tables to map virtual addresses to physical frames."
    }]
    vector_store.add_document_chunks("vm_doc", "MemoryManagement.pdf", chunks)

    genie = KnowledgeGenie(gateway=gateway, vector_store=vector_store)
    res = genie.answer_query(
        prompt="Explain Virtual Memory and paging",
        explain_mode="Teacher",
        document_id="vm_doc"
    )

    assert "Virtual Memory" in res["answer"] or "paging" in res["answer"]
    assert res["citation"]["file"] == "MemoryManagement.pdf"
    assert res["citation"]["page"] == "22"
    assert res["selected_agent"] == "📖 Knowledge Genie"

def test_wisdom_genie_summary(gateway, vector_store):
    genie = WisdomGenie(gateway=gateway, vector_store=vector_store)
    res = genie.generate_summary(
        document_id="dummy_doc",
        format_type="Bullet Notes",
        tone="Professor"
    )
    assert res["format"] == "Bullet Notes"
    assert "Wisdom Genie" in res["summary"]
    assert len(res["key_points"]) > 0

def test_challenge_genie_quiz(gateway, vector_store):
    genie = ChallengeGenie(gateway=gateway, vector_store=vector_store)
    res = genie.generate_quiz(
        document_id="dummy_doc",
        difficulty="Hard",
        question_count=4
    )
    assert res["difficulty"] == "Hard"
    assert len(res["questions"]) == 4
    for q in res["questions"]:
        assert len(q["options"]) == 4
        assert 0 <= q["correct_index"] <= 3
