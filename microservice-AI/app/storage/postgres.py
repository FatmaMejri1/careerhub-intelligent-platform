import asyncpg
import json
import datetime
from app.config import settings
from loguru import logger

class PostgresManager:
    """Manager for PostgreSQL operations (replacing MongoDB)"""
    
    def __init__(self):
        self.pool = None

    async def _initialize(self):
        if self.pool is None:
            try:
                # Construct postgres URL from settings or use a default
                # We'll use the same credentials as Java backend
                db_url = "postgresql://postgres:admin@localhost:5432/carrerhub"
                self.pool = await asyncpg.create_pool(db_url)
                logger.info(f"Connected to PostgreSQL for AI storage")
                
                # Create consolidated logs table
                async with self.pool.acquire() as conn:
                    await conn.execute("""
                        CREATE TABLE IF NOT EXISTS ai_logs (
                            id SERIAL PRIMARY KEY,
                            timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            activity_type TEXT,
                            entity_id TEXT,
                            request_data JSONB,
                            response_data JSONB,
                            metadata JSONB
                        );
                    """)
                    # Clean up old tables if they exist
                    await conn.execute("DROP TABLE IF EXISTS ai_activities;")
                    await conn.execute("DROP TABLE IF EXISTS ai_analysis_results;")
            except Exception as e:
                logger.error(f"Failed to connect to PostgreSQL: {e}")

    async def log_ai_activity(self, activity_type: str, request_data: dict, response_data: dict, metadata: dict = None, entity_id: str = None):
        """Log AI activity to PostgreSQL"""
        await self._initialize()
        if self.pool is None:
            return
            
        try:
            async with self.pool.acquire() as conn:
                await conn.execute(
                    "INSERT INTO ai_logs (activity_type, entity_id, request_data, response_data, metadata) VALUES ($1, $2, $3, $4, $5)",
                    activity_type,
                    entity_id,
                    json.dumps(request_data, default=str), 
                    json.dumps(response_data, default=str), 
                    json.dumps(metadata or {}, default=str)
                )
        except Exception as e:
            logger.error(f"Failed to save AI log: {e}")

    async def save_analysis_result(self, collection_name: str, data: dict):
        """Save analysis results to AI logs (consolidated)"""
        # We reuse log_ai_activity with a specific type
        entity_id = str(data.get("id", ""))
        await self.log_ai_activity(
            activity_type=f"analysis_{collection_name}",
            entity_id=entity_id,
            request_data={"action": "save_result", "collection": collection_name},
            response_data=data
        )

# Singleton instance
postgres_manager = PostgresManager()
