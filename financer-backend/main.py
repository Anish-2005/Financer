"""
Financer Backend API
A comprehensive FastAPI-based backend for financial data and AI insights.
"""

import os
import logging
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from functools import lru_cache

from fastapi import FastAPI, HTTPException, Request, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

import firebase_admin
from firebase_admin import credentials, auth
from dotenv import load_dotenv
import pyrebase
import google.generativeai as genai

from models import (
    SignUpSchema, LoginSchema, ChatRequest, StockData,
    UserProfile, PortfolioData, FDCalculatorRequest
)
from nse_data import NSEDataService
from cache import CacheService
from database import DatabaseService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Financer API",
    description="A comprehensive financial data and AI insights API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add rate limiting middleware
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])  # Configure for production

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
cache_service = CacheService()
db_service = DatabaseService()
nse_service = NSEDataService()

# Firebase initialization
def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        service_account_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
        if service_account_json and not firebase_admin._apps:
            cred = credentials.Certificate(eval(service_account_json))
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully")
        else:
            logger.warning("Firebase credentials not found or already initialized")
    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {e}")
        raise

# Pyrebase configuration
firebase_config = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
    "databaseURL": ""
}

# Initialize Google AI
def initialize_gemini():
    """Initialize Google Generative AI"""
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            logger.info("Google Generative AI initialized successfully")
        else:
            logger.warning("Google API key not found")
    except Exception as e:
        logger.error(f"Failed to initialize Google AI: {e}")
        raise

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting Financer API...")
    initialize_firebase()
    initialize_gemini()
    await db_service.connect()
    logger.info("All services initialized successfully")

    yield

    # Shutdown
    logger.info("Shutting down Financer API...")
    await db_service.disconnect()
    logger.info("Shutdown complete")

# Initialize FastAPI with lifespan
app = FastAPI(lifespan=lifespan)

# Security
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Firebase JWT token"""
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.warning(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

# API Routes
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0"
    }

@app.post("/auth/signup", response_model=Dict[str, str])
@limiter.limit("5/minute")
async def create_account(request: Request, user_data: SignUpSchema):
    """Create a new user account"""
    try:
        user = auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=user_data.display_name
        )

        # Create user profile in database
        await db_service.create_user_profile({
            "uid": user.uid,
            "email": user_data.email,
            "display_name": user_data.display_name,
            "created_at": datetime.utcnow()
        })

        logger.info(f"User created successfully: {user.uid}")
        return {"message": "Account created successfully", "uid": user.uid}

    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        logger.error(f"Account creation failed: {e}")
        raise HTTPException(status_code=500, detail="Account creation failed")

@app.post("/auth/login", response_model=Dict[str, str])
@limiter.limit("10/minute")
async def authenticate_user(request: Request, user_data: LoginSchema):
    """Authenticate user and return JWT token"""
    try:
        firebase_app = pyrebase.initialize_app(firebase_config)
        auth_client = firebase_app.auth()
        user = auth_client.sign_in_with_email_and_password(
            email=user_data.email,
            password=user_data.password
        )

        logger.info(f"User authenticated: {user_data.email}")
        return {"token": user['idToken'], "refresh_token": user['refreshToken']}

    except Exception as e:
        logger.warning(f"Authentication failed for {user_data.email}: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/auth/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify JWT token and return user info"""
    return {
        "uid": current_user["uid"],
        "email": current_user.get("email", ""),
        "email_verified": current_user.get("email_verified", False)
    }

@app.get("/stocks", response_model=Dict[str, Any])
@limiter.limit("30/minute")
async def get_stocks(request: Request, background_tasks: BackgroundTasks):
    """Get NSE stock data with caching"""
    try:
        # Check cache first
        cache_key = "nse_stocks_data"
        cached_data = await cache_service.get(cache_key)

        if cached_data:
            logger.info("Serving cached stock data")
            return cached_data

        # Fetch fresh data
        logger.info("Fetching fresh stock data from NSE")
        result = await nse_service.get_stock_data()

        if result["error"]:
            # Return cached data if available, otherwise error
            if cached_data:
                logger.warning(f"NSE API error, serving cached data: {result['error']}")
                return cached_data
            raise HTTPException(status_code=503, detail=result["error"])

        # Cache the result
        await cache_service.set(cache_key, result, ttl=300)  # 5 minutes

        # Background task to update cache
        background_tasks.add_task(cache_service.set, cache_key, result, 300)

        return result

    except Exception as e:
        logger.error(f"Stock data fetch failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch stock data")

