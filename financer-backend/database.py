"""
Database service for user data, portfolios, and analytics.
Supports multiple database backends with a clean interface.
"""

import os
import asyncio
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime
from abc import ABC, abstractmethod

import motor.motor_asyncio
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logger = logging.getLogger(__name__)


class DatabaseBackend(ABC):
    """Abstract base class for database backends"""

    @abstractmethod
    async def connect(self):
        pass

    @abstractmethod
    async def disconnect(self):
        pass

    @abstractmethod
    async def create_user_profile(self, user_data: dict):
        pass

    @abstractmethod
    async def get_user_profile(self, uid: str):
        pass

    @abstractmethod
    async def update_user_portfolio(self, uid: str, portfolio_data: dict):
        pass

    @abstractmethod
    async def get_user_portfolio(self, uid: str):
        pass

    @abstractmethod
    async def log_chat_interaction(self, interaction_data: dict):
        pass

    @abstractmethod
    async def get_user_analytics(self, uid: str):
        pass


class MongoDBBackend(DatabaseBackend):
    """MongoDB implementation of database backend"""

    def __init__(self):
        self.client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
        self.db = None
        self.connection_string = os.getenv(
            "MONGODB_URL",
            "mongodb://localhost:27017"
        )
        self.database_name = os.getenv("DATABASE_NAME", "financer")

    async def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(
                self.connection_string,
                serverSelectionTimeoutMS=5000
            )
            # Test connection
            await self.client.admin.command('ping')
            self.db = self.client[self.database_name]
            logger.info("Connected to MongoDB successfully")
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"MongoDB connection failed: {e}")
            raise

    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            logger.info("Disconnected from MongoDB")

    async def create_user_profile(self, user_data: dict):
        """Create user profile"""
        user_data["created_at"] = datetime.utcnow()
        user_data["updated_at"] = datetime.utcnow()
        result = await self.db.users.insert_one(user_data)
        return result.inserted_id

    async def get_user_profile(self, uid: str):
        """Get user profile"""
        return await self.db.users.find_one({"uid": uid})

    async def update_user_portfolio(self, uid: str, portfolio_data: dict):
        """Update user portfolio"""
        portfolio_data["updated_at"] = datetime.utcnow()
        await self.db.portfolios.update_one(
            {"uid": uid},
            {"$set": portfolio_data, "$setOnInsert": {"created_at": datetime.utcnow()}},
            upsert=True
        )

    async def get_user_portfolio(self, uid: str):
        """Get user portfolio"""
        portfolio = await self.db.portfolios.find_one({"uid": uid})
        if not portfolio:
            # Return default empty portfolio
            return {
                "total_value": 0.0,
                "total_gain_loss": 0.0,
                "total_gain_loss_percent": 0.0,
                "holdings": [],
                "last_updated": datetime.utcnow()
            }
        return portfolio

    async def log_chat_interaction(self, interaction_data: dict):
        """Log AI chat interaction"""
        interaction_data["timestamp"] = datetime.utcnow()
        await self.db.chat_logs.insert_one(interaction_data)

    async def get_user_analytics(self, uid: str):
        """Get user analytics"""
        # Aggregate chat interactions
        chat_stats = await self.db.chat_logs.aggregate([
            {"$match": {"user_id": uid}},
            {"$group": {
                "_id": None,
                "total_interactions": {"$sum": 1},
                "avg_response_length": {"$avg": {"$strLenCP": "$response"}},
                "last_interaction": {"$max": "$timestamp"}
            }}
        ]).to_list(length=1)

        # Get portfolio performance over time
        portfolio_history = await self.db.portfolio_history.find(
            {"uid": uid}
        ).sort("date", -1).limit(30).to_list(length=None)

        return {
            "chat_stats": chat_stats[0] if chat_stats else {},
            "portfolio_history": portfolio_history
        }


class InMemoryBackend(DatabaseBackend):
    """In-memory database for development/testing"""

    def __init__(self):
        self.users = {}
        self.portfolios = {}
        self.chat_logs = []

    async def connect(self):
        logger.info("Connected to in-memory database")

    async def disconnect(self):
        logger.info("Disconnected from in-memory database")

    async def create_user_profile(self, user_data: dict):
        uid = user_data["uid"]
        self.users[uid] = {**user_data, "created_at": datetime.utcnow()}
        return uid

    async def get_user_profile(self, uid: str):
        return self.users.get(uid)

    async def update_user_portfolio(self, uid: str, portfolio_data: dict):
        self.portfolios[uid] = {
            **portfolio_data,
            "updated_at": datetime.utcnow()
        }

    async def get_user_portfolio(self, uid: str):
        return self.portfolios.get(uid, {
            "total_value": 0.0,
            "total_gain_loss": 0.0,
            "total_gain_loss_percent": 0.0,
            "holdings": [],
            "last_updated": datetime.utcnow()
        })

    async def log_chat_interaction(self, interaction_data: dict):
        self.chat_logs.append({
            **interaction_data,
            "timestamp": datetime.utcnow()
        })

    async def get_user_analytics(self, uid: str):
        user_logs = [log for log in self.chat_logs if log["user_id"] == uid]
        return {
            "chat_stats": {
                "total_interactions": len(user_logs),
                "avg_response_length": sum(len(log.get("response", "")) for log in user_logs) / len(user_logs) if user_logs else 0,
                "last_interaction": max((log["timestamp"] for log in user_logs), default=None)
            },
            "portfolio_history": []
        }


class DatabaseService:
    """Main database service with backend abstraction"""

    def __init__(self):
        backend_type = os.getenv("DATABASE_BACKEND", "memory").lower()

        if backend_type == "mongodb":
            self.backend = MongoDBBackend()
        else:
            self.backend = InMemoryBackend()

    async def connect(self):
        """Connect to database"""
        await self.backend.connect()

    async def disconnect(self):
        """Disconnect from database"""
        await self.backend.disconnect()

    async def create_user_profile(self, user_data: dict):
        """Create user profile"""
        return await self.backend.create_user_profile(user_data)

    async def get_user_profile(self, uid: str):
        """Get user profile"""
        return await self.backend.get_user_profile(uid)

    async def update_user_portfolio(self, uid: str, portfolio_data: dict):
        """Update user portfolio"""
        await self.backend.update_user_portfolio(uid, portfolio_data)

    async def get_user_portfolio(self, uid: str):
        """Get user portfolio"""
        return await self.backend.get_user_portfolio(uid)

    async def log_chat_interaction(self, interaction_data: dict):
        """Log AI chat interaction"""
        await self.backend.log_chat_interaction(interaction_data)

    async def get_user_analytics(self, uid: str):
        """Get user analytics"""
        return await self.backend.get_user_analytics(uid)

    async def health_check(self) -> bool:
        """Check database health"""
        try:
            # Simple health check - try to get a user profile
            await self.get_user_profile("health_check_user")
            return True
        except Exception:
            return False