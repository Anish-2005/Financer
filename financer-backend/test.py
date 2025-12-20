"""
Comprehensive test suite for the Financer API.
"""

import asyncio
import pytest
import httpx
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
import json

from main import app
from models import SignUpSchema, LoginSchema, ChatRequest
from nse_data import NSEDataService
from cache import CacheService
from database import DatabaseService


@pytest.fixture
def client():
    """Test client fixture"""
    return TestClient(app)


@pytest.fixture
def mock_firebase():
    """Mock Firebase authentication"""
    with patch('firebase_admin.auth') as mock_auth:
        mock_auth.create_user.return_value = Mock(uid="test_uid_123")
        mock_auth.verify_id_token.return_value = {
            "uid": "test_uid_123",
            "email": "test@example.com"
        }
        yield mock_auth


@pytest.fixture
def mock_gemini():
    """Mock Google Gemini AI"""
    with patch('google.generativeai.GenerativeModel') as mock_model:
        mock_response = Mock()
        mock_response.text = "This is a test AI response about investing in index funds."
        mock_model.return_value.generate_content.return_value = mock_response
        yield mock_model


class TestAuthentication:
    """Test authentication endpoints"""

    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data

    def test_signup_validation(self, client):
        """Test signup input validation"""
        # Test weak password
        response = client.post("/auth/signup", json={
            "email": "test@example.com",
            "password": "123"
        })
        assert response.status_code == 422

        # Test invalid email
        response = client.post("/auth/signup", json={
            "email": "invalid-email",
            "password": "SecurePass123"
        })
        assert response.status_code == 422

    @patch('firebase_admin.auth')
    def test_signup_success(self, mock_auth, client):
        """Test successful signup"""
        mock_auth.create_user.return_value = Mock(uid="test_uid_123")

        response = client.post("/auth/signup", json={
            "email": "test@example.com",
            "password": "SecurePass123",
            "display_name": "Test User"
        })

        assert response.status_code == 201
        data = response.json()
        assert "message" in data
        assert data["uid"] == "test_uid_123"

    def test_login_validation(self, client):
        """Test login input validation"""
        response = client.post("/auth/login", json={
            "email": "invalid-email",
            "password": ""
        })
        assert response.status_code == 422


class TestNSEDataService:
    """Test NSE data service"""

    @pytest.fixture
    def nse_service(self):
        """NSE service fixture"""
        return NSEDataService()

    def test_safe_float_parse(self, nse_service):
        """Test safe float parsing"""
        assert nse_service._safe_float_parse("123.45") == 123.45
        assert nse_service._safe_float_parse("N/A") is None
        assert nse_service._safe_float_parse(None) is None
        assert nse_service._safe_float_parse("") is None

    def test_safe_int_parse(self, nse_service):
        """Test safe integer parsing"""
        assert nse_service._safe_int_parse("123") == 123
        assert nse_service._safe_int_parse("123.45") == 123
        assert nse_service._safe_int_parse("N/A") is None

    @patch('requests.Session')
    def test_fd_calculation(self, mock_session, nse_service):
        """Test FD calculation"""
        result = asyncio.run(nse_service.calculate_fd_returns(
            principal=100000,
            rate=7.5,
            tenure=24,
            compounding_frequency="quarterly"
        ))

        assert result["principal"] == 100000
        assert result["maturity_amount"] > 100000
        assert result["interest_earned"] > 0
        assert "breakdown" in result
        assert len(result["breakdown"]) > 0


class TestCacheService:
    """Test cache service"""

    @pytest.fixture
    def cache_service(self):
        """Cache service fixture"""
        return CacheService(backend="memory")

    @pytest.mark.asyncio
    async def test_cache_operations(self, cache_service):
        """Test basic cache operations"""
        # Test set and get
        await cache_service.set("test_key", {"data": "test_value"}, ttl=60)
        result = await cache_service.get("test_key")
        assert result == {"data": "test_value"}

        # Test delete
        await cache_service.delete("test_key")
        result = await cache_service.get("test_key")
        assert result is None

        # Test clear
        await cache_service.set("key1", "value1")
        await cache_service.set("key2", "value2")
        await cache_service.clear()

        stats = await cache_service.get_stats()
        assert stats["keys"] == 0