@app.get("/stocks/{symbol}", response_model=StockData)
@limiter.limit("60/minute")
async def get_stock_detail(request: Request, symbol: str):
    """Get detailed information for a specific stock"""
    try:
        cache_key = f"stock_detail_{symbol}"
        cached_data = await cache_service.get(cache_key)

        if cached_data:
            return cached_data

        stock_data = await nse_service.get_stock_detail(symbol)
        if not stock_data:
            raise HTTPException(status_code=404, detail="Stock not found")

        await cache_service.set(cache_key, stock_data, ttl=180)  # 3 minutes
        return stock_data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Stock detail fetch failed for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch stock details")

@app.post("/ai/chat", response_model=Dict[str, str])
@limiter.limit("20/minute")
async def ai_chat(
    request: Request,
    chat_request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """AI-powered financial assistant"""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash-exp")

        # Enhanced system prompt
        system_prompt = """
        You are an expert AI financial advisor with deep knowledge of Indian markets, taxation, and investment strategies.
        Provide comprehensive, actionable advice while being conservative and risk-aware.

        Key guidelines:
        - Always consider Indian regulatory framework (SEBI, RBI, Income Tax Act)
        - Explain concepts clearly for all knowledge levels
        - Emphasize risk management and diversification
        - Be transparent about limitations and suggest professional consultation for complex matters
        - Provide data-driven insights when possible
        - Consider inflation, market volatility, and economic factors

        Portfolio context: ₹2,000,000 total value
        - Fixed Deposits: ₹500,000 (7.5% yield)
        - Stocks: ₹1,200,000 (24.8% growth)
        - Mutual Funds: ₹300,000 (15.2% returns)
        """

        full_prompt = f"{system_prompt}\n\nUser Query: {chat_request.message}"

        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=2048,
            )
        )

        # Log conversation for analytics
        await db_service.log_chat_interaction({
            "user_id": current_user["uid"],
            "query": chat_request.message,
            "response": response.text,
            "timestamp": datetime.utcnow()
        })

        return {"response": response.text}

    except Exception as e:
        logger.error(f"AI chat failed: {e}")
        raise HTTPException(status_code=500, detail="AI service temporarily unavailable")

@app.post("/calculator/fd", response_model=Dict[str, Any])
@limiter.limit("50/minute")
async def calculate_fd(request: Request, calc_request: FDCalculatorRequest):
    """Fixed Deposit calculator"""
    try:
        result = await nse_service.calculate_fd_returns(
            principal=calc_request.principal,
            rate=calc_request.rate,
            tenure=calc_request.tenure,
            compounding_frequency=calc_request.compounding_frequency
        )
        return result
    except Exception as e:
        logger.error(f"FD calculation failed: {e}")
        raise HTTPException(status_code=500, detail="Calculation failed")

@app.get("/portfolio", response_model=PortfolioData)
async def get_portfolio(current_user: dict = Depends(get_current_user)):
    """Get user's portfolio data"""
    try:
        portfolio = await db_service.get_user_portfolio(current_user["uid"])
        return portfolio
    except Exception as e:
        logger.error(f"Portfolio fetch failed for {current_user['uid']}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio")

@app.post("/portfolio")
async def update_portfolio(
    portfolio_data: PortfolioData,
    current_user: dict = Depends(get_current_user)
):
    """Update user's portfolio"""
    try:
        await db_service.update_user_portfolio(current_user["uid"], portfolio_data.dict())
        return {"message": "Portfolio updated successfully"}
    except Exception as e:
        logger.error(f"Portfolio update failed for {current_user['uid']}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update portfolio")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "type": "http_exception"}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "type": "server_error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
        log_level="info"
    )

