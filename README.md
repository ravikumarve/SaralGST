# SaralGST — Sahi rate. Seedha jawab.

<div align="center">

**India's Simplest GST Rate Checker — GST 2.0 Compliant**

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

*Sahi rate. Seedha jawab. Sirf SaralGST.*

</div>

---

## Overview

SaralGST is a full-stack vertical SaaS for Indian small businesses, traders, and CA firms to verify GST rates after the GST 2.0 reforms (effective September 22, 2025). Type a product name in Hindi or English — get the correct GST rate instantly.

**Key Features:**
- ✅ Plain language search in **Hindi or English**
- ✅ Direct **HSN/SAC code lookup**
- ✅ Side-by-side **old vs new rate comparison**
- ✅ Official **GST notification references**
- ✅ **551 GST rate items** across 9 categories
- ✅ Free tier with 3 lookups/day
- ✅ CGST + SGST + IGST calculator

---

## Tech Stack

### Frontend
| Technology | Version |
|---|---|
| **Next.js** | 16.2.4 (App Router) |
| **React** | 19.2.4 |
| **Tailwind CSS** | 4 |
| **TypeScript** | 5 |
| **Radix UI** | Dialog + Tooltip |
| **Fonts** | Space Grotesk, Inter, JetBrains Mono, Syncopate |

### Backend
| Technology | Version |
|---|---|
| **FastAPI** | 0.109.0 |
| **Python** | 3.12+ |
| **Google Gemini** | 0.3.2 (NLP fallback) |
| **SlowAPI** | 0.1.9 (rate limiting) |
| **Data Store** | JSON file (no database) |

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.12+

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Edit .env with your keys
nano .env

# Start server
python3 main.py
```

The API will be available at **http://localhost:8000**.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:3000**.

### Verify Both Are Running

```bash
# Backend health
curl http://localhost:8000/health

# Frontend
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

# Try a lookup
curl "http://localhost:8000/api/v1/gst/lookup?query=LED%20TV"
```

---

## API Reference

### Legacy Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/` | API info |
| `POST` | `/api/lookup` | Rate lookup (with Gemini NLP) |
| `POST` | `/api/validate-key` | HMAC token validation |

### V1 Endpoints (Recommended)

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/v1/gst/lookup?query=...` | Rate lookup (GET, frontend-friendly) |
| `GET` | `/api/v1/gst/explain?item_name=...` | Rate explanation |
| `POST` | `/api/v1/gst/calculate` | CGST/SGST/IGST calculation |

### Lookup Example

```bash
GET /api/v1/gst/lookup?query=rice
```

**Response:**
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

### Calculate Tax

```bash
POST /api/v1/gst/calculate
Content-Type: application/json

{
  "item_name": "LED TV",
  "price": 50000
}
```

**Response:**
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

---

## Project Structure

```
saralgst/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── config.py            # App configuration
│   ├── requirements.txt     # Python dependencies
│   ├── data/
│   │   └── gst_rates.json   # Master GST rate table (551 items)
│   ├── routers/
│   │   ├── lookup.py        # Legacy POST /api/lookup
│   │   ├── v1_gst.py        # V1 GET /api/v1/gst/*
│   │   └── validate.py      # POST /api/validate-key
│   ├── services/
│   │   ├── calculator.py    # CGST/SGST/IGST calculation
│   │   ├── interpreter.py   # Gemini Flash NLP service
│   │   └── rate_engine.py   # HSN lookup engine
│   ├── models/
│   │   └── lookup.py        # Pydantic models
│   └── tests/
│       ├── test_lookup.py
│       └── test_interpreter.py
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Landing page (bento grid)
│   │   ├── check/
│   │   │   └── page.tsx     # Rate checker UI
│   │   ├── layout.tsx       # Root layout + FloatingNav
│   │   └── globals.css      # Landing-2 design system
│   ├── components/
│   │   ├── BentoGrid.tsx    # Platform showcase grid
│   │   ├── CodeBlock.tsx    # Code display panel
│   │   ├── FloatingNav.tsx  # Sticky pill navigation
│   │   ├── RateComparison.tsx
│   │   ├── ResultCard.tsx
│   │   ├── SearchBox.tsx    # Query input + HNS toggle
│   │   ├── TaxCalculator.tsx
│   │   ├── UpgradeModal.tsx
│   │   └── UsageCounter.tsx
│   ├── lib/
│   │   └── api.ts           # Backend API client
│   └── package.json
│
├── scripts/
│   ├── extend_data.py
│   └── generate_data.py
├── webpages/
│   └── landing-2.html       # Design reference
├── AGENTS.md                # Session memory
└── QUICK_START.md
```

---

## Design System

SaralGST uses the **landing-2** design language — clean, professional, engineering-focused.

### Palette
```
bg-base:   #050505  (deep black)
bg-panel:  #0d0d0d  (raised surface)
bg-surface:#141414  (interactive surface)
accents:   cyan (#00f0ff), violet (#8a2be2), emerald (#10b981)
text:      #ededed (primary), #a1a1aa (secondary), #71717a (tertiary)
borders:   #262626 (subtle), #404040 (hover)
```

### Principles
- **Zero animations** — No GSAP, no Framer Motion, no CSS keyframes
- **Bento grid** centerpiece — Structured, information-dense layout
- **Solid colors** — No transparency stacks, no glassmorphism
- **Monospace badges** — Engineering precision aesthetic
- **Gradient accent** text — Cyan-to-violet for emphasis

---

## Testing

### Backend
```bash
cd backend
pytest tests/ -v
pytest tests/ --cov=. --cov-report=html
```

### Frontend
```bash
cd frontend
npm run lint
npm run build    # Full production build
```

---

## Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
HMAC_SECRET=your_hmac_secret
RATE_LIMIT_FREE=3
RATE_LIMIT_PAID=1000
ALLOWED_ORIGINS=http://localhost:3000,https://saralgst.in
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
HMAC_SECRET=your_hmac_secret
```

---

## Deployment

### Backend → Render
```bash
# Connect GitHub repo or use Render CLI
render deploy
```

Set environment variables in Render dashboard.

### Frontend → Vercel
```bash
# Import from GitHub
# Set environment variables
vercel deploy
```

---

## License

Proprietary — All rights reserved. © 2025 SaralGST.

---

<div align="center">

**Built for Indian Small Businesses 🇮🇳**

[⬆ Back to Top](#saralgst--sahi-rate-seedha-jawab)

</div>
