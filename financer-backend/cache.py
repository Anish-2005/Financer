"""
Caching service for improved performance and reduced API calls.
"""

import asyncio
import json
from typing import Any, Optional
from datetime import datetime, timedelta
import redis.asyncio as redis
from dataclasses import dataclass
from enum import Enum


class CacheBackend(Enum):
    """Cache backend types"""
    MEMORY = "memory"
    REDIS = "redis"


@dataclass
class CacheItem:
    """Cache item with metadata"""
    data: Any
    expires_at: datetime
    created_at: datetime


class CacheService:
    """High-performance caching service with multiple backend support"""

    def __init__(self, backend: CacheBackend = CacheBackend.MEMORY):
        self.backend = backend
        self.memory_cache: dict[str, CacheItem] = {}
        self.redis_client: Optional[redis.Redis] = None

        if backend == CacheBackend.REDIS:
            self._init_redis()

    def _init_redis(self):
        """Initialize Redis connection"""
        try:
            import os
            redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
            self.redis_client = redis.from_url(redis_url, decode_responses=True)
        except Exception as e:
            print(f"Redis initialization failed: {e}, falling back to memory cache")
            self.backend = CacheBackend.MEMORY

    async def get(self, key: str) -> Optional[Any]:
        """Get item from cache"""
        try:
            if self.backend == CacheBackend.REDIS and self.redis_client:
                data = await self.redis_client.get(f"financer:{key}")
                if data:
                    return json.loads(data)
            else:
                # Memory cache
                item = self.memory_cache.get(key)
                if item and datetime.utcnow() < item.expires_at:
                    return item.data
                elif item:
                    # Remove expired item
                    del self.memory_cache[key]
        except Exception as e:
            print(f"Cache get error: {e}")

        return None

    async def set(self, key: str, value: Any, ttl: int = 300) -> bool:
        """Set item in cache with TTL in seconds"""
        try:
            expires_at = datetime.utcnow() + timedelta(seconds=ttl)

            if self.backend == CacheBackend.REDIS and self.redis_client:
                await self.redis_client.setex(
                    f"financer:{key}",
                    ttl,
                    json.dumps(value, default=str)
                )
            else:
                # Memory cache
                self.memory_cache[key] = CacheItem(
                    data=value,
                    expires_at=expires_at,
                    created_at=datetime.utcnow()
                )

            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False

    async def delete(self, key: str) -> bool:
        """Delete item from cache"""
        try:
            if self.backend == CacheBackend.REDIS and self.redis_client:
                await self.redis_client.delete(f"financer:{key}")
            else:
                self.memory_cache.pop(key, None)
            return True
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False

    async def clear(self) -> bool:
        """Clear all cache items"""
        try:
            if self.backend == CacheBackend.REDIS and self.redis_client:
                # Clear all financer prefixed keys
                keys = await self.redis_client.keys("financer:*")
                if keys:
                    await self.redis_client.delete(*keys)
            else:
                self.memory_cache.clear()
            return True
        except Exception as e:
            print(f"Cache clear error: {e}")
            return False

    async def get_stats(self) -> dict:
        """Get cache statistics"""
        try:
            if self.backend == CacheBackend.REDIS and self.redis_client:
                info = await self.redis_client.info()
                return {
                    "backend": "redis",
                    "keys": await self.redis_client.dbsize(),
                    "memory_used": info.get("used_memory_human", "N/A")
                }
            else:
                return {
                    "backend": "memory",
                    "keys": len(self.memory_cache),
                    "items": list(self.memory_cache.keys())
                }
        except Exception as e:
            return {"error": str(e)}

    async def cleanup_expired(self):
        """Clean up expired memory cache items (run periodically)"""
        if self.backend == CacheBackend.MEMORY:
            current_time = datetime.utcnow()
            expired_keys = [
                key for key, item in self.memory_cache.items()
                if current_time >= item.expires_at
            ]
            for key in expired_keys:
                del self.memory_cache[key]

    async def health_check(self) -> bool:
        """Check if cache service is healthy"""
        try:
            if self.backend == CacheBackend.REDIS and self.redis_client:
                await self.redis_client.ping()
            return True
        except Exception:
            return False