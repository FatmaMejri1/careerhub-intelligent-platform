import chromadb
from chromadb.utils import embedding_functions
from typing import List, Dict, Any, Optional
import os
from loguru import logger

class ChromaVectorStore:
    """Simple wrapper for ChromaDB vector storage"""
    
    def __init__(self, collection_name: str = "smart_career_hub", persist_directory: str = "data/chroma"):
        self.persist_directory = persist_directory
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
        logger.info(f"ChromaDB initialized: collection={collection_name}, path={persist_directory}")

    def add_texts(self, texts: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        """Add texts to the collection"""
        self.collection.add(
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )

    def query(self, query_text: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """Query the collection for similar documents"""
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        
        # Format results to be easier to Use
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
        return self.collection.count()