class TestDatabaseService:
    """Test database service"""

    @pytest.fixture
    def db_service(self):
        """Database service fixture"""
        return DatabaseService()

    @pytest.mark.asyncio
    async def test_user_operations(self, db_service):
        """Test user profile operations"""
        await db_service.connect()

        # Create user
        user_data = {
            "uid": "test_user_123",
            "email": "test@example.com",
            "display_name": "Test User"
        }

        await db_service.create_user_profile(user_data)

        # Get user
        profile = await db_service.get_user_profile("test_user_123")
        assert profile["email"] == "test@example.com"
        assert profile["display_name"] == "Test User"

        await db_service.disconnect()


class TestAPIEndpoints:
    """Test API endpoints"""

    @patch('firebase_admin.auth')
    @patch('google.generativeai.GenerativeModel')
    def test_chat_endpoint(self, mock_model_class, mock_auth, client):
        """Test AI chat endpoint"""
        # Mock authentication
        mock_auth.verify_id_token.return_value = {
            "uid": "test_uid",
            "email": "test@example.com"
        }

        # Mock AI response
        mock_model = Mock()
        mock_response = Mock()
        mock_response.text = "Test AI response"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model

        response = client.post(
            "/ai/chat",
            json={"message": "What is compound interest?"},
            headers={"Authorization": "Bearer fake_token"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert data["response"] == "Test AI response"

    def test_fd_calculator(self, client):
        """Test FD calculator endpoint"""
        response = client.post("/calculator/fd", json={
            "principal": 100000,
            "rate": 7.5,
            "tenure": 24,
            "compounding_frequency": "quarterly"
        })

        assert response.status_code == 200
        data = response.json()
        assert "maturity_amount" in data
        assert "interest_earned" in data
        assert data["maturity_amount"] > 100000

    def test_rate_limiting(self, client):
        """Test rate limiting"""
        # Make multiple requests quickly
        responses = []
        for _ in range(25):  # Exceed rate limit
            response = client.get("/stocks")
            responses.append(response.status_code)

        # Should have some rate limited responses
        assert 429 in responses  # Too Many Requests


class TestErrorHandling:
    """Test error handling"""

    def test_invalid_json(self, client):
        """Test invalid JSON handling"""
        response = client.post(
            "/auth/signup",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422

    def test_missing_fields(self, client):
        """Test missing required fields"""
        response = client.post("/auth/signup", json={})
        assert response.status_code == 422

    def test_invalid_token(self, client):
        """Test invalid JWT token"""
        response = client.get(
            "/auth/verify",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401


# Integration tests
class TestIntegration:
    """Integration tests"""

    @pytest.mark.asyncio
    async def test_full_user_flow(self):
        """Test complete user registration and authentication flow"""
        async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
            # Register user
            signup_data = {
                "email": "integration@test.com",
                "password": "SecurePass123",
                "display_name": "Integration Test"
            }

            with patch('firebase_admin.auth') as mock_auth:
                mock_auth.create_user.return_value = Mock(uid="integration_uid")

                response = await client.post("/auth/signup", json=signup_data)
                assert response.status_code == 201

            # Login user
            with patch('pyrebase.initialize_app') as mock_pyrebase:
                mock_auth_instance = Mock()
                mock_user = Mock()
                mock_user.idToken = "fake_token"
                mock_user.refreshToken = "fake_refresh"
                mock_auth_instance.sign_in_with_email_and_password.return_value = mock_user
                mock_pyrebase.return_value.auth.return_value = mock_auth_instance

                login_data = {
                    "email": "integration@test.com",
                    "password": "SecurePass123"
                }

                response = await client.post("/auth/login", json=login_data)
                assert response.status_code == 200

                login_response = response.json()
                assert "token" in login_response


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v"])