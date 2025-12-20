# Financer Backend

A high-performance, enterprise-grade FastAPI backend for the Financer application, featuring modern architecture with authentication, financial data processing, AI-powered insights, caching, database integration, and comprehensive security.

## 🚀 Features

### Core Features
- **Firebase Authentication**: Secure user registration, login, and JWT token management
- **NSE Data Integration**: Real-time stock market data with robust error handling and rate limiting
- **AI Financial Advisor**: Google Generative AI powered chatbot with context-aware financial guidance
- **Portfolio Management**: User portfolio tracking and analytics
- **Financial Calculators**: FD, SIP, and other investment calculators
- **RESTful API**: Clean, well-documented API with automatic OpenAPI documentation

### Advanced Features
- **High-Performance Caching**: Redis/memory caching with TTL support for optimal performance
- **Database Integration**: MongoDB/Memory database with user profiles, portfolios, and analytics
- **Rate Limiting**: SlowAPI-based rate limiting to prevent abuse
- **Async Processing**: Full async/await support for concurrent operations
- **Comprehensive Security**: CORS, security headers, input validation, and error handling
- **Modular Architecture**: Service-oriented design with dependency injection
- **Health Monitoring**: Detailed health checks and system monitoring
- **Comprehensive Logging**: Structured logging with different log levels

## 🛠️ Tech Stack

### Core Framework
- **FastAPI 2.0**: Modern async web framework with automatic API documentation
- **Pydantic**: Data validation and serialization
- **Uvicorn**: Lightning-fast ASGI server

### Authentication & Security
- **Firebase Admin**: Authentication and user management
- **Pyrebase4**: Firebase Python SDK
- **SlowAPI**: Rate limiting and API protection
- **python-jose**: JWT token handling

### AI & Data Processing
- **Google Generative AI**: Advanced AI chat functionality
- **Requests/httpx**: HTTP clients for external API calls
- **BeautifulSoup**: HTML parsing for NSE data

### Database & Caching
- **MongoDB**: NoSQL database for user data and portfolios
- **Redis**: High-performance caching layer
- **Motor**: Async MongoDB driver

### Development & Testing
- **pytest**: Comprehensive testing framework
- **pytest-asyncio**: Async testing support
- **httpx**: Async HTTP client for testing
- **python-dotenv**: Environment variable management

## 📁 Project Structure

```
financer-backend/
├── main.py                 # Main FastAPI application with routing and middleware
├── models.py              # Pydantic data models and schemas
├── nse_data.py            # NSEDataService class for stock market data
├── cache.py               # CacheService for Redis/memory caching
├── database.py            # DatabaseService for MongoDB/memory storage
├── config.py              # Configuration management with Pydantic
├── test.py                # Comprehensive test suite
├── requirements.txt       # Python dependencies
├── vercel.json           # Vercel deployment configuration
├── .env                  # Environment variables (create this)
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- pip package manager
- MongoDB (optional, falls back to memory storage)
- Redis (optional, falls back to memory caching)
- Firebase project setup
- Google Generative AI API key

### Installation

1. **Navigate to the backend directory**
   ```bash
   cd financer-backend
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv financer-env

   # Activate virtual environment
   # Windows:
   financer-env\Scripts\activate
   # macOS/Linux:
   source financer-env/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file**
   Create a `.env` file in the backend root directory with your configuration (see Configuration section)

5. **Start the development server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access the API**
   - API Documentation: `http://localhost:8000/`
   - Interactive API Docs: `http://localhost:8000/docs`
   - Alternative Docs: `http://localhost:8000/redoc`
   - Health Check: `http://localhost:8000/health`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend root directory:

```env
# Application Settings
APP_NAME=Financer API
APP_VERSION=1.0.0
DEBUG=true
ENVIRONMENT=development

# Server Settings
HOST=0.0.0.0
PORT=8000

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id

# Firebase Service Account (JSON string)
FIREBASE_CREDENTIALS_JSON={"type": "service_account", "project_id": "...", ...}

# Google AI Configuration
GOOGLE_API_KEY=your_google_generative_ai_api_key

# Database Configuration (Optional)
MONGODB_URL=mongodb://localhost:27017/financer
REDIS_URL=redis://localhost:6379

# Cache Configuration
CACHE_BACKEND=memory  # or 'redis'
CACHE_TTL=3600        # seconds

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60   # seconds

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and choose sign-in methods (Email/Password)
3. Generate a service account key (JSON) for admin access
4. Add the service account JSON as a string to `FIREBASE_CREDENTIALS_JSON`

### Google AI Setup

1. Get an API key from [Google AI Studio](https://aistudio.google.com/)
2. Add the key to `GOOGLE_API_KEY` in your `.env` file

### Database Setup (Optional)

#### MongoDB
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update MONGODB_URL in .env
```

#### Redis
```bash
# Install Redis locally or use Redis Cloud
# Update REDIS_URL in .env
# Set CACHE_BACKEND=redis in .env
```

## 📚 API Documentation

### Authentication Endpoints

#### Health Check
```
GET /health
```
Returns system health status with uptime and version information.

#### User Registration
```
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "display_name": "John Doe"
}
```

#### User Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Token Verification
```
GET /auth/verify
Authorization: Bearer <jwt_token>
```

### Stock Data Endpoints

#### Get All Stocks
```
GET /stocks
```
Returns NSE stock data with optional filtering.

#### Get Stock by Symbol
```
GET /stocks/{symbol}
```
Returns detailed information for a specific stock.

#### Get Stock Price
```
GET /stocks/{symbol}/price
```
Returns current price for a specific stock.

### AI Chat Endpoints

#### Chat with Financial Advisor
```
POST /ai/chat
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "message": "What should I invest in for long-term growth?",
  "context": "conservative investor"
}
```

