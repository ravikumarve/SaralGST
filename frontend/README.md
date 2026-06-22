# SaralGST Frontend

India's simplest GST rate checker — frontend. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Tech Stack

| Tech | Version |
|---|---|
| **Framework** | Next.js 16.2.4 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **UI** | Radix UI Dialog + Tooltip |
| **Fonts** | Space Grotesk, Inter, JetBrains Mono, Syncopate |
| **Payments** | Razorpay SDK |

## Design System — Landing-2

Clean panels, solid colors, zero animations, bento grid centerpiece.

### Palette
```
bg-base:   #050505    →  --color-bg
bg-panel:  #0d0d0d    →  --color-bg-panel
bg-surface:#141414    →  --color-bg-surface
accent-cyan:   #00f0ff
accent-violet: #8a2be2
accent-emerald:#10b981
text-primary:#ededed
text-secondary:#a1a1aa
text-tertiary:#71717a
borders: #262626 / #404040
```

### Principles
- **Zero animations** — No GSAP, no Framer Motion, no CSS keyframes
- **Solid backgrounds** — No transparency stacks, no glassmorphism
- **Bento grid** — Structured information layout
- **Gradient text** — Cyan-to-violet accent on key elements

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero → Platform Bento → Use Cases → Pricing → Footer |
| `/check` | Rate Checker | SearchBox + ResultCard + RateComparison + TaxCalculator + UpgradeModal + UsageCounter |
| `/_not-found` | 404 | Brutalist heading, ambient grid |

## Components

```
components/
├── BentoGrid.tsx       # 12-col responsive platform grid
├── CodeBlock.tsx       # Bare code block with token highlighting
├── FloatingNav.tsx     # Sticky pill nav (cyan dot + mono links)
├── RateComparison.tsx  # Old vs new rate metric bars
├── ResultCard.tsx      # Rate result panel
├── SearchBox.tsx       # Dual-mode query input (product/HSN) + language toggle
├── TaxCalculator.tsx   # CGST/SGST/IGST breakdown
├── UpgradeModal.tsx    # Paid tier upgrade prompt
└── UsageCounter.tsx    # Free tier daily usage tracker
```

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API running on http://localhost:8000

### Installation

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
HMAC_SECRET=your_hmac_secret
```

### Development

```bash
npm run dev      # Start dev server on http://localhost:3000
```

### Production

```bash
npm run build    # TypeScript check + Next.js build
npm start        # Start production server
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | Run ESLint |

## Backend Integration

The frontend communicates with the FastAPI backend through `lib/api.ts`:

```typescript
import { apiClient } from '@/lib/api';

// Lookup GST rate (GET /api/v1/gst/lookup)
const result = await apiClient.lookup({ query: 'LED TV' });

// Calculate tax (POST /api/v1/gst/calculate)
const calc = await apiClient.calculate({ item_name: 'LED TV', price: 50000 });

// Explain rate (GET /api/v1/gst/explain)
const explain = await apiClient.explain({ item_name: 'LED TV' });

// Validate session token
const validation = await apiClient.validateKey(token);
```

## Build Output

```
✓ Compiled in 12s
✓ 0 TypeScript errors
✓ Static pages (7/7)
  ○  /            (static)
  ○  /_not-found  (static)
  ƒ  /api/create-order
  ƒ  /api/verify-payment
  ○  /check       (static)
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://saralgst-api.onrender.com
RAZORPAY_KEY_ID=production_key_id
RAZORPAY_KEY_SECRET=production_key_secret
HMAC_SECRET=production_hmac_secret
```

## License

Proprietary — All rights reserved. © 2025 SaralGST.
