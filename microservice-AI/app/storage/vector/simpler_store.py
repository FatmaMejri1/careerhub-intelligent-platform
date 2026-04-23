import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
import pickle
import os
from typing import List, Dict, Any
from loguru import logger
from app.config import settings

class SimplerVectorStore:
    """A simpler vector store using NumPy and Gemini Embeddings as a fallback for ChromaDB"""
    
    def __init__(self, collection_name: str = "smart_career_hub", persist_directory: str = "data/simpler_vectors"):
        self.persist_directory = persist_directory
        self.collection_file = os.path.join(persist_directory, f"{collection_name}.pkl")
        os.makedirs(persist_directory, exist_ok=True)
        
        # Configure Gemini
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model_name = "models/embedding-001"
            logger.info(f"Using Gemini embeddings for SimplerVectorStore")
        else:
            logger.warning("GEMINI_API_KEY not found. SimplerVectorStore will use random vectors (MOCK).")
            self.model_name = None
        
        # Load data if exists
        self.data = self._load()
        logger.info(f"SimplerVectorStore initialized with {len(self.data['ids'])} items")

    def _load(self):
        if os.path.exists(self.collection_file):
            try:
                with open(self.collection_file, "rb") as f:
                    return pickle.load(f)
            except Exception as e:
                logger.error(f"Failed to load vector store: {e}")
        return {"ids": [], "texts": [], "embeddings": [], "metadatas": []}

    def _save(self):
        try:
            with open(self.collection_file, "wb") as f:
                pickle.dump(self.data, f)
        except Exception as e:
            logger.error(f"Failed to save vector store: {e}")

    def _get_embeddings(self, texts: List[str]) -> np.ndarray:
        if self.model_name:
            try:
                result = genai.embed_content(
                    model=self.model_name,
                    content=texts,
                    task_type="retrieval_document"
                )
                return np.array(result['embedding'])
            except Exception as e:
                logger.error(f"Gemini embedding failed: {e}")
        
        # Fallback to random vectors if Gemini fails or is missing
        logger.warning("Using random vectors as fallback for embedding")
        return np.random.rand(len(texts), 768)

    def add_texts(self, texts: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        """Add texts to the store"""
        if not texts:
            return
            
        embeddings = self._get_embeddings(texts)
        
        self.data["ids"].extend(ids)
        self.data["texts"].extend(texts)
        self.data["metadatas"].extend(metadatas)
        
        if len(self.data["embeddings"]) == 0:
            self.data["embeddings"] = embeddings
        else:
            self.data["embeddings"] = np.vstack([self.data["embeddings"], embeddings])
            
        self._save()
        logger.info(f"Added {len(texts)} texts to SimplerVectorStore")

    def query(self, query_text: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """Query similar documents"""
        if not self.data["ids"] or len(self.data["ids"]) == 0:
            return []
            
        query_embedding = self._get_embeddings([query_text])
        
        # Ensure embeddings is a 2D array
        if len(self.data["embeddings"].shape) == 1:
             self.data["embeddings"] = self.data["embeddings"].reshape(1, -1)

        similarities = cosine_similarity(query_embedding, self.data["embeddings"])[0]
        
        # Sort by similarity
        top_indices = np.argsort(similarities)[::-1][:n_results]
        
        results = []
        for idx in top_indices:
            results.append({
                "document": self.data["texts"][idx],
                "metadata": self.data["metadatas"][idx],
                "id": self.data["ids"][idx],
                "distance": float(1.0 - similarities[idx])
            })
            
        return results

    def count(self) -> int:
        return len(self.data["ids"])
