"""
Data models for the Financer API using Pydantic.
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime


class UserRole(str, Enum):
    """User role enumeration"""
    USER = "user"
    PREMIUM = "premium"
    ADMIN = "admin"


class SignUpSchema(BaseModel):
    """User registration schema"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    display_name: Optional[str] = Field(None, description="Display name")

    @validator('password')
    def password_strength(cls, v):
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123",
                "display_name": "John Doe"
            }
        }


class LoginSchema(BaseModel):
    """User login schema"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123"
            }
        }


class ChatRequest(BaseModel):
    """AI chat request schema"""
    message: str = Field(..., min_length=1, max_length=2000, description="User message")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "What are the best investment options for someone in their 30s?"
            }
        }


class StockData(BaseModel):
    """Individual stock data model"""
    symbol: str
    name: str
    price: float
    change: float
    change_percent: Optional[float]
    volume: Optional[int]
    market_cap: Optional[float]
    pe_ratio: Optional[float]
    dividend_yield: Optional[float]
    sector: Optional[str]
    last_updated: Optional[datetime]

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "RELIANCE",
                "name": "Reliance Industries Ltd",
                "price": 2500.50,
                "change": 25.30,
                "change_percent": 1.02,
                "volume": 2500000,
                "market_cap": 1500000000000,
                "pe_ratio": 28.5,
                "dividend_yield": 0.35,
                "sector": "Energy",
                "last_updated": "2025-12-20T10:30:00Z"
            }
        }


class PortfolioHolding(BaseModel):
    """Individual portfolio holding"""
    symbol: str
    quantity: int
    average_price: float
    current_price: Optional[float]
    total_value: Optional[float]
    gain_loss: Optional[float]
    gain_loss_percent: Optional[float]


class PortfolioData(BaseModel):
    """User portfolio data"""
    total_value: float
    total_gain_loss: float
    total_gain_loss_percent: float
    holdings: List[PortfolioHolding]
    last_updated: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "total_value": 2000000.00,
                "total_gain_loss": 248000.00,
                "total_gain_loss_percent": 14.15,
                "holdings": [
                    {
                        "symbol": "RELIANCE",
                        "quantity": 100,
                        "average_price": 2200.00,
                        "current_price": 2500.50,
                        "total_value": 250050.00,
                        "gain_loss": 30050.00,
                        "gain_loss_percent": 13.66
                    }
                ],
                "last_updated": "2025-12-20T10:30:00Z"
            }
        }


class FDCalculatorRequest(BaseModel):
    """Fixed Deposit calculator request"""
    principal: float = Field(..., gt=0, description="Principal amount")
    rate: float = Field(..., gt=0, lt=50, description="Annual interest rate (%)")
    tenure: int = Field(..., gt=0, le=120, description="Tenure in months")
    compounding_frequency: str = Field(
        "quarterly",
        pattern="^(monthly|quarterly|half-yearly|yearly)$",
        description="Compounding frequency"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "principal": 100000,
                "rate": 7.5,
                "tenure": 24,
                "compounding_frequency": "quarterly"
            }
        }


class FDCalculatorResponse(BaseModel):
    """Fixed Deposit calculator response"""
    principal: float
    interest_earned: float
    maturity_amount: float
    effective_rate: float
    breakdown: Dict[str, Any]

    class Config:
        json_schema_extra = {
            "example": {
                "principal": 100000,
                "interest_earned": 15969.54,
                "maturity_amount": 115969.54,
                "effective_rate": 7.71,
                "breakdown": {
                    "monthly_breakdown": [...],
                    "total_periods": 8
                }
            }
        }


class UserProfile(BaseModel):
    """User profile data"""
    uid: str
    email: EmailStr
    display_name: Optional[str]
    role: UserRole = UserRole.USER
    created_at: datetime
    last_login: Optional[datetime]
    preferences: Optional[Dict[str, Any]] = {}
    is_active: bool = True

    class Config:
        json_schema_extra = {
            "example": {
                "uid": "firebase_user_id",
                "email": "user@example.com",
                "display_name": "John Doe",
                "role": "user",
                "created_at": "2025-01-01T00:00:00Z",
                "last_login": "2025-12-20T10:30:00Z",
                "preferences": {"theme": "dark", "currency": "INR"},
                "is_active": True
            }
        }


class APIResponse(BaseModel):
    """Generic API response wrapper"""
    success: bool
    data: Optional[Any]
    message: Optional[str]
    timestamp: datetime
    request_id: Optional[str]

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {"key": "value"},
                "message": "Operation completed successfully",
                "timestamp": "2025-12-20T10:30:00Z",
                "request_id": "req_123456"
            }
        }


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    error_code: Optional[str]
    details: Optional[Dict[str, Any]]
    timestamp: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": "Invalid request parameters",
                "error_code": "VALIDATION_ERROR",
                "details": {"field": "email", "issue": "invalid format"},
                "timestamp": "2025-12-20T10:30:00Z"
            }
        }