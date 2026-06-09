#### Viewport Meta
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
```

#### Mobile-Specific CSS
```css
/* Prevent text selection on mobile */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Prevent bounce on iOS */
body {
  overscroll-behavior-y: none;
}
```

### 8.3 Responsive Components

#### Responsive Grid
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

#### Responsive Typography
```css
.text-responsive {
  font-size: clamp(16px, 4vw, 24px);
}
```

#### Responsive Spacing
```typescript
<div className="px-4 md:px-8 lg:px-12">
  {/* Content */}
</div>
```

---

## 9. State Management

### 9.1 Local State

#### Component State
```typescript
const [query, setQuery] = useState('')
const [result, setResult] = useState(null)
const [loading, setLoading] = useState(false)
```

#### Form State
```typescript
const [formData, setFormData] = useState({
  query: '',
  query_type: 'auto',
  language: 'en',
})
```

### 9.2 Global State

#### Context API
```typescript
// contexts/AppContext.tsx
interface AppContextType {
  language: 'en' | 'hi'
  setLanguage: (lang: 'en' | 'hi') => void
  token: string | null
  setToken: (token: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [token, setTokenState] = useState<string | null>(null)

  const setToken = (token: string) => {
    setTokenState(token)
    localStorage.setItem('sg_token', token)
  }

  return (
    <AppContext.Provider value={{ language, setLanguage, token, setToken }}>
      {children}
    </AppContext.Provider>
  )
}
```

### 9.3 Server State

#### React Query (if needed)
```typescript
import { useQuery } from '@tanstack/react-query'

function useLookup(query: string) {
  return useQuery({
    queryKey: ['lookup', query],
    queryFn: () => lookup({ query }),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

---

## 10. Error Handling

### 10.1 Error Boundaries

```typescript
// components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Kuch gadbad ho gaya</h1>
            <p className="text-text-secondary mb-6">
              Kripya thodi der baad try karein.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 10.2 API Error Handling

```typescript
// lib/api.ts
export async function lookup(request: LookupRequest): Promise<LookupResponse> {
  try {
    const response = await fetch(`${API_URL}/api/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      
      switch (error.error) {
        case 'rate_limit_exceeded':
          throw new Error('Aaj ke 3 lookups ho gaye. Kal phir aayein ya upgrade karein.')
        case 'hsn_not_found':
          throw new Error('Yeh HSN code abhi hamare database mein nahi hai.')
        default:
          throw new Error('Kuch gadbad ho gaya. Kripya thodi der baad try karein.')
      }
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error. Internet connection check karein.')
  }
}
```

### 10.3 User-Friendly Error Messages

```typescript
// components/ErrorDisplay.tsx
'use client'

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <p className="text-red-400">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-accent hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## 11. Testing Strategy

### 11.1 Unit Testing

#### Component Testing
```typescript
// components/__tests__/SearchBox.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBox } from '../SearchBox'

describe('SearchBox', () => {
  it('renders input with correct placeholder', () => {
    render(<SearchBox query="" setQuery={() => {}} language="en" setLanguage={() => {}} onSubmit={() => {}} />)
    expect(screen.getByPlaceholderText(/Product ka naam likhein/i)).toBeInTheDocument()
  })

  it('calls onSubmit when Enter key is pressed', () => {
    const onSubmit = jest.fn()
    render(<SearchBox query="LED TV" setQuery={() => {}} language="en" setLanguage={() => {}} onSubmit={onSubmit} />)
    
    const input = screen.getByPlaceholderText(/Product ka naam likhein/i)
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    expect(onSubmit).toHaveBeenCalled()
  })

  it('toggles language when language button is clicked', () => {
    const setLanguage = jest.fn()
    render(<SearchBox query="" setQuery={() => {}} language="en" setLanguage={setLanguage} onSubmit={() => {}} />)
    
    fireEvent.click(screen.getByText('हिं'))
    expect(setLanguage).toHaveBeenCalledWith('hi')
  })
})
```

#### Utility Testing
```typescript
// lib/__tests__/storage.test.ts
import { getToken, setToken, clearToken, getLookupsToday, incrementLookups } from '../storage'

describe('Storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and retrieves token', () => {
    setToken('test-token', new Date('2026-05-30'))
    expect(getToken()).toBe('test-token')
  })

  it('clears token', () => {
    setToken('test-token', new Date('2026-05-30'))
    clearToken()
    expect(getToken()).toBeNull()
  })

  it('increments lookups count', () => {
    expect(getLookupsToday()).toBe(0)
    incrementLookups()
    expect(getLookupsToday()).toBe(1)
  })
})
```

### 11.2 Integration Testing

#### API Integration Testing
```typescript
// lib/__tests__/api.test.ts
import { lookup } from '../api'

describe('API integration', () => {
  it('performs successful lookup', async () => {
    const result = await lookup({ query: '8528', query_type: 'hsn' })
    expect(result.hsn_code).toBe('8528')
    expect(result.description).toBeDefined()
  })

  it('handles rate limit error', async () => {
    await expect(lookup({ query: 'test' })).rejects.toThrow('rate limit')
  })
})
```

### 11.3 E2E Testing

#### Playwright Testing
```typescript
// e2e/check-page.spec.ts
import { test, expect } from '@playwright/test'

test('user can lookup GST rate', async ({ page }) => {
  await page.goto('https://saralgst.in/check')
  
  // Enter query
  await page.fill('input[placeholder*="Product ka naam"]', 'LED TV')
  
  // Submit
  await page.press('input[placeholder*="Product ka naam"]', 'Enter')
  
  // Wait for result
  await expect(page.locator('text=8528')).toBeVisible()
  await expect(page.locator('text=Television sets')).toBeVisible()
})

test('user sees rate limit message after 3 lookups', async ({ page }) => {
  await page.goto('https://saralgst.in/check')
  
  // Perform 3 lookups
  for (let i = 0; i < 3; i++) {
    await page.fill('input[placeholder*="Product ka naam"]', 'test')
    await page.press('input[placeholder*="Product ka naam"]', 'Enter')
    await page.waitForTimeout(100)
  }
  
  // 4th lookup should show upgrade modal
  await page.fill('input[placeholder*="Product ka naam"]', 'test')
  await page.press('input[placeholder*="Product ka naam"]', 'Enter')
  await expect(page.locator('text=Aaj ki limit ho gayi')).toBeVisible()
})
```

---

## 12. Deployment

### 12.1 Build Process

#### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

#### Build Output
```
.next/
├── static/
│   ├── chunks/
│   ├── media/
│   └── pages/
├── server/
└── build-manifest.json
```

### 12.2 Environment Variables

#### Production (.env.local)
```env
NEXT_PUBLIC_API_URL=https://saralgst-api.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
HMAC_SECRET=your_hmac_secret_here
```

#### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
HMAC_SECRET=test_secret_key
```

### 12.3 Vercel Deployment

#### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_API_URL": {
      "value": "https://saralgst-api.onrender.com"
    },
    "NEXT_PUBLIC_RAZORPAY_KEY_ID": {
      "value": "@razorpay_key_id"
    },
    "HMAC_SECRET": {
      "value": "@hmac_secret"
    }
  }
}
```

#### Deployment Steps
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 13. Monitoring & Analytics

### 13.1 Performance Monitoring

#### Web Vitals
```typescript
// app/layout.tsx
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
    // Send to analytics service
  })

  return null
}
```

#### Custom Metrics
```typescript
// lib/analytics.ts
export function trackEvent(name: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', name, properties)
  }
}

