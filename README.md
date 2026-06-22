# SaralGST Backend

FastAPI-based microservice for GST rate lookup — GST 2.0 compliant. Serves 551 rate items across 9 categories with plain language search, HSN lookup, and tax calculation.

## Quick Start

### Prerequisites
- Python 3.12+

### Installation

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
nano .env
```

### Configuration

```env
GEMINI_API_KEY=your_gemini_api_key_here
HMAC_SECRET=your_hmac_secret_here    # Generate: openssl rand -hex 32
RATE_LIMIT_FREE=3
RATE_LIMIT_PAID=1000
ALLOWED_ORIGINS=http://localhost:3000,https://saralgst.in
```

### Running the Server

```bash
# Development (reload on changes)
python3 main.py

# Or via uvicorn directly (no reload)
uvicorn main:app --host 0.0.0.0 --port 8000
```

### API Documentation

Once running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## API Endpoints

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
  "timestamp": "2025-09-22T12:00:00",
  "items_count": 551
}
```

### Legacy Lookup (with Gemini NLP)

```bash
POST /api/lookup
Content-Type: application/json

{
  "query": "LED TV",
  "query_type": "auto",
  "language": "en"
}
```

### V1 Lookup (Recommended — GET)

```bash
GET /api/v1/gst/lookup?query=rice
```

Response:
```json
{
  "hsn_code": "1006",
  "description": "Rice",
  "description_hi": "चावल",
  "category": "Food & Agriculture",
  "old_rate": 0.0,
  "new_rate": 0.0,
  "rate_changed": false,
  "movement": "unchanged",
  "notification_ref": "Notification No. 1/2025-CT(Rate)",
  "notes": "Unbranded rice exempt",
  "confidence": 1.0,
  "interpreted_from": "rice"
}
```

### V1 Rate Explanation

```bash
GET /api/v1/gst/explain?item_name=LPG
```

### V1 Tax Calculator

```bash
POST /api/v1/gst/calculate
Content-Type: application/json

{
  "item_name": "LED TV",
  "price": 50000
}
```

Response:
```json
{
  "item_name": "LED TV",
  "hsn_code": "8528",
  "price": 50000,
  "gst_rate": 18,
  "cgst": 4500,
  "sgst": 4500,
  "igst": 9000,
  "total_with_gst": 59000
}
```

### Token Validation

```bash
POST /api/validate-key
Content-Type: application/json

{
  "token": "your_hmac_token_here"
}
```

## Route Map

| Method | Route | Auth | Rate Limit | Purpose |
|---|---|---|---|---|
| `GET` | `/health` | None | None | Health check |
| `GET` | `/` | None | None | API info |
| `POST` | `/api/lookup` | None | 3/day | Legacy lookup (Gemini) |
| `POST` | `/api/validate-key` | None | None | HMAC validation |
| `GET` | `/api/v1/gst/lookup` | None | 3/day | V1 lookup (frontend) |
| `GET` | `/api/v1/gst/explain` | None | None | Rate explanation |
| `POST` | `/api/v1/gst/calculate` | None | None | Tax calculation |

## Project Structure

```
backend/
├── main.py                 # FastAPI entry point (app setup, CORS, routes)
├── config.py               # Configuration (paths, rate limits, env vars)
├── requirements.txt        # Python dependencies
├── data/
│   └── gst_rates.json      # 551 GST rate items (GST 2.0)
├── routers/
│   ├── lookup.py           # POST /api/lookup (legacy, with Gemini)
│   ├── v1_gst.py           # GET /api/v1/gst/* (new, frontend-friendly)
│   └── validate.py         # POST /api/validate-key (HMAC)
├── services/
│   ├── calculator.py       # CGST/SGST/IGST calculation logic
│   ├── interpreter.py      # Gemini Flash NLP interpretation (fallback)
│   └── rate_engine.py      # HSN code lookup engine (fuzzy + exact)
├── models/
│   └── lookup.py           # Pydantic request/response models
├── tests/
│   ├── test_lookup.py      # Legacy lookup tests
│   ├── test_interpreter.py # NLP interpreter tests
│   └── fixtures/           # Sample test data
└── scripts/
    ├── extend_data.py      # Data extension utility
    └── generate_data.py    # Data generation script
```

## Data Model

### gst_rates.json schema

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

**Item fields:**
- `hsn` — HSN/SAC code (2-8 digits)
- `description` — English description
- `description_hi` — Hindi description
- `category` — Product category
- `old_rate` — Rate before GST 2.0 (0, 5, 12, 18, 28)
- `new_rate` — Rate after GST 2.0 (0, 5, 12, 18, 28)
- `rate_changed` — Boolean flag
- `movement` — `"up" | "down" | "unchanged" | "new_exempt"`
- `notification_ref` — Official GST notification reference
- `notes` — Additional notes

## Testing

```bash
# Run all tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=. --cov-report=html

# Specific test file
pytest tests/test_lookup.py -v
```

## Security

- **Rate Limiting**: Free tier 3/day per IP, Paid tier 1000/day per token
- **Authentication**: HMAC token-based for paid lookups
- **CORS**: Restricted to `http://localhost:3000` (dev) and `https://saralgst.in` (prod)
- **Input Validation**: Pydantic models on all endpoints
- **Environment**: All secrets via `.env`, no hardcoded keys

## Deployment

### Render (Recommended)

```bash
# Connect GitHub repo for auto-deploy
# Set env vars in Render dashboard
```

### Environment Variables on Render

```env
GEMINI_API_KEY=your_gemini_api_key
HMAC_SECRET=your_hmac_secret
RATE_LIMIT_FREE=3
RATE_LIMIT_PAID=1000
ALLOWED_ORIGINS=https://saralgst.in
ENVIRONMENT=production
```

## Development

```bash
# Format code
black .

# Lint
flake8 .

# Type check
mypy .
```

### Adding New GST Rates

1. Edit `data/gst_rates.json`
2. Add new item following the schema above
3. Run validation: `python -c "import json; json.load(open('data/gst_rates.json'))"`
4. Commit and restart the server

## License

Proprietary — All rights reserved. © 2025 SaralGST.

---

**Sahi rate. Seedha jawab. Sirf SaralGST.**
