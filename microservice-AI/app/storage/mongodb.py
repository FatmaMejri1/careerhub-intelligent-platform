from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from loguru import logger
import datetime

class MongoDBManager:
    """Manager for MongoDB operations"""
    
    def __init__(self):
        self.client = None
        self.db = None
        self._initialize()

    def _initialize(self):
        try:
            self.client = AsyncIOMotorClient(settings.mongodb_uri)
            self.db = self.client[settings.mongodb_db]
            logger.info(f"Connected to MongoDB at {settings.mongodb_uri}")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")

    async def log_ai_activity(self, activity_type: str, request_data: dict, response_data: dict, metadata: dict = None):
        """Log AI activity (requests and responses) to MongoDB"""
        if self.db is None:
            return
            
        log_entry = {
            "timestamp": datetime.datetime.utcnow(),
            "activity_type": activity_type,
            "request": request_data,
            "response": response_data,
            "metadata": metadata or {}
        }
        
        try:
            await self.db.ai_logs.insert_one(log_entry)
        except Exception as e:
            logger.error(f"Failed to save AI log to MongoDB: {e}")

    async def save_analysis_result(self, collection_name: str, data: dict):
        """Save analysis results to a specific collection"""
        if self.db is None:
            return
            
        data["updated_at"] = datetime.datetime.utcnow()
        try:
            await self.db[collection_name].update_one(
                {"id": data.get("id")},
                {"$set": data},
                upsert=True
            )
        except Exception as e:
            logger.error(f"Failed to save {collection_name} to MongoDB: {e}")

# Singleton instance
mongodb_manager = MongoDBManager()
