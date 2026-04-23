from typing import List, Dict, Any, Optional
import os
from loguru import logger

try:
    import chromadb
    from chromadb.utils import embedding_functions
    CHROMA_AVAILABLE = True
except ImportError:
    CHROMA_AVAILABLE = False
    logger.warning("chromadb not installed. Falling back to SimplerVectorStore.")

from app.storage.vector.simpler_store import SimplerVectorStore

class ChromaVectorStore:
    """Wrapper for ChromaDB vector storage with fallback to NumPy-based store"""
    
    def __init__(self, collection_name: str = "smart_career_hub", persist_directory: str = "data/chroma"):
        self.persist_directory = persist_directory
        self.use_fallback = not CHROMA_AVAILABLE
        
        if not self.use_fallback:
            try:
                # Ensure data directory exists
                os.makedirs(persist_directory, exist_ok=True)
                # Initialize Persistent Client
                self.client = chromadb.PersistentClient(path=persist_directory)
                
                # Use a default sentence-transformer model for embeddings
                self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
                    model_name="all-MiniLM-L6-v2"
                )
                
                self.collection = self.client.get_or_create_collection(
                    name=collection_name,
                    embedding_function=self.embedding_function
                )
                logger.info(f"ChromaDB initialized: collection={collection_name}")
            except Exception as e:
                logger.error(f"Failed to initialize ChromaDB: {e}. Falling back.")
                self.use_fallback = True
        
        if self.use_fallback:
            self.fallback_store = SimplerVectorStore(collection_name, "data/simpler_vectors")

    def add_texts(self, texts: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        """Add texts to the collection"""
        if self.use_fallback:
            return self.fallback_store.add_texts(texts, metadatas, ids)
            
        self.collection.add(
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )

    def query(self, query_text: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """Query the collection for similar documents"""
        if self.use_fallback:
            return self.fallback_store.query(query_text, n_results)
            
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        
        # Format results to be easier to use
        formatted_results = []
        if results and results['documents']:
            for i in range(len(results['documents'][0])):
                formatted_results.append({
                    "document": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i],
                    "id": results['ids'][0][i],
                    "distance": results['distances'][0][i] if 'distances' in results else None
                })
        
        return formatted_results

    def count(self) -> int:
        """Return the number of items in the collection"""
        if self.use_fallback:
            return self.fallback_store.count()
        return self.collection.count()
