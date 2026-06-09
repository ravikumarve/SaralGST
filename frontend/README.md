# SaralGST Frontend

India's simplest GST rate checker frontend. Built with Next.js 14, TypeScript, Tailwind CSS, and GSAP.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP + Framer Motion
- **UI Components**: Radix UI
- **Fonts**: Space Grotesk, Inter, JetBrains Mono

## Design System

The frontend uses a Lusion-inspired dark design system with:

### Color Palette

- **Background**: Deep space black (#050508)
- **Surface**: Elevated surfaces (#111120)
- **Accent**: Indigo (#6366f1) and Violet (#8b5cf6)
- **Text**: Primary (#f0f0ff), Secondary (rgba(240,240,255,0.5))

### Typography

- **Headings**: Space Grotesk (geometric, modern)
- **Body**: Inter (readable on mobile)
- **Monospace**: JetBrains Mono (HSN codes, rates)

### Effects

- Noise grain texture overlay
- Ambient glow orbs
- Smooth GSAP animations
- Custom scrollbar

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── check/
│   │   └── page.tsx          # Rate checker UI
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles + design system
├── components/
│   ├── SearchBox.tsx         # Main query input
│   ├── ResultCard.tsx        # Rate result display
│   ├── RateComparison.tsx    # Old vs New rate visual
│   ├── NotificationBadge.tsx # GST notification reference
│   ├── UsageCounter.tsx      # Free tier usage counter
│   └── UpgradeModal.tsx      # Razorpay payment modal
├── lib/
│   ├── api.ts                # Backend API client
│   └── storage.ts            # LocalStorage management
├── public/
│   └── fonts/                # Self-hosted fonts
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on http://localhost:8001

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your values:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
HMAC_SECRET=your_hmac_secret
```

4. Run development server:
```bash
npm run dev
```

5. Open http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the backend API through the `apiClient` in `lib/api.ts`:

```typescript
import { apiClient } from '@/lib/api';

// Lookup GST rate
const result = await apiClient.lookup({
  query: 'LED TV',
  query_type: 'auto',
  language: 'en'
});

// Validate session token
const validation = await apiClient.validateKey(token);
```

## LocalStorage Management

The `storageManager` in `lib/storage.ts` handles:

- Daily lookup counter (free tier: 3/day)
- Session token storage
- Tier management (free/paid/ca_firm)
- Language preference
- Token expiry checking

```typescript
import { storageManager } from '@/lib/storage';

// Get remaining lookups
const remaining = storageManager.getRemainingLookups();

// Check if limit reached
if (storageManager.hasReachedDailyLimit()) {
  // Show upgrade modal
}

// Set token after payment
storageManager.setToken(token);
storageManager.setTier('paid');
storageManager.setExpiresAt(expiresAt);
```

## Design System Usage

### Colors

Use Tailwind classes with custom colors:

```tsx
<div className="bg-bg text-text-primary border-border">
  <h1 className="text-accent">Accent text</h1>
  <p className="text-text-secondary">Secondary text</p>
</div>
```

### Typography

```tsx
<h1 className="font-space-grotesk text-6xl">Heading</h1>
<p className="font-inter text-lg">Body text</p>
<code className="font-jetbrains-mono">HSN: 8528</code>
```

### Effects

```tsx
<div className="glow-orb glow-orb-1 animate-float" />
<div className="border-glow">Glowing border</div>
<div className="animate-shimmer">Shimmer effect</div>
```

## Performance Targets

- Page load < 3s on 3G mobile
- Lighthouse score ≥ 85
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s

## Accessibility

- WCAG 2.1 AA compliant
- Screen reader support
- Keyboard navigation
- Color contrast ≥ 4.5:1
- Hindi language support

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://saralgst-api.onrender.com
RAZORPAY_KEY_ID=production_key_id
RAZORPAY_KEY_SECRET=production_key_secret
HMAC_SECRET=production_hmac_secret
```

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact support@saralgst.in