export function trackLookup(query: string, result: any) {
  trackEvent('lookup', {
    query_type: /^\d+$/.test(query) ? 'hsn' : 'product',
    hsn_code: result.hsn_code,
    rate_changed: result.rate_changed,
  })
}
```

### 13.2 Error Tracking

#### Sentry Integration
```typescript
// sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

### 13.3 User Analytics

#### Google Analytics
```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## 14. Internationalization (i18n)

### 14.1 Language Support

#### Supported Languages
- **English (en)**: Default language
- **Hindi (hi)**: Secondary language

#### Language Detection
```typescript
// lib/i18n.ts
export function detectLanguage(): 'en' | 'hi' {
  // Check localStorage first
  const stored = localStorage.getItem('sg_language')
  if (stored === 'en' || stored === 'hi') {
    return stored
  }

  // Check browser language
  const browserLang = navigator.language.split('-')[0]
  if (browserLang === 'hi') {
    return 'hi'
  }

  // Default to English
  return 'en'
}
```

### 14.2 Translation System

#### Translation Dictionary
```typescript
// lib/translations.ts
export const translations = {
  en: {
    hero: {
      title: 'Sahi GST rate.',
      subtitle: 'Seedha jawab.',
      description: 'GST 2.0 ke baad rates badal gaye. Kya aap sahi rate file kar rahe hain?',
      cta: 'Rate Check Karein →',
    },
    search: {
      placeholder: "Product ka naam likhein... jaise 'LED TV' ya 'cement' ya HSN code '8528'",
      submit: 'Search',
    },
    errors: {
      rate_limit: 'Aaj ke 3 lookups ho gaye. Kal phir aayein ya upgrade karein.',
      network: 'Internet connection check karein aur dobara try karein.',
      not_found: 'Yeh HSN code abhi hamare database mein nahi hai.',
    },
  },
  hi: {
    hero: {
      title: 'सही GST दर.',
      subtitle: 'सीधा जवाब.',
      description: 'GST 2.0 के बाद दरें बदल गई हैं। क्या आप सही दर फाइल कर रहे हैं?',
      cta: 'दर जांचें →',
    },
    search: {
      placeholder: "उत्पाद का नाम लिखें... जैसे 'LED TV' या 'सीमेंट' या HSN कोड '8528'",
      submit: 'खोजें',
    },
    errors: {
      rate_limit: 'आज की 3 लुकअप हो गई। कल फिर आएं या अपग्रेड करें।',
      network: 'इंटरनेट कनेक्शन जांचें और फिर से कोशिश करें।',
      not_found: 'यह HSN कोड अभी हमारे डेटाबेस में नहीं है।',
    },
  },
}

