"""
Contexta Engine Singleton & State Management
Initializes and binds the AI layer, Vector Store, and Genie agents to FastAPI.
"""
import sys
from pathlib import Path

# Ensure root workspace directory is always on sys.path
ROOT_DIR = Path(__file__).resolve().parents[3]
BACKEND_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from ai.gateway.manager import AIGatewayManager
from ai.rag.vector_store import ContextaVectorStore
from ai.rag.chunker import SemanticChunker
from ai.agents.genie_gatekeeper import GenieGatekeeper
from ai.agents.knowledge_genie import KnowledgeGenie
from ai.agents.wisdom_genie import WisdomGenie
from ai.agents.challenge_genie import ChallengeGenie

# Global singletons
gateway = AIGatewayManager()
vector_store = ContextaVectorStore()
chunker = SemanticChunker(chunk_size=400, chunk_overlap=80)
gatekeeper = GenieGatekeeper()
knowledge_genie = KnowledgeGenie(gateway=gateway, vector_store=vector_store)
wisdom_genie = WisdomGenie(gateway=gateway, vector_store=vector_store)
challenge_genie = ChallengeGenie(gateway=gateway, vector_store=vector_store)

def seed_default_knowledge_vault():
    """Pre-indexes sample curriculum documents with realistic chunks for immediate RAG testing."""
    sample_docs = [
        {
            "id": "1",
            "name": "OperatingSystems_Ch4.pdf",
            "pages": [
                {
                    "page_number": 18,
                    "content": (
                        "Chapter 4: Deadlocks. A deadlock is a condition in a multi-process system where two or more processes "
                        "are unable to proceed because each is waiting for the other to release resources. "
                        "Four Coffman conditions must hold simultaneously for a deadlock: "
                        "1. Mutual Exclusion: At least one resource must be held in non-shareable mode. "
                        "2. Hold and Wait: A process holds at least one resource while waiting for another. "
                        "3. No Preemption: Resources cannot be preempted forcibly. "
                        "4. Circular Wait: A closed chain of processes exists where each process waits for a resource held by the next."
                    )
                },
                {
                    "page_number": 24,
                    "content": (
                        "Deadlock Avoidance and Banker's Algorithm. Dijkstra's Banker's algorithm tests for safety by simulating the allocation "
                        "for predetermined maximum possible amounts of all resources, and then makes an 's-state' check to test for possible activities, "
                        "before deciding whether allocation should be allowed to continue."
                    )
                }
            ]
        },
        {
            "id": "2",
            "name": "DataStructures_B-Trees.docx",
            "pages": [
                {
                    "page_number": 4,
                    "content": (
                        "B-Trees and Balanced Indexing. A B-tree is a self-balancing search tree in which every node contains a large number of keys. "
                        "The time complexity for search, insert, and delete operations is O(log n). "
                        "B-Trees are widely optimized for systems that read and write large blocks of memory on disk storage, such as DBMS indexes."
                    )
                }
            ]
        },
        {
            "id": "3",
            "name": "DBMS_Normalization.pdf",
            "pages": [
                {
                    "page_number": 12,
                    "content": (
                        "Database Normalization: 1NF requires atomic values. 2NF removes partial functional dependencies on a composite key. "
                        "3NF eliminates transitive dependencies (non-prime attributes must depend only on candidate keys). "
                        "Boyce-Codd Normal Form (BCNF) enforces that for any functional dependency X -> Y, X must be a superkey."
                    )
                }
            ]
        }
    ]

    for doc in sample_docs:
        chunks = chunker.chunk_document_pages(doc["pages"], doc["name"])
        vector_store.add_document_chunks(doc["id"], doc["name"], chunks)

# Seed on import
seed_default_knowledge_vault()
