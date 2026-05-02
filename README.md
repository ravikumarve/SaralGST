# SaralGST Backend

FastAPI-based microservice for GST rate lookup. Built for Indian small businesses to verify GST 2.0 rates.

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- pip

### Installation

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Edit .env and fill in your values
nano .env
```

### Configuration

Required environment variables in `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
HMAC_SECRET=your_hmac_secret_here  # Generate with: openssl rand -hex 32
RATE_LIMIT_FREE=3
RATE_LIMIT_PAID=1000
ALLOWED_ORIGINS=http://localhost:3000,https://saralgst.in
```

### Running the Server

```bash
# Development mode (with auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── data/
│   └── gst_rates.json     # Master GST rate table (54 items)
├── routers/
│   ├── lookup.py          # POST /api/lookup endpoint
│   └── validate.py        # POST /api/validate-key endpoint
├── services/
│   ├── interpreter.py     # Gemini Flash NLP service
│   └── rate_engine.py     # HSN lookup service
├── models/
│   └── lookup.py          # Pydantic request/response models
├── tests/
│   ├── test_lookup.py
│   ├── test_interpreter.py
│   └── fixtures/          # Sample test data
└── scripts/
    └── validate_rates.py  # JSON validation script
```

## 🔧 API Endpoints

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "data_version": "GST_2.0_Sept2025",
  "timestamp": "2025-04-30T12:00:00",
  "items_count": 54
}
```

### Rate Lookup

```bash
POST /api/lookup
```

Request:
```json
{
  "query": "LED TV",
  "query_type": "auto",
  "language": "en"
}
```

Response:
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
  "confidence": 0.9,
  "interpreted_from": "LED TV",
  "warning": null
}
```

### Token Validation

```bash
POST /api/validate-key
```

Request:
```json
{
  "token": "your_hmac_token_here"
}
```

Response:
```json
{
  "valid": true,
  "tier": "paid",
  "expires_at": "2025-05-30T12:00:00"
}
```

## 📊 Data Model

### GST Rates JSON Schema

```json
{
  "version": "GST_2.0_Sept2025",
  "last_updated": "2025-09-22",
  "items": [
    {
      "hsn": "8528",
      "description": "Television sets (LCD/LED above 32 inches)",
      "description_hi": "टेलीविजन (32 इंच से बड़े)",
      "category": "Consumer Electronics",
      "old_rate": 28,
      "new_rate": 18,
      "rate_changed": true,
      "movement": "down",
      "notification_ref": "Notification No. 8/2025-CT(Rate)",
      "notes": "Effective Sept 22, 2025"
    }
  ]
}
```

### Required Fields

- `hsn`: HSN/SAC code (2-8 digits)
- `description`: English description
- `description_hi`: Hindi description
- `category`: Product category
- `old_rate`: Rate before GST 2.0 (0, 5, 12, 18, 28)
- `new_rate`: Rate after GST 2.0 (0, 5, 12, 18, 28)
- `rate_changed`: Boolean - did rate change?
- `movement`: "up" | "down" | "unchanged" | "new_exempt"
- `notification_ref`: Official GST notification reference
- `notes`: Additional notes

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=. --cov-report=html

# Run specific test file
pytest tests/test_lookup.py -v
```

### Validate Data

```bash
# Validate gst_rates.json
python scripts/validate_rates.py

# Validate custom file
python scripts/validate_rates.py /path/to/custom_rates.json
```

## 🔒 Security

### Rate Limiting

- **Free Tier**: 3 lookups/day per IP address
- **Paid Tier**: 1000 lookups/day per token

### Authentication

- HMAC token-based authentication for paid tier
- Tokens generated after Razorpay payment verification
- Token expiry: 30 days (monthly) or 365 days (annual)

### CORS

Configured for:
- Development: `http://localhost:3000`
- Production: `https://saralgst.in`

## 📈 Performance

### Targets

- API Response Time: <200ms (p95)
- Concurrent Users: 100+
- Uptime: 99.5%

### Optimization

- In-memory caching of GST rates
- Async I/O for all external calls
- Graceful degradation when Gemini fails

## 🚀 Deployment

### Render (Recommended)

```bash
# Deploy to Render free tier
render deploy

# Or connect GitHub repo for auto-deploy
```

### Environment Variables on Render

Set these in Render dashboard:
- `GEMINI_API_KEY`
- `HMAC_SECRET`
- `RATE_LIMIT_FREE=3`
- `RATE_LIMIT_PAID=1000`
- `ALLOWED_ORIGINS=https://saralgst.in`
- `ENVIRONMENT=production`

## 📝 Development

### Code Style

```bash
# Format code
black .

# Lint code
flake8 .

# Type check
mypy .
```

### Adding New GST Rates

1. Edit `data/gst_rates.json`
2. Add new item following schema
3. Run validation: `python scripts/validate_rates.py`
4. Commit changes

## 🐛 Troubleshooting

### Common Issues

**Issue**: `ModuleNotFoundError: No module named 'fastapi'`
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Issue**: `FileNotFoundError: rates file not found`
```bash
# Solution: Ensure data/gst_rates.json exists
ls -la data/gst_rates.json
```

**Issue**: `HMAC_SECRET not set`
```bash
# Solution: Generate and set HMAC_SECRET
openssl rand -hex 32
# Add to .env file
```

## 📄 License

Proprietary - All rights reserved

## 🤝 Support

For issues or questions:
- GitHub Issues: [Create issue]
- Email: support@saralgst.in

---

**Sahi rate. Seedha jawab. Sirf SaralGST.**