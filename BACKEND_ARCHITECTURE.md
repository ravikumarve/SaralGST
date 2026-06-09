> India's simplest GST rate checker - Backend Architecture Document
> Version: 1.0 | Last Updated: 2025-04-30 | Status: Phase 1 Complete

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [API Design](#api-design)
5. [Data Models](#data-models)
6. [Services Layer](#services-layer)
7. [Authentication & Authorization](#authentication--authorization)
8. [Rate Limiting](#rate-limiting)
9. [Error Handling](#error-handling)
10. [Logging & Monitoring](#logging--monitoring)
11. [Security Considerations](#security-considerations)
12. [Performance Optimization](#performance-optimization)
13. [Deployment Strategy](#deployment-strategy)
14. [Testing Strategy](#testing-strategy)
15. [Future Considerations](#future-considerations)

---

## Executive Summary

SaralGST backend is a **FastAPI-based microservice** designed for high-performance GST rate lookups with minimal infrastructure cost. The architecture prioritizes:

- **Simplicity**: JSON-based data store (no database)
- **Speed**: Sub-200ms response times
- **Cost-effectiveness**: Free tier hosting (Render)
- **Reliability**: Graceful degradation when AI services fail
- **Security**: HMAC-based authentication, rate limiting

**Key Design Decisions:**
- JSON file as single source of truth for GST rates
- Gemini Flash for NLP with local fallback
- IP-based rate limiting for free tier
- HMAC tokens for paid tier authentication
- Stateless design for horizontal scaling

---

## Technology Stack

### Core Framework
- **FastAPI 0.104+**: Modern, fast (Starlette), async support
- **Python 3.12+**: Latest stable with performance improvements
- **Uvicorn**: ASGI server with uvloop for performance
- **Pydantic v2**: Data validation and serialization

### AI/ML Layer
- **Google Generative AI (Gemini Flash)**: Free tier for product→HSN interpretation
- **Fallback**: Local substring search when Gemini unavailable

### Security & Auth
- **python-jose[cryptography]**: JWT token handling (future use)
- **passlib[bcrypt]**: Password hashing (future admin panel)
- **python-dotenv**: Environment variable management
- **slowapi**: Rate limiting middleware

### Data & Storage
- **JSON file**: Primary data store for GST rates
- **In-memory caching**: Load JSON at startup, cache in RAM
- **Future**: SQLite for user analytics (optional)

### Development & Testing
- **pytest**: Testing framework
- **pytest-asyncio**: Async test support
- **httpx**: Async HTTP client for testing
- **black**: Code formatting
- **ruff**: Fast linting

### Deployment
- **Render**: Free tier hosting
- **GitHub Actions**: CI/CD pipeline
- **Docker**: Containerization (optional)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js Frontend | Mobile App | Third-party Integrations) │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                        │
│  (FastAPI | CORS | Rate Limiting | Request Validation)       │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Lookup     │  │   Validate   │  │   Health     │
│   Service    │  │   Service    │  │   Check      │
└──────┬───────┘  └──────┬───────┘  └──────────────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│  Interpreter │  │  Rate Engine │
│  Service     │  │  Service     │
└──────┬───────┘  └──────┬───────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│  Gemini API  │  │  JSON Data   │
│  (External)  │  │  (Local)     │
└──────────────┘  └──────────────┘
```

### Request Flow

**Lookup Request Flow:**
1. Client sends POST `/api/lookup` with product query
2. API Gateway validates request, checks rate limit
3. If query is numeric → skip Gemini, go to Rate Engine
4. If query is text → call Interpreter Service (Gemini)
5. Interpreter returns HSN code (or falls back to search)
6. Rate Engine looks up HSN in JSON data
7. Response formatted and returned to client

**Authentication Flow:**
1. Client includes `X-Session-Token` header (paid tier)
2. API Gateway validates HMAC signature
3. If valid → bypass rate limit, allow 1000/day
4. If invalid/missing → enforce 3/day limit

### Component Responsibilities

| Component | Responsibility | Tech Stack |
|-----------|---------------|------------|
| API Gateway | Request routing, validation, rate limiting | FastAPI, slowapi |
| Lookup Service | Orchestrate lookup flow | FastAPI |
| Interpreter Service | Product name → HSN code | Gemini Flash |
| Rate Engine Service | HSN → GST rate lookup | Python dict |
| Validate Service | HMAC token validation | cryptography |
| Health Check | System status monitoring | FastAPI |

---

## API Design

### RESTful Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "data_version": "GST_2.0_Sept2025",
  "timestamp": "2025-04-30T10:30:00Z",
  "services": {
    "gemini": "available",
    "rate_engine": "available",
    "data_store": "loaded"
  }
}
```

#### 2. Rate Lookup
```http
POST /api/lookup
```

**Request Headers:**
```
X-Session-Token: <hmac_token>  # Optional, for paid tier
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "LED TV 32 inch",
  "query_type": "auto",
  "language": "en"
}
```

**Response (200 OK):**
```json
{
  "hsn_code": "8528",
  "description": "Television sets (LCD/LED above 32 inches)",
  "description_hi": "टेलीविजन (32 इंच से बड़े)",
  "category": "Consumer Electronics",
  "old_rate": 28,
  "new_rate": 18,
  "rate_changed": true,
  "movement": "down",
  "notification_ref": "Notification No. 8/2025-CT(Rate)",
  "notes": "Effective Sept 22, 2025",
  "confidence": 0.92,
  "interpreted_from": "LED TV 32 inch",
  "warning": null
}
```

**Response (404 Not Found):**
```json
{
  "error": "hsn_not_found",
  "interpreted_hsn": "8528",
  "message": "This HSN code is not in our database yet. We're adding new items daily."
}
```

**Response (429 Rate Limit):**
```json
{
  "error": "rate_limit_exceeded",
  "message": "Aaj ke 3 lookups ho gaye. Kal phir aayein ya upgrade karein.",
  "upgrade_url": "https://saralgst.in/upgrade"
}
```

**Response Headers:**
```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1735689600
X-Lookups-Remaining: 2
```

#### 3. Token Validation
```http
POST /api/validate-key
```

**Request Body:**
```json
{
  "token": "abc123def456..."
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "tier": "paid",
  "expires_at": "2025-05-30T10:30:00Z"
}
```

**Response (401 Unauthorized):**
```json
{
  "valid": false,
  "tier": "free",
  "expires_at": null
}
```

### API Design Principles

1. **RESTful**: Use HTTP verbs correctly (GET, POST, PUT, DELETE)
2. **Stateless**: No session state on server
3. **Versioned**: URL versioning (`/api/v1/...`) for future compatibility
4. **Consistent**: Uniform response format, error handling
5. **Secure**: HTTPS only, CORS configured, rate limiting
6. **Documented**: OpenAPI/Swagger auto-generated by FastAPI

### Error Response Format

All errors follow this schema:
```json
{
  "error": "error_code",
  "message": "Human-readable message (Hinglish)",
  "details": {},  // Optional additional context
  "upgrade_url": "https://saralgst.in/upgrade"  // When applicable
}
```

**Error Codes:**
- `rate_limit_exceeded`: Daily lookup limit reached
- `hsn_not_found`: HSN code not in database
- `invalid_request`: Malformed request
- `service_unavailable`: External service (Gemini) down
- `invalid_token`: HMAC token validation failed

---

## Data Models

### Pydantic Models

#### Request Models

```python
from pydantic import BaseModel, Field
from typing import Optional, Literal

class LookupRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=200)
    query_type: Literal["auto", "hsn", "product_name"] = "auto"
    language: Literal["en", "hi"] = "en"

class ValidateKeyRequest(BaseModel):
    token: str = Field(..., min_length=1)
```

#### Response Models

```python
class LookupResponse(BaseModel):
    hsn_code: str
    description: str
    description_hi: Optional[str]
    category: str
    old_rate: float
    new_rate: float
    rate_changed: bool
    movement: Literal["up", "down", "unchanged", "new_exempt"]
    notification_ref: str
    notes: Optional[str]
    confidence: float = Field(..., ge=0.0, le=1.0)
    interpreted_from: str
    warning: Optional[str]

class ValidateKeyResponse(BaseModel):
    valid: bool
    tier: Literal["free", "paid", "ca_firm"]
    expires_at: Optional[str]

class HealthResponse(BaseModel):
    status: str
    version: str
    data_version: str
    timestamp: str
    services: dict
```

#### Error Models

```python
class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Optional[dict] = None
    upgrade_url: Optional[str] = None
```

### JSON Data Model

#### GST Rates File Structure

```json
{
  "version": "GST_2.0_Sept2025",
  "last_updated": "2025-09-22",
  "metadata": {
    "total_items": 200,
    "rate_changed_count": 45,
    "categories": 12
  },
  "items": [
    {
      "hsn": "1001",
      "description": "Wheat",
      "description_hi": "गेहूँ",
      "category": "Food & Agriculture",
      "old_rate": 0,
      "new_rate": 0,
      "rate_changed": false,
      "movement": "unchanged",
      "notification_ref": "Notification No. 1/2025-CT(Rate)",
      "notes": "Unbranded wheat exempt",
      "aliases": ["gehun", "grain"]
    }
  ]
}
```

**Required Fields:**
- `hsn`: HSN/SAC code (2-8 digits)
- `description`: English description
- `old_rate`: Pre-GST 2.0 rate (0, 5, 12, 18, 28)
- `new_rate`: Post-GST 2.0 rate (0, 5, 18)
- `rate_changed`: Boolean flag
- `movement`: "up" | "down" | "unchanged" | "new_exempt"
- `notification_ref`: Official GST notification reference

**Optional Fields:**
- `description_hi`: Hindi translation
- `category`: Product category
- `notes`: Additional context
- `aliases`: Common alternate names

---

## Services Layer

### Service Architecture

```
backend/
├── services/
│   ├── __init__.py
│   ├── rate_engine.py       # HSN → Rate lookup
│   ├── interpreter.py      # Product → HSN via Gemini
│   ├── auth_service.py      # HMAC token validation
│   └── cache_service.py     # In-memory caching
```

### Rate Engine Service

**File:** `backend/services/rate_engine.py`

**Responsibilities:**
- Load and cache GST rates JSON at startup
- Provide HSN code lookup
- Fallback to chapter-level matching
- Description-based search (fallback)

**Key Methods:**
```python
class RateEngine:
    def __init__(self, data_path: str):
        """Load JSON data and build lookup index"""
        self.data = self._load_data(data_path)
        self.hsn_index = self._build_hsn_index()
        self.description_index = self._build_description_index()

    def lookup_by_hsn(self, hsn: str) -> Optional[dict]:
        """Exact HSN match, fallback to chapter prefix"""
        # Try exact match first
        if hsn in self.hsn_index:
            return self.hsn_index[hsn]

        # Try 4-digit chapter prefix
        chapter = hsn[:4]
        if chapter in self.hsn_index:
            return self.hsn_index[chapter]

        return None

    def search_by_description(self, query: str) -> List[dict]:
        """Substring search on descriptions, return top 3"""
        results = []
        query_lower = query.lower()

        for item in self.data["items"]:
            if (query_lower in item["description"].lower() or
                query_lower in item.get("description_hi", "").lower() or
                any(query_lower in alias.lower() for alias in item.get("aliases", []))):
                results.append(item)

        # Sort by description length (shorter = more specific)
        results.sort(key=lambda x: len(x["description"]))
        return results[:3]
```

**Performance Optimizations:**
- In-memory indexing at startup
- O(1) lookup for exact HSN match
- Cached results for common queries
- Lazy loading for large datasets

### Interpreter Service

**File:** `backend/services/interpreter.py`

**Responsibilities:**
- Convert product names to HSN codes using Gemini
- Handle Gemini API failures gracefully
- Provide confidence scores
- Log queries for dataset improvement

**Key Methods:**
```python
class InterpreterService:
    def __init__(self, api_key: str):
        self.client = genai.GenerativeModel('gemini-1.5-flash')
        self.prompt_template = self._load_prompt_template()

    async def interpret_product(self, query: str) -> tuple[str, float]:
        """
        Convert product name to HSN code
        Returns: (hsn_code, confidence_score)
        """
        # Skip if query is already numeric
        if query.isdigit():
            return query, 1.0

        try:
            # Call Gemini with timeout
            response = await asyncio.wait_for(
                self._call_gemini(query),
                timeout=10.0
            )

            hsn_code = self._parse_response(response)
            confidence = 0.9  # High confidence for Gemini

            # Log for analytics
            self._log_query(query, hsn_code, confidence)

            return hsn_code, confidence

        except (TimeoutError, Exception) as e:
            # Fallback to local search
            logger.warning(f"Gemini failed: {e}, using fallback")
            return "UNKNOWN", 0.5

    def _call_gemini(self, query: str) -> str:
        """Call Gemini API with prompt"""
        prompt = self.prompt_template.format(query=query)
        response = self.client.generate_content(prompt)
        return response.text

    def _parse_response(self, response: str) -> str:
        """Extract HSN code from Gemini response"""
        # Extract 4-8 digit number
        match = re.search(r'\b\d{4,8}\b', response)
        return match.group(0) if match else "UNKNOWN"
```

**Prompt Template:**
```
You are a GST expert for India. A business owner has described their product or service in plain language.

Your task: Return ONLY the most likely HSN code (4 or 8 digits) for this product under India's GST system.

Rules:
- Return ONLY the HSN code as a plain number, nothing else
- If the description is a service, return the SAC code instead
- If multiple HSN codes could apply, return the most common one for small Indian businesses
- If you cannot determine the HSN code with reasonable confidence, return "UNKNOWN"
- Do not explain your reasoning. Just the code.

Product/Service description: {query}
```

**Fallback Strategy:**
1. Gemini timeout (10s) → use description search
2. Gemini API error → use description search
3. Invalid response → use description search
4. Confidence < 0.7 → show warning to user

### Auth Service

**File:** `backend/services/auth_service.py`

**Responsibilities:**
- Validate HMAC tokens
- Generate tokens (for payment webhook)
- Check token expiry
- Determine user tier

**Key Methods:**
```python
class AuthService:
    def __init__(self, secret: str):
        self.secret = secret

    def validate_token(self, token: str) -> dict:
        """
        Validate HMAC token
        Returns: {valid: bool, tier: str, expires_at: str|None}
        """
        try:
            # Decode token (format: hmac_signature:tier:expires_at)
            parts = token.split(':')
            if len(parts) != 3:
                return {"valid": False, "tier": "free", "expires_at": None}

            signature, tier, expires_at = parts

            # Verify HMAC
            expected_sig = self._generate_signature(tier, expires_at)
            if not hmac.compare_digest(signature, expected_sig):
                return {"valid": False, "tier": "free", "expires_at": None}

            # Check expiry
            if datetime.fromisoformat(expires_at) < datetime.now():
                return {"valid": False, "tier": "free", "expires_at": None}

            return {"valid": True, "tier": tier, "expires_at": expires_at}

        except Exception:
            return {"valid": False, "tier": "free", "expires_at": None}

    def generate_token(self, tier: str, expires_at: str) -> str:
        """Generate HMAC token for payment webhook"""
        signature = self._generate_signature(tier, expires_at)
        return f"{signature}:{tier}:{expires_at}"

    def _generate_signature(self, tier: str, expires_at: str) -> str:
        """Generate HMAC signature"""
        message = f"{tier}:{expires_at}"
        return hmac.new(
            self.secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
```

**Token Format:**
```
<hmac_signature>:<tier>:<expires_at>
```

Example:
```
a1b2c3d4e5f6:paid:2025-05-30T10:30:00Z
```

---

## Authentication & Authorization

### Authentication Strategy

**Free Tier:**
- No authentication required
- Rate limited by IP address (3/day)
- No personal data collected

**Paid Tier:**
- HMAC token-based authentication
- Token generated after Razorpay payment
- Token sent in `X-Session-Token` header
- Token valid for 30 days (monthly) or 365 days (annual)

**CA Firm Tier:**
- Same HMAC token mechanism
- Higher rate limit (1000/day)
- Multiple tokens per payment (5 for team sharing)

### Token Lifecycle

```
┌─────────────┐
│  User Pays  │
│  (Razorpay) │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Webhook Receives│
│  Payment Success │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Generate Token │
│  (HMAC + Tier)  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Return to Client│
│  (localStorage) │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Send in Header │
│  Every Request  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Validate Token │
│  (Backend)      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Grant Access   │
│  (Bypass Limit) │
└─────────────────┘
```

### Authorization Levels

| Tier | Rate Limit | Features | Token Required |
|------|-----------|----------|----------------|
| Free | 3/day | Basic lookups | No |
| Paid (Individual) | 1000/day | Unlimited lookups, priority support | Yes |
| CA Firm | 1000/day | 5 tokens, team sharing, bulk export | Yes |

### Security Considerations

- **HMAC Secret**: Stored in environment variable, never committed
- **Token Expiry**: Automatic expiration after period
- **Token Revocation**: Future feature (admin panel)
- **Rate Limit Bypass**: Only with valid token
- **No User Data**: No personal information stored

---

## Rate Limiting

### Rate Limiting Strategy

**Implementation:** `slowapi` middleware

**Free Tier:**
- Limit: 3 lookups per day per IP
- Window: 24 hours rolling
- Enforcement: IP-based (X-Forwarded-For header)
- Reset: Automatic at midnight UTC

**Paid Tier:**
- Limit: 1000 lookups per day per token
- Window: 24 hours rolling
- Enforcement: Token-based
- Reset: Automatic at midnight UTC

### Rate Limiting Implementation

```python
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

limiter = Limiter(key_func=get_remote_address)

# Custom key function for paid tier
def get_rate_limit_key(request: Request) -> str:
    """Use token if present, else IP address"""
    token = request.headers.get("X-Session-Token")
    if token:
        return f"token:{token}"
    return f"ip:{get_remote_address(request)}"

# Apply rate limit
@app.post("/api/lookup")
@limiter.limit("3/day" if not is_paid else "1000/day")
async def lookup(request: Request, body: LookupRequest):
    # ... lookup logic
```

### Rate Limit Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1735689600
X-Lookups-Remaining: 2
```

### Rate Limit Error Response

```json
{
  "error": "rate_limit_exceeded",
  "message": "Aaj ke 3 lookups ho gaye. Kal phir aayein ya upgrade karein.",
  "upgrade_url": "https://saralgst.in/upgrade"
}
```

### Edge Cases

**Shared IP (office/cafe):**
- Multiple users share same IP
- Each user gets 3 lookups total (not per user)
- Solution: Encourage paid tier for shared environments

**VPN/Proxy:**
- All traffic appears from same IP
- Same limitation as shared IP
- Solution: Token-based authentication bypasses IP limits

**Mobile Networks:**
- IP changes frequently (carrier-grade NAT)
- Rate limit may reset unexpectedly
- Solution: Token-based authentication recommended

---

## Error Handling

### Error Handling Strategy

**Principles:**
1. Never expose internal errors to clients
2. Always return consistent error format
3. Log all errors for debugging
4. Provide actionable error messages
5. Graceful degradation for external dependencies

### Error Categories

**Client Errors (4xx):**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Invalid token
- `404 Not Found`: HSN not in database
- `429 Too Many Requests`: Rate limit exceeded
- `422 Unprocessable Entity`: Validation error

**Server Errors (5xx):**
- `500 Internal Server Error`: Unexpected error
- `503 Service Unavailable`: External service down
- `504 Gateway Timeout`: External service timeout

### Error Handling Implementation

```python
from fastapi import HTTPException, status

# Custom exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail.get("error", "unknown_error"),
            "message": exc.detail.get("message", "An error occurred"),
            "upgrade_url": "https://saralgst.in/upgrade" if exc.status_code == 429 else None
        }
    )

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_error",
            "message": "Kuch gadbad ho gayi. Please try again."
        }
    )
```

### Error Messages (Hinglish)

| Error Code | Message |
|-----------|---------|
| `rate_limit_exceeded` | "Aaj ke 3 lookups ho gaye. Kal phir aayein ya upgrade karein." |
| `hsn_not_found` | "Yeh HSN code abhi hamare database mein nahi hai." |
| `invalid_request` | "Invalid request. Please check your input." |
| `service_unavailable` | "Service temporarily unavailable. Please try again." |
| `invalid_token` | "Invalid token. Please login again." |
| `internal_error` | "Kuch gadbad ho gayi. Please try again." |

---

## Logging & Monitoring

### Logging Strategy

**Log Levels:**
- `DEBUG`: Detailed debugging information
- `INFO`: General operational events
- `WARNING`: Warning conditions (Gemini fallback, etc.)
- `ERROR`: Error conditions
- `CRITICAL`: Critical failures

**Log Format:**
```json
{
  "timestamp": "2025-04-30T10:30:00Z",
  "level": "INFO",
  "service": "lookup",
  "message": "Lookup successful",
  "hsn_code": "8528",
  "query": "LED TV",
  "confidence": 0.92,
  "response_time_ms": 145
}
```

**What to Log:**
- All API requests (method, path, status, response time)
- Rate limit violations
- Gemini API calls and failures
- Token validations
- Errors and exceptions
- System health metrics

**What NOT to Log:**
- Personal user data (none collected anyway)
- API keys or secrets
- Full request bodies (query only)

### Monitoring Strategy

**Health Check Endpoint:**
```http
GET /health
```

Returns:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "data_version": "GST_2.0_Sept2025",
  "timestamp": "2025-04-30T10:30:00Z",
  "services": {
    "gemini": "available",
    "rate_engine": "available",
    "data_store": "loaded"
  }
}
```

**Metrics to Track:**
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate (by error type)
- Rate limit violations
- Gemini API success rate
- Token validation success rate

**Monitoring Tools:**
- Render built-in metrics (free tier)
- Custom health check endpoint
- Log aggregation (Render logs)
- Future: Prometheus/Grafana (paid tier)

### Alerting

**Alert Conditions:**
- Error rate > 5% for 5 minutes
- Response time p95 > 500ms for 5 minutes
- Gemini API failure rate > 20% for 10 minutes
- Health check fails for 2 consecutive checks

**Alert Channels:**
- Email (developer)
- Slack (future)
- SMS (critical only, future)

---

## Security Considerations

### Security Architecture

**Defense in Depth:**
1. **Network Layer**: HTTPS only, TLS 1.3
2. **Application Layer**: Input validation, rate limiting
3. **Data Layer**: No sensitive data stored
4. **Authentication**: HMAC tokens, no passwords
5. **Logging**: Security events logged

### Input Validation

**All Inputs Validated:**
- Query strings: Length, format, encoding
- HSN codes: Numeric, 2-8 digits
- Tokens: Format, HMAC signature
- Headers: Whitelist allowed headers

**Pydantic Validation:**
```python
class LookupRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=200)
    query_type: Literal["auto", "hsn", "product_name"] = "auto"
    language: Literal["en", "hi"] = "en"
```

### Output Encoding

**JSON Responses:**
- All output properly escaped
- No raw HTML in responses
- Content-Type: application/json

**Error Messages:**
- No internal details exposed
- No stack traces in responses
- Generic error messages for clients

### Secrets Management

**Environment Variables:**
```env
GEMINI_API_KEY=sk-...
HMAC_SECRET=abc123...
RATE_LIMIT_FREE=3
RATE_LIMIT_PAID=1000
ALLOWED_ORIGINS=https://saralgst.in
```

**Best Practices:**
- Never commit `.env` files
- Use strong random secrets (32+ bytes)
- Rotate secrets periodically
- Different secrets for dev/staging/prod

### CORS Configuration

**Development:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

**Production:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://saralgst.in"],
    allow_methods=["GET", "POST"],
    allow_headers=["X-Session-Token"],
)
```

### API Security

**Rate Limiting:**
- Prevents abuse and DDoS
- IP-based for free tier
- Token-based for paid tier

**HMAC Tokens:**
- Cryptographically secure
- Cannot be forged without secret
- Automatic expiration

**No SQL Injection:**
- No database = no SQL injection
- JSON data store = safe from injection

**No XSS:**
- No HTML rendering
- JSON API only
- Content-Type enforced

### Dependencies

**Regular Updates:**
```bash
pip list --outdated
pip install --upgrade <package>
```

**Vulnerability Scanning:**
```bash
pip-audit
safety check
```

**Pinned Versions:**
```txt
fastapi==0.104.1
uvicorn==0.24.0
google-generativeai==0.3.0
```

---

## Performance Optimization

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | <200ms (p95) | Application logs |
| Page Load Time | <3s (3G mobile) | Lighthouse |
| Time to First Byte | <100ms | WebPageTest |
| Concurrent Users | 100+ | Load testing |
| Uptime | 99.5% | Uptime monitoring |

### Optimization Strategies

**1. In-Memory Caching**

```python
# Load JSON at startup
@app.on_event("startup")
async def startup_event():
    global rate_engine
    rate_engine = RateEngine("data/gst_rates.json")
    logger.info(f"Loaded {len(rate_engine.data)} GST rates")
```

**2. Async I/O**

```python
# All I/O operations async
async def lookup(request: LookupRequest) -> LookupResponse:
    # Async Gemini call
    hsn_code, confidence = await interpreter.interpret_product(request.query)

    # Sync rate lookup (fast, in-memory)
    result = rate_engine.lookup_by_hsn(hsn_code)

    return result
```

**3. Connection Pooling**

```python
# HTTP client for external APIs
http_client = httpx.AsyncClient(
    timeout=10.0,
    limits=httpx.Limits(max_connections=100)
)
```

**4. Response Compression**

```python
# Gzip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

**5. CDN Caching**

```python
# Cache health check
@app.get("/health")
@cache(expire=60)  # Cache for 60 seconds
async def health_check():
    return {"status": "ok"}
```

### Database Optimization

**No Database = Fast:**
- JSON file loaded at startup
- In-memory lookup (O(1) for exact match)
- No query overhead
- No connection pooling needed

**Future Optimization (if database added):**
- Index on HSN code
- Query result caching
- Read replicas for scaling

### Caching Strategy

**Application-Level Caching:**
```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_rate_by_hsn(hsn: str) -> Optional[dict]:
    """Cache common HSN lookups"""
    return rate_engine.lookup_by_hsn(hsn)
```

**HTTP Caching:**
```python
# Cache-Control headers
@app.get("/health")
async def health_check():
    return Response(
        content=json.dumps({"status": "ok"}),
        headers={"Cache-Control": "public, max-age=60"}
    )
```

### Load Testing

**Tools:**
- Locust (Python-based)
- k6 (JavaScript-based)
- Apache Bench (ab)

**Test Scenarios:**
- 100 concurrent users, 10 requests/sec
- 1000 concurrent users, 100 requests/sec
- Sustained load for 10 minutes

**Target Results:**
- <200ms p95 response time
- <1% error rate
- No memory leaks

---

## Deployment Strategy

### Deployment Architecture

**Platform:** Render (free tier)

**Architecture:**
```
┌─────────────────────────────────────┐
│         GitHub Repository            │
│  (main branch protected)             │
└──────────────────┬──────────────────┘
                   │ push
                   ▼
┌─────────────────────────────────────┐
│      GitHub Actions CI/CD            │
│  (run tests, build Docker image)     │
└──────────────────┬──────────────────┘
                   │ deploy
                   ▼
┌─────────────────────────────────────┐
│         Render Web Service           │
│  (FastAPI + Uvicorn)                 │
└──────────────────┬──────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│  Gemini API  │      │  JSON Data   │
│  (External)  │      │  (Local)     │
└──────────────┘      └──────────────┘
```

### CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-asyncio
      - name: Run tests
        run: pytest backend/tests/ -v

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"deploy": true}' \
            https://api.render.com/v1/services/saralgst-api/deploy
```

### Environment Configuration

**Development (.env):**
```env
GEMINI_API_KEY=sk-test-...
HMAC_SECRET=test-secret-key
RATE_LIMIT_FREE=10
RATE_LIMIT_PAID=1000
ALLOWED_ORIGINS=http://localhost:3000
LOG_LEVEL=DEBUG
```

**Production (.env):**
```env
GEMINI_API_KEY=sk-prod-...
HMAC_SECRET=<strong-random-32-bytes>
RATE_LIMIT_FREE=3
RATE_LIMIT_PAID=1000
ALLOWED_ORIGINS=https://saralgst.in
LOG_LEVEL=INFO
```

### Deployment Steps

**1. Initial Setup:**
```bash
# Create Render account
# Connect GitHub repository
# Create Web Service
# Select Python runtime
# Set build command: pip install -r requirements.txt
# Set start command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**2. Environment Variables:**
```bash
# Add in Render dashboard
GEMINI_API_KEY=...
HMAC_SECRET=...
RATE_LIMIT_FREE=3
RATE_LIMIT_PAID=1000
ALLOWED_ORIGINS=https://saralgst.in
```

**3. Data File:**
```bash
# Upload gst_rates.json to Render
# Or commit to repository (if small enough)
# Or use Render disk (paid tier)
```

**4. Deploy:**
```bash
# Push to main branch
git push origin main

# GitHub Actions runs tests
# Render auto-deploys on success
```

### Monitoring & Health Checks

**Render Built-in Monitoring:**
- CPU usage
- Memory usage
- Response time
- Error rate
- Uptime

**Custom Health Check:**
```bash
# Cron job every 5 minutes
*/5 * * * * curl -f https://saralgst-api.onrender.com/health || alert
```

**Log Aggregation:**
- Render logs (built-in)
- Future: Logtail, Papertrail (paid)

### Rollback Strategy

**Automatic Rollback:**
- If health check fails for 5 minutes
- If error rate > 10% for 5 minutes
- If response time p95 > 2s for 5 minutes

**Manual Rollback:**
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or deploy specific commit in Render dashboard
```

### Scaling Strategy

**Current (Free Tier):**
- 1 instance
- 512MB RAM
- Shared CPU
- Sufficient for launch traffic

**Future Scaling (Paid Tier):**
- Horizontal scaling: Add more instances
- Vertical scaling: Upgrade instance size
- Load balancing: Render auto-scales
- Database: Add Redis for caching

---

## Testing Strategy

### Testing Pyramid

```
        ┌─────────────┐
        │   E2E Tests │  (10%)
        │   (Playwright)│
        └──────┬──────┘
               │
        ┌──────┴──────┐
        │Integration  │  (30%)
        │   Tests      │
        └──────┬──────┘
               │
        ┌──────┴──────┐
        │  Unit Tests  │  (60%)
        │  (pytest)    │
        └─────────────┘
```

### Unit Tests

**Coverage Target:** 95%+

**Test Files:**
```
backend/tests/
├── test_rate_engine.py
├── test_interpreter.py
├── test_auth_service.py
├── test_lookup_router.py
└── fixtures/
    ├── test_queries.json
    └── test_rates.json
```

**Example Test:**
```python
# test_rate_engine.py
def test_lookup_by_exact_hsn_code():
    """Test exact HSN code match"""
    engine = RateEngine("data/gst_rates.json")
    result = engine.lookup_by_hsn("8528")

    assert result is not None
    assert result["hsn"] == "8528"
    assert result["description"] == "Television sets (LCD/LED above 32 inches)"
    assert result["new_rate"] == 18

def test_lookup_by_chapter_prefix():
    """Test fallback to chapter-level match"""
    engine = RateEngine("data/gst_rates.json")
    result = engine.lookup_by_hsn("85")  # Chapter 85

    assert result is not None
    assert result["hsn"].startswith("85")

def test_hsn_not_found():
    """Test HSN not in database"""
    engine = RateEngine("data/gst_rates.json")
    result = engine.lookup_by_hsn("9999")

    assert result is None
```

### Integration Tests

**Test API Endpoints:**
```python
# test_lookup_router.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_lookup_by_product_name():
    """Test product name lookup"""
    response = client.post(
        "/api/lookup",
        json={"query": "LED TV", "query_type": "auto", "language": "en"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["hsn_code"] == "8528"
    assert data["confidence"] > 0.8

def test_lookup_by_hsn_code():
    """Test HSN code lookup"""
    response = client.post(
        "/api/lookup",
        json={"query": "8528", "query_type": "hsn", "language": "en"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["hsn_code"] == "8528"

def test_rate_limit_free_tier():
    """Test free tier rate limit"""
    for i in range(4):
        response = client.post(
            "/api/lookup",
            json={"query": f"test {i}", "query_type": "auto", "language": "en"}
        )

    assert response.status_code == 429
    assert "rate_limit_exceeded" in response.json()["error"]

def test_paid_token_bypasses_rate_limit():
    """Test paid token bypasses rate limit"""
    token = generate_test_token()

    for i in range(10):
        response = client.post(
            "/api/lookup",
            json={"query": f"test {i}", "query_type": "auto", "language": "en"},
            headers={"X-Session-Token": token}
        )

    assert response.status_code == 200
```

### End-to-End Tests

**Test User Flows:**
```python
# test_e2e.py
def test_free_user_flow():
    """Test free user lookup flow"""
    # 1. First lookup - success
    response = client.post("/api/lookup", json={"query": "LED TV"})
    assert response.status_code == 200

    # 2. Second lookup - success
    response = client.post("/api/lookup", json={"query": "AC"})
    assert response.status_code == 200

    # 3. Third lookup - success
    response = client.post("/api/lookup", json={"query": "cement"})
    assert response.status_code == 200

    # 4. Fourth lookup - rate limit
    response = client.post("/api/lookup", json={"query": "wheat"})
    assert response.status_code == 429

def test_paid_user_flow():
    """Test paid user lookup flow"""
    token = generate_test_token()

    # 1. First lookup with token - success
    response = client.post(
        "/api/lookup",
        json={"query": "LED TV"},
        headers={"X-Session-Token": token}
    )
    assert response.status_code == 200

    # 2. Many more lookups - all succeed
    for i in range(100):
        response = client.post(
            "/api/lookup",
            json={"query": f"test {i}"},
            headers={"X-Session-Token": token}
        )
        assert response.status_code == 200
```

### Test Data

**Fixtures:**
```json
// fixtures/test_rates.json
{
  "version": "GST_2.0_Sept2025",
  "items": [
    {
      "hsn": "8528",
      "description": "Television sets (LCD/LED above 32 inches)",
      "old_rate": 28,
      "new_rate": 18,
      "rate_changed": true,
      "movement": "down"
    },
    {
      "hsn": "8415",
      "description": "Air conditioners",
      "old_rate": 28,
      "new_rate": 18,
      "rate_changed": true,
      "movement": "down"
    }
  ]
}
```

### Running Tests

**All Tests:**
```bash
pytest backend/tests/ -v --cov=backend --cov-report=html
```

**Unit Tests Only:**
```bash
pytest backend/tests/test_*.py -v -m "not integration"
```

**Integration Tests Only:**
```bash
pytest backend/tests/test_*.py -v -m "integration"
```

**With Coverage:**
```bash
pytest backend/tests/ --cov=backend --cov-report=term-missing
```

### Test Automation

**GitHub Actions:**
```yaml
- name: Run tests
  run: |
    pip install pytest pytest-asyncio pytest-cov
    pytest backend/tests/ -v --cov=backend --cov-report=xml

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage.xml
```

---

## Future Considerations

### Phase 2 Enhancements (Post-Launch)

**1. Database Migration**
- Add SQLite for user analytics
- Track query patterns
- Identify missing HSN codes
- Improve Gemini prompts

**2. Admin Panel**
- Web interface for data updates
- Bulk HSN code import
- Analytics dashboard
- User management

**3. API Versioning**
- `/api/v1/lookup` (current)
- `/api/v2/lookup` (future)
- Backward compatibility

**4. Advanced Features**
- Bulk lookup API
- Historical rate data
- Rate change notifications
- Export to PDF/Excel

### Phase 3 Enhancements (6 Months)

**1. Machine Learning**
- Train custom HSN classifier
- Improve accuracy over time
- User feedback loop
- Auto-suggest corrections

**2. Multi-Language Support**
- Tamil, Telugu, Bengali
- Regional product names
- Localized notifications

**3. Mobile Apps**
- React Native (iOS/Android)
- Offline mode
- Push notifications

**4. Enterprise Features**
- API keys for CA firms
- Webhook notifications
- Custom branding
- SLA guarantees

### Scalability Considerations

**Database Options:**
- **SQLite**: Simple, free, good for <10K users
- **PostgreSQL**: Robust, paid, good for 10K-100K users
- **MongoDB**: Flexible, paid, good for 100K+ users

**Caching Options:**
- **In-memory**: Current, fast, limited
- **Redis**: Paid, distributed, scalable
- **Memcached**: Paid, simple, fast

**Hosting Options:**
- **Render Free**: Current, limited, free
- **Render Paid**: More resources, $7/month
- **AWS/GCP**: Full control, $50+/month

### Cost Projections

**Current (Free Tier):**
- Hosting: $0/month
- Domain: $1/month
- Gemini: $0/month (free tier)
- **Total: $1/month**

**Phase 2 (Paid Tier):**
- Hosting: $7/month (Render)
- Domain: $1/month
- Gemini: $5/month (pro tier)
- Redis: $5/month
- **Total: $18/month**

**Phase 3 (Enterprise):**
- Hosting: $50/month (AWS)
- Domain: $1/month
- Gemini: $20/month
- Database: $15/month
- Monitoring: $10/month
- **Total: $96/month**

### Technical Debt

**Known Issues:**
1. JSON file not scalable for >10K items
2. IP-based rate limiting has edge cases
3. No query analytics
4. No admin interface
5. Limited error recovery

**Mitigation:**
1. Plan database migration
2. Encourage token-based auth
3. Add analytics logging
4. Build admin panel
5. Implement retry logic

### Security Roadmap

**Short Term (0-3 months):**
- ✅ HMAC token authentication
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS configuration

**Medium Term (3-6 months):**
- ⏳ API key rotation
- ⏳ Token revocation
- ⏳ Audit logging
- ⏳ Security headers

**Long Term (6-12 months):**
- ⏳ OAuth 2.0
- ⏳ 2FA for admin panel
- ⏳ Penetration testing
- ⏳ Security audit

---

## Appendix

### A. Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GEMINI_API_KEY` | Google Generative AI API key | - | Yes |
| `HMAC_SECRET` | HMAC signature secret | - | Yes |
| `RATE_LIMIT_FREE` | Free tier daily limit | 3 | No |
| `RATE_LIMIT_PAID` | Paid tier daily limit | 1000 | No |
| `ALLOWED_ORIGINS` | CORS allowed origins | * | No |
| `LOG_LEVEL` | Logging level | INFO | No |
| `PORT` | Server port | 8000 | No |

### B. API Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Display result |
| 400 | Bad Request | Show error message |
| 401 | Unauthorized | Redirect to login |
| 404 | Not Found | Show "not in database" message |
| 429 | Too Many Requests | Show upgrade modal |
| 500 | Internal Error | Show generic error |
| 503 | Service Unavailable | Show "try again later" |

### C. Performance Benchmarks

**Target Performance:**
- Cold start: <2s
- Warm request: <200ms
- Concurrent users: 100+
- Uptime: 99.5%

**Current Performance (Estimated):**
- Cold start: ~1.5s
- Warm request: ~150ms
- Concurrent users: 50+
- Uptime: 99% (Render free tier)

### D. Troubleshooting

**Common Issues:**

1. **Gemini API timeout**
   - Symptom: 504 Gateway Timeout
   - Cause: Gemini API slow or down
   - Fix: Fallback to description search

2. **Rate limit exceeded**
   - Symptom: 429 Too Many Requests
   - Cause: Free tier limit reached
   - Fix: Wait 24 hours or upgrade

3. **HSN not found**
   - Symptom: 404 Not Found
   - Cause: HSN not in database
   - Fix: Add HSN to gst_rates.json

4. **Invalid token**
   - Symptom: 401 Unauthorized
   - Cause: Token expired or invalid
   - Fix: Re-login or renew token

### E. Contact & Support

**Development Team:**
- Backend Lead: [TBD]
- DevOps: [TBD]
- Security: [TBD]

**Emergency Contacts:**
- Production Issues: [email]
- Security Issues: [email]
- Billing Issues: [email]

---

**Document Version:** 1.0
**Last Updated:** 2025-04-30
**Next Review:** 2025-05-30
**Status:** Phase 1 Complete ✅