### Portfolio Endpoints

#### Get User Portfolio
```
GET /portfolio
Authorization: Bearer <jwt_token>
```

#### Update Portfolio
```
POST /portfolio
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "stocks": [
    {"symbol": "RELIANCE", "quantity": 10, "avg_price": 2500},
    {"symbol": "TCS", "quantity": 5, "avg_price": 3200}
  ]
}
```

### Calculator Endpoints

#### FD Calculator
```
POST /calculator/fd
Content-Type: application/json

{
  "principal": 100000,
  "rate": 7.5,
  "tenure": 24,
  "compounding_frequency": "quarterly"
}
```

#### SIP Calculator
```
POST /calculator/sip
Content-Type: application/json

{
  "monthly_investment": 5000,
  "rate": 12,
  "tenure": 60
}
```

## 🗂️ Data Models

### Authentication Models
```python
class SignUpSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    display_name: Optional[str] = None

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    refresh_token: str
    expires_in: int
```

### Financial Models
```python
class StockData(BaseModel):
    symbol: str
    name: str
    price: Optional[float]
    change: Optional[float]
    volume: Optional[int]

class PortfolioItem(BaseModel):
    symbol: str
    quantity: int
    avg_price: float
    current_price: Optional[float]

class FDCalculation(BaseModel):
    principal: float
    rate: float
    tenure: int
    compounding_frequency: str
```

### AI Models
```python
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
    session_id: Optional[str]
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pytest test.py -v

# Run with coverage
pytest test.py --cov=. --cov-report=html

# Run specific test class
pytest test.py::TestAuthentication -v
```

### Test Coverage

The comprehensive test suite covers:
- ✅ Authentication endpoints (signup, login, token verification)
- ✅ NSE data service functionality
- ✅ Cache service operations
- ✅ Database service operations
- ✅ AI chat endpoints
- ✅ Financial calculators
- ✅ Rate limiting
- ✅ Error handling and validation
- ✅ Integration tests

### Manual Testing

Use the interactive API documentation at `/docs` to test endpoints manually with the Swagger UI.

## 🚀 Deployment

### Vercel Deployment

The backend is configured for Vercel deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ]
}
```

### Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   Configure all environment variables in the Vercel dashboard

### Alternative Deployment Options

#### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Railway
```bash
# Use Nixpacks for automatic deployment
# Set environment variables in Railway dashboard
```

#### Heroku
```yaml
# Procfile
web: uvicorn main:app --host=0.0.0.0 --port=$PORT
```

## 📊 Performance & Monitoring

### Caching Strategy
- **Redis Backend**: High-performance distributed caching
- **Memory Fallback**: In-memory caching for development
- **TTL Support**: Configurable cache expiration
- **Cache Keys**: Structured key naming for easy management

### Rate Limiting
- **SlowAPI Integration**: Robust rate limiting
- **Configurable Limits**: Adjustable request limits and windows
- **429 Responses**: Proper HTTP status codes for rate limits

### Health Monitoring
- **Health Endpoint**: `/health` with system status
- **Metrics**: Response times, error rates, cache hit rates
- **Logging**: Structured JSON logging for monitoring

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Firebase Integration**: Enterprise-grade user management
- **Token Validation**: Automatic token verification middleware

### API Security
- **Input Validation**: Pydantic model validation
- **CORS Protection**: Configured cross-origin policies
- **Security Headers**: OWASP recommended headers
- **Rate Limiting**: Protection against abuse

### Data Protection
- **Environment Variables**: Secure configuration management
- **Error Handling**: Secure error responses without data leakage
- **HTTPS Enforcement**: SSL/TLS encryption in production

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Authentication Errors**
   ```
   Error: Invalid credentials or configuration
   Solution: Verify Firebase service account JSON and API keys
   ```

2. **Google AI API Errors**
   ```
   Error: API key not valid or quota exceeded
   Solution: Check GOOGLE_API_KEY and API quota in Google Cloud Console
   ```

3. **Database Connection Errors**
   ```
   Error: Connection refused
   Solution: Verify MongoDB/Redis URLs and network connectivity
   ```

4. **Rate Limiting Issues**
   ```
   Error: 429 Too Many Requests
   Solution: Implement exponential backoff or increase rate limits
   ```

5. **CORS Errors**
   ```
   Error: Cross-origin request blocked
   Solution: Add frontend URL to CORS_ORIGINS in configuration
   ```

### Debug Mode

Enable debug mode for detailed error messages:
```bash
DEBUG=true uvicorn main:app --reload --log-level debug
```

## 📈 Performance Optimization

### Async Operations
- Full async/await support throughout the application
- Concurrent database operations
- Non-blocking I/O for external API calls

### Database Optimization
- Connection pooling with Motor
- Efficient query patterns
- Index optimization for MongoDB

### Caching Optimization
- Strategic caching of NSE data
- User session caching
- API response caching

## 🔄 API Versioning

Current API version: `v1`

Future versions will include:
- `/v1/` prefix for current API
- `/v2/` for future enhancements
- Backward compatibility support
- Deprecation notices for old endpoints

## 🤝 Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to all functions
3. Include comprehensive docstrings
4. Write tests for new features
5. Update API documentation
6. Use meaningful commit messages
7. Follow conventional commit format

## 📄 License

This project is part of the Financer application and follows the same license as the main repository.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation at `/docs`
3. Check the test suite for examples
4. Create an issue in the GitHub repository
5. Contact the development team

## 📋 Changelog

### Version 1.0.0
- Complete backend modernization with FastAPI 2.0
- Modular architecture with service layers
- Comprehensive caching and database integration
- Advanced security features and rate limiting
- Full async support and performance optimizations
- Extensive test coverage and documentation
