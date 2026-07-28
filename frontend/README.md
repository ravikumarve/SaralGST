# SaralGST Frontend

India's simplest GST rate checker — frontend. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Tech Stack

| Tech | Version |
|---|---|
| **Framework** | Next.js 16.2.4 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **UI** | Radix UI Dialog + Tooltip |
| **Fonts** | Plus Jakarta Sans, Inter, JetBrains Mono |
| **Payments** | Razorpay SDK |

## Design System — Obsidian & Gold

Professional glassmorphism bento-grid with gold accents. Inspired by Lusion.co aesthetic.

### Palette
```
bg-void:     #020202    →  Base background
bg-surface:  #0a0a0a    →  Card/panel background
bg-glass:    rgba(15,15,15,0.55)  →  Glass surfaces
accent-gold:      #F59E0B  →  Primary accent
accent-gold-lt:   #FBBF24  →  Gold hover/light
accent-emerald:   #10B981  →  Success/active states
text-primary:   #ededed  →  Headings
text-secondary: #a1a1aa  →  Body text
text-tertiary:  #71717a  →  Labels/metadata
text-faint:     #52525b  →  Placeholders/subtitles
borders: #262626 / rgba(255,255,255,0.08)
```

### Principles
- **Gold accent** (#F59E0B) — single accent color, no gradients
- **Glassmorphism** — rgba glass panels with backdrop blur on landing
- **Void background** (#020202) — deep obsidian, never pure black
- **Dot-matrix overlay** — subtle grid texture on landing
- **CPU-aware canvas** — FlowFieldCanvas particle system (disabled on HQ)
- **Reduced motion** — `prefers-reduced-motion` respected everywhere
- **Solid surfaces** on dashboard (HQ) — no glass/transparency for readability

## Architecture

### Routes

| Route | Page | Auth | Description |
|---|---|---|---|
| `/` | Landing | No | Hero → Bento Grid → API Section → Footer |
| `/check` | Rate Checker | No | SearchBox + ResultCard + RateComparison + TaxCalculator |
| `/hq/login` | Login | No | Email/password sign in |
| `/hq/register` | Sign Up | No | Name/email/password registration |
| `/hq/overview` | Dashboard | Yes | Stats, quick actions, system status |
| `/hq/api-keys` | API Keys | Yes | List/generate/revoke HMAC tokens |
| `/hq/usage` | Usage | Yes | Daily lookup chart (Recharts) |
| `/hq/history` | History | Yes | Searchable lookup history + CSV export |
| `/hq/favorites` | Favorites | Yes | Saved HSN codes with quick lookup |
| `/hq/billing` | Billing | Yes | Plan comparison, payment history |
| `/hq/settings` | Settings | Yes | Profile, notifications, danger zone |
| `/hq/playground` | Playground | Yes | Interactive API testing (Lookup/Explain/Calculate) |
| `/_not-found` | 404 | No | Gold-void aesthetic |

### Components

```
components/
├── FlowFieldCanvas.tsx   # CPU-aware gold particle system (landing only)
├── FloatingNav.tsx       # Fixed top nav with hamburger (landing only)
├── SearchSimulation.tsx  # 3D glass panel with live cursor blink
├── SearchBox.tsx         # Dual-mode query input (product/HSN) + language toggle
├── ResultCard.tsx        # Rate result panel
├── RateComparison.tsx    # Old vs new rate metric bars
├── TaxCalculator.tsx     # CGST/SGST/IGST breakdown
├── UpgradeModal.tsx      # Paid tier upgrade prompt
└── UsageCounter.tsx      # Free tier daily usage tracker
```

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API running on http://localhost:8000

### Installation

```bash
cd frontend
npm install
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
const calc = await apiClient.calculate({ base_price: 1000, gst_rate: 18 });

// Explain rate (GET /api/v1/gst/explain)
const explain = await apiClient.explain({ item_name: 'Rice' });

// Validate session token
const validation = await apiClient.validateKey(token);
```

## Build Output

```
✓ Compiled in 16s
✓ 0 TypeScript errors
✓ 25 routes
  ○  11 static pages
  ƒ  13 dynamic routes (API)
```

## HQ Dashboard

Saral HQ (`/hq`) is the authenticated command center. Built with:
- **Prisma v7 + SQLite** — file-based, zero server processes
- **NextAuth v5** — Credentials provider, JWT sessions, bcrypt hashing
- **Rate limit tiers** — Free (3/day), Pro (1,000/day), CA Firm (5,000/day)
- **Usage logging** — Fire-and-forget from every lookup

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
AUTH_SECRET=nextauth_secret
AUTH_TRUST_HOST=true
```

## License

Proprietary — All rights reserved. © 2025 SaralGST.
