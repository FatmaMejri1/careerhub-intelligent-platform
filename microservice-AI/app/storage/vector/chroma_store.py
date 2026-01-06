import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from typing import List, Dict, Any, Optional
import os
from loguru import logger

class ChromaVectorStore:
    """Interface for ChromaDB vector storage"""
    
    def __init__(self, collection_name: str = "courses"):
        # Create persistence directory
        self.persist_path = os.path.join(os.getcwd(), "data", "chromadb")
        os.makedirs(self.persist_path, exist_ok=True)
        
        # Initialize client
        self.client = chromadb.PersistentClient(path=self.persist_path)
        
        # Use simple sentence-transformer for embeddings
        try:
            self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="all-MiniLM-L6-v2"
            )
        except Exception as e:
            logger.warning(f"Failed to load SentenceTransformer: {e}. Falling back to default embeddings.")
            self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_fn
        )
        
        logger.info(f"Initialized ChromaDB with collection '{collection_name}' at {self.persist_path}")

    def add_texts(
        self, 
        texts: List[str], 
        metadatas: List[Dict[str, Any]], 
        ids: List[str]
    ):
        """Add texts to valid collection"""
        try:
            self.collection.add(
                documents=texts,
                metadatas=metadatas,
                ids=ids
            )
            logger.info(f"Added {len(texts)} items to ChromaDB")
        except Exception as e:
            logger.error(f"Failed to add items to ChromaDB: {str(e)}")
            raise

    def query(
        self, 
        query_text: str, 
        n_results: int = 3,
        where: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Query similar items"""
        try:
            results = self.collection.query(
                query_texts=[query_text],
                n_results=n_results,
                where=where
            )
            
            # Reformat results
            formatted_results = []
            if results["ids"]:
                for i in range(len(results["ids"][0])):
                    item = {
                        "id": results["ids"][0][i],
                        "metadata": results["metadatas"][0][i],
                        "document": results["documents"][0][i],
                        "distance": results["distances"][0][i] if results["distances"] else None
                    }
                    formatted_results.append(item)
                    
            return formatted_results
            
        except Exception as e:
            logger.error(f"ChromaDB query failed: {str(e)}")
            return []

    def count(self) -> int:
        """Count items in collection"""
        return self.collection.count()
