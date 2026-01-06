from typing import Any, Optional, Dict
import time

class MemoryCache:
    """Simple in-memory cache implementation"""
    
    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def set(self, key: str, value: Any, ttl: int = 3600):
        """Set a value in the cache with a TTL (seconds)"""
        self._cache[key] = {
            "value": value,
            "expiry": time.time() + ttl
        }

    def get(self, key: str) -> Optional[Any]:
        """Get a value from the cache, returns None if expired or not found"""
        if key not in self._cache:
            return None
            
        entry = self._cache[key]
        if time.time() > entry["expiry"]:
            del self._cache[key]
            return None
            
        return entry["value"]

    def delete(self, key: str):
        """Remove a key from the cache"""
        if key in self._cache:
            del self._cache[key]

    def clear(self):
        """Clear the entire cache"""
        self._cache = {}