export function t(key: string, lang: 'en' | 'hi' = 'en'): string {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}
```

#### Usage in Components
```typescript
import { t } from '@/lib/translations'

function HeroSection() {
  const language = useLanguage()
  
  return (
    <div>
      <h1>{t('hero.title', language)}</h1>
      <p>{t('hero.description', language)}</p>
      <button>{t('hero.cta', language)}</button>
    </div>
  )
}
```

---

## 15. SEO Optimization

### 15.1 Meta Tags

#### Page Metadata
```typescript
// app/page.tsx
export const metadata = {
  title: 'SaralGST - Sahi rate. Seedha jawab.',
  description: 'India\'s simplest GST rate checker. Type a product, get the correct rate under GST 2.0.',
  keywords: 'GST rate checker, GST 2.0, HSN code, GST rates India',
  openGraph: {
    title: 'SaralGST - Sahi rate. Seedha jawab.',
    description: 'India\'s simplest GST rate checker.',
    url: 'https://saralgst.in',
    siteName: 'SaralGST',
    images: [
      {
        url: 'https://saralgst.in/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaralGST - Sahi rate. Seedha jawab.',
    description: 'India\'s simplest GST rate checker.',
    images: ['https://saralgst.in/og-image.png'],
  },
}
```

### 15.2 Structured Data

#### JSON-LD Schema
```typescript
// app/layout.tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SaralGST',
  description: 'India\'s simplest GST rate checker',
  url: 'https://saralgst.in',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '499',
    priceCurrency: 'INR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 15.3 Sitemap

#### Sitemap Generation
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://saralgst.in',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://saralgst.in/check',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://saralgst.in/upgrade',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
```

#### Robots.txt
```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://saralgst.in/sitemap.xml',
  }
}
```

---

## 16. Best Practices

### 16.1 Code Organization

#### File Structure
```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── check/
│   │   └── page.tsx
│   └── upgrade/
│       └── page.tsx
├── components/
│   ├── SearchBox.tsx
│   ├── ResultCard.tsx
│   └── ...
├── lib/
│   ├── api.ts
│   ├── storage.ts
│   └── utils.ts
├── styles/
│   └── globals.css
└── public/
    ├── fonts/
    └── images/
```

#### Naming Conventions
- **Components**: PascalCase (SearchBox.tsx)
- **Utilities**: camelCase (formatDate.ts)
- **Constants**: UPPER_SNAKE_CASE (API_URL)
- **Types**: PascalCase (LookupRequest)

### 16.2 Performance Best Practices

#### Code Splitting
```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
})
```

#### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="SaralGST"
  width={200}
  height={50}
  priority
/>
```

#### Font Optimization
```typescript
// Subset and optimize fonts
const font = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
```

### 16.3 Accessibility Best Practices

#### Semantic HTML
```typescript
// Use semantic elements
<main>
  <header>
    <nav>...</nav>
  </header>
  <section>
    <h1>...</h1>
  </section>
  <footer>...</footer>
</main>
```

#### ARIA Attributes
```typescript
// Add ARIA labels
<button
  aria-label="Close modal"
  onClick={onClose}
>
  ×
</button>
```

#### Keyboard Navigation
```typescript
// Ensure keyboard accessibility
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
  onClick={handleClick}
>
  Clickable element
</div>
```

---

## 17. Conclusion

SaralGST frontend architecture provides a solid foundation for a modern, performant, and accessible web application. The implementation prioritizes mobile-first design, performance optimization, and user experience while maintaining simplicity and reliability.

**Key Strengths**:
- Mobile-first responsive design
- Performance optimized for 3G networks
- Accessible (WCAG 2.1 AA compliant)
- Bilingual support (English/Hindi)
- Premium Lusion-inspired aesthetic
- Fast load times (<3s on 3G)

**Areas for Improvement**:
- Advanced state management (Redux/Zustand)
- Server-side rendering optimization
- Advanced animations (WebGL)
- PWA capabilities
- Offline support

**Next Steps**:
1. Complete component implementation
2. Implement GSAP animations
3. Add comprehensive testing
4. Optimize for performance
5. Deploy to Vercel
6. Monitor and iterate

---

*Frontend development is an iterative process. Continuous improvement based on user feedback and analytics is essential.*