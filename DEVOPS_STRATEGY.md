# DEVOPS_STRATEGY.md — SaralGST

**Status**: Draft | **Author**: DevOps Automator | **Last Updated**: April 30, 2026 | **Version**: 1.0

---

## 1. Executive Summary

SaralGST DevOps strategy prioritizes simplicity, cost-efficiency, and reliability using free-tier cloud services. The architecture leverages serverless platforms and managed services to minimize operational overhead while maintaining high availability and performance.

**Core DevOps Principles**:
- **Cost-First**: Free tier wherever possible
- **Automation-First**: CI/CD for all deployments
- **Monitoring-First**: Observability from day one
- **Security-First**: Zero-trust architecture
- **Reliability-First**: High availability with minimal complexity

**Infrastructure Stack**:
- **Backend**: Render free tier
- **Frontend**: Vercel free tier
- **Domain**: saralgst.in (Namecheap)
- **DNS**: Cloudflare (free tier)
- **Monitoring**: Sentry (free tier), Uptime Robot (free tier)
- **CI/CD**: GitHub Actions (free tier)

---

## 2. Infrastructure Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Users                                 │
│                  Mobile / Desktop                           │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                            │
│                  DDoS Protection + SSL                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   Frontend (Vercel)    │   │   Backend (Render)     │
│   https://saralgst.in   │   │   saralgst-api.onrender │
│   Next.js 14            │   │   FastAPI              │
│   Free Tier             │   │   Free Tier             │
└───────────┬─────────────┘   └───────────┬─────────────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │  External APIs  │
                  │                 │
                  │  Gemini Flash   │
                  │  Razorpay       │
                  └─────────────────┘
```

### 2.2 Infrastructure Components

| Component | Provider | Tier | Cost | Purpose |
|-----------|----------|------|------|---------|
| **Frontend** | Vercel | Free | $0 | Next.js hosting |
| **Backend** | Render | Free | $0 | FastAPI hosting |
| **Domain** | Namecheap | Paid | $12/year | saralgst.in |
| **DNS** | Cloudflare | Free | $0 | DNS management |
| **SSL** | Cloudflare | Free | $0 | SSL certificates |
| **CI/CD** | GitHub Actions | Free | $0 | Automated deployments |
| **Monitoring** | Sentry | Free | $0 | Error tracking |
| **Uptime** | Uptime Robot | Free | $0 | Availability monitoring |
| **Logs** | Render/Vercel | Free | $0 | Log aggregation |

**Total Monthly Cost**: $0 (excluding domain: $12/year = $1/month)

---

## 3. Deployment Strategy

### 3.1 Frontend Deployment (Vercel)

#### Vercel Configuration

**vercel.json**:
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
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

#### Deployment Steps

**Initial Setup**:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
cd frontend
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID
vercel env add HMAC_SECRET

# Deploy to production
vercel --prod
```

**Automated Deployment**:
```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Run tests
        run: |
          cd frontend
          npm test

      - name: Build
        run: |
          cd frontend
          npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
```

### 3.2 Backend Deployment (Render)

#### Render Configuration

**render.yaml**:
```yaml
services:
  - type: web
    name: saralgst-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PORT
        value: 8000
      - key: GEMINI_API_KEY
        sync: false
      - key: HMAC_SECRET
        sync: false
      - key: RATE_LIMIT_FREE
        value: "3"
      - key: RATE_LIMIT_PAID
        value: "1000"
      - key: ALLOWED_ORIGINS
        value: https://saralgst.in,https://www.saralgst.in
      - key: RAZORPAY_KEY_SECRET
        sync: false
```

#### Deployment Steps

**Initial Setup**:
```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Create new web service
render create web-service

# Set environment variables in Render dashboard
# GEMINI_API_KEY
# HMAC_SECRET
# RAZORPAY_KEY_SECRET
```

**Automated Deployment**:
```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt

      - name: Run tests
        run: |
          cd backend
          pytest

      - name: Deploy to Render
        uses: johnbenedictlam/render-deploy@v1.0.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          render-api-key: ${{ secrets.RENDER_API_KEY }}
```

### 3.3 Database Deployment

**Note**: SaralGST uses JSON file storage, no database required for v1.

**Future Considerations** (v2):
- **PostgreSQL**: Supabase free tier
- **Redis**: Upstash free tier
- **Migration Strategy**: JSON → PostgreSQL migration script

---

## 4. CI/CD Pipeline

### 4.1 GitHub Actions Workflow

#### Main Workflow

**.github/workflows/ci-cd.yml**:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Frontend Tests
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Run linter
        run: |
          cd frontend
          npm run lint

      - name: Run tests
        run: |
          cd frontend
          npm test

      - name: Build
        run: |
          cd frontend
          npm run build

  # Backend Tests
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt

      - name: Run linter
        run: |
          cd backend
          ruff check .

      - name: Run tests
        run: |
          cd backend
          pytest --cov=. --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml

  # Security Scanning
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Bandit
        run: |
          cd backend
          pip install bandit
          bandit -r . -f json -o bandit-report.json

      - name: Run Safety
        run: |
          cd backend
          pip install safety
          safety check --json > safety-report.json

      - name: Upload security reports
        uses: actions/upload-artifact@v3
        with:
          name: security-reports
          path: |
            backend/bandit-report.json
            backend/safety-report.json

  # Deploy (main branch only)
  deploy:
    needs: [test-frontend, test-backend, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy Frontend
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend

      - name: Deploy Backend
        uses: johnbenedictlam/render-deploy@v1.0.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          render-api-key: ${{ secrets.RENDER_API_KEY }}

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to production completed'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

### 4.2 Pre-Commit Hooks

**.pre-commit-config.yaml**:
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files

  - repo: https://github.com/psf/black
    rev: 23.12.0
    hooks:
      - id: black
        language_version: python3.12

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.8
    hooks:
      - id: ruff
        args: [--fix, --exit-non-zero-on-fix]

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.1.0
    hooks:
      - id: prettier
        files: \.(js|jsx|ts|tsx|json|css|md)$
```

**Installation**:
```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run manually
pre-commit run --all-files
```

---

## 5. Monitoring & Logging

### 5.1 Application Monitoring

#### Sentry Integration

**Backend (sentry.py)**:
```python
import sentry_sdk
from fastapi import FastAPI

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=0.1,
    environment="production",
)

app = FastAPI()
```

**Frontend (sentry.client.ts)**:
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: 'production',
  tracesSampleRate: 0.1,
})
```

#### Custom Metrics

**Backend Metrics**:
```python
# metrics.py
from prometheus_client import Counter, Histogram

lookup_requests = Counter(
    'lookup_requests_total',
    'Total lookup requests',
    ['query_type', 'language']
)

lookup_duration = Histogram(
    'lookup_duration_seconds',
    'Lookup request duration'
)

rate_limit_hits = Counter(
    'rate_limit_hits_total',
    'Total rate limit hits',
    ['tier']
)
```

### 5.2 Log Management

#### Structured Logging

**Backend Logging**:
```python
# logging_config.py
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno,
        }
        if hasattr(record, 'extra'):
            log_data.update(record.extra)
        return json.dumps(log_data)

logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)
logger.handlers[0].setFormatter(JSONFormatter())
```

**Frontend Logging**:
```typescript
// logger.ts
export function logEvent(name: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: name,
      ...properties,
    }))
  }
}
```

### 5.3 Uptime Monitoring

#### Uptime Robot Configuration

**Monitors**:
1. **Frontend**: https://saralgst.in (every 5 minutes)
2. **Backend**: https://saralgst-api.onrender.com/health (every 5 minutes)
3. **API**: https://saralgst-api.onrender.com/api/lookup (every 15 minutes)

**Alerts**:
- **Email**: Immediate for downtime
- **Slack**: Immediate for downtime
- **SMS**: Critical only (>30 minutes downtime)

---

## 6. Security & Compliance

### 6.1 Secrets Management

#### Environment Variables

**Backend (.env)**:
```env
GEMINI_API_KEY=your_gemini_api_key
HMAC_SECRET=your_hmac_secret_32_bytes_hex
RATE_LIMIT_FREE=3
RATE_LIMIT_PAID=1000
ALLOWED_ORIGINS=https://saralgst.in,https://www.saralgst.in
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=https://saralgst-api.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
HMAC_SECRET=your_hmac_secret_32_bytes_hex
```

#### GitHub Secrets

**Required Secrets**:
- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `RENDER_SERVICE_ID`: Render service ID
- `RENDER_API_KEY`: Render API key
- `SLACK_WEBHOOK`: Slack webhook for notifications

### 6.2 SSL/TLS Configuration

#### Cloudflare SSL

**SSL Mode**: Full (strict)

**Certificate**:
- **Type**: Let's Encrypt (free)
- **Renewal**: Automatic
- **Validity**: 90 days

#### HSTS Configuration

**Cloudflare Page Rules**:
```
URL Pattern: saralgst.in/*
Settings:
  - Always Use HTTPS: On
  - HSTS: On
  - Max-Age: 31536000
  - Include Subdomains: On
  - Preload: On
```

### 6.3 Security Headers

#### Backend Headers
```python
# main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://saralgst.in", "https://www.saralgst.in"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["saralgst.in", "www.saralgst.in", "saralgst-api.onrender.com"]
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response
```

#### Frontend Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}
```

---

## 7. Backup & Disaster Recovery

### 7.1 Backup Strategy

#### Code Backup
- **Repository**: GitHub (primary)
- **Backup**: GitLab (mirror)
- **Frequency**: Every push

#### Data Backup
- **GST Rate Data**: JSON file in repository
- **Backup**: GitHub repository
- **Frequency**: Every commit
- **Retention**: Indefinite

#### Configuration Backup
- **Environment Variables**: Documented in README
- **Backup**: README.md in repository
- **Frequency**: Every change

### 7.2 Disaster Recovery Plan

#### Recovery Time Objectives (RTO)
- **Frontend**: <5 minutes
- **Backend**: <10 minutes
- **Data**: <1 minute (in repository)

#### Recovery Point Objectives (RPO)
- **Frontend**: Last commit
- **Backend**: Last commit
- **Data**: Last commit

#### Recovery Procedures

**Frontend Recovery**:
```bash
# Clone repository
git clone https://github.com/yourusername/saralgst.git
cd saralgst/frontend

# Install dependencies
npm install

# Build
npm run build

# Deploy to Vercel
vercel --prod
```

**Backend Recovery**:
```bash
# Clone repository
git clone https://github.com/yourusername/saralgst.git
cd saralgst/backend

# Install dependencies
pip install -r requirements.txt

# Deploy to Render
# (Use Render dashboard or CLI)
```

---

## 8. Performance Optimization

### 8.1 Frontend Performance

#### Build Optimization
```javascript
// next.config.js
module.exports = {
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
}
```

#### CDN Configuration
- **CDN**: Vercel Edge Network
- **Cache**: Static assets cached for 1 year
- **Purge**: Automatic on deployment

### 8.2 Backend Performance

#### Response Time Optimization
```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

#### Caching Strategy
```python
# caching.py
from functools import lru_cache
from datetime import datetime, timedelta

@lru_cache(maxsize=1000)
def get_rate_data():
    """Cache rate data in memory."""
    # Load from JSON file
    pass

def should_refresh_cache(last_updated: datetime) -> bool:
    """Check if cache should be refreshed."""
    return datetime.now() - last_updated > timedelta(hours=24)
```

---

## 9. Scaling Strategy

### 9.1 Horizontal Scaling

#### Frontend Scaling
- **Current**: Vercel free tier (auto-scaling)
- **Limit**: 100GB bandwidth/month
- **Upgrade**: Vercel Pro ($20/month) if needed

#### Backend Scaling
- **Current**: Render free tier (1 instance)
- **Limit**: 512MB RAM, 0.1 CPU
- **Upgrade**: Render Standard ($7/month) if needed

### 9.2 Vertical Scaling

#### When to Scale Up
- **Frontend**: >80GB bandwidth/month
- **Backend**: >50% CPU utilization consistently
- **Database**: (v2) >1GB storage

#### Scaling Triggers
- **CPU**: >70% for 5 minutes
- **Memory**: >80% for 5 minutes
- **Response Time**: p95 >500ms for 5 minutes

---

## 10. Cost Management

### 10.1 Cost Breakdown

#### Monthly Costs

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| **Vercel** | Free | $0 | 100GB bandwidth |
| **Render** | Free | $0 | 512MB RAM |
| **Cloudflare** | Free | $0 | Unlimited requests |
| **GitHub** | Free | $0 | 2000 CI/CD minutes |
| **Sentry** | Free | $0 | 5,000 errors/month |
| **Uptime Robot** | Free | $0 | 50 monitors |
| **Domain** | Paid | $1 | $12/year |
| **Total** | | **$1** | |

#### Annual Costs

| Service | Cost |
|---------|------|
| **Domain** | $12 |
| **Total** | **$12** |

### 10.2 Cost Optimization

#### Free Tier Maximization
- **Vercel**: Optimize bundle size
- **Render**: Use efficient code
- **Cloudflare**: Enable caching
- **GitHub**: Optimize CI/CD time

#### Cost Monitoring
- **Alerts**: Set up cost alerts
- **Review**: Monthly cost review
- **Optimization**: Continuous optimization

---

## 11. Maintenance & Operations

### 11.1 Routine Maintenance

#### Daily Tasks
- [ ] Check uptime monitoring
- [ ] Review error logs
- [ ] Monitor performance metrics

#### Weekly Tasks
- [ ] Review security alerts
- [ ] Check dependency updates
- [ ] Review user feedback

#### Monthly Tasks
- [ ] Security audit
- [ ] Performance review
- [ ] Cost review
- [ ] Backup verification

### 11.2 Update Management

#### Dependency Updates

**Backend**:
```bash
# Check for updates
pip list --outdated

# Update dependencies
pip install --upgrade -r requirements.txt

# Test updates
pytest
```

**Frontend**:
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Test updates
npm test
```

#### Security Updates
- **Priority**: Critical security patches immediately
- **Testing**: Test in staging first
- **Deployment**: Deploy to production after testing

### 11.3 Incident Management

#### Incident Severity Levels

| Severity | Response Time | Example |
|----------|---------------|---------|
| **P0 - Critical** | 1 hour | Complete outage |
| **P1 - High** | 4 hours | Major feature broken |
| **P2 - Medium** | 24 hours | Minor feature broken |
| **P3 - Low** | 72 hours | Cosmetic issue |

#### Incident Response Process

1. **Detection**: Automated alert or user report
2. **Assessment**: Determine severity and impact
3. **Containment**: Isolate affected systems
4. **Resolution**: Fix the issue
5. **Recovery**: Restore normal operations
6. **Post-Incident**: Document and learn

---

## 12. Documentation

### 12.1 Infrastructure Documentation

#### Architecture Diagrams
- High-level architecture
- Component architecture
- Data flow diagrams
- Network topology

#### Configuration Documentation
- Environment variables
- Service configurations
- DNS records
- SSL certificates

### 12.2 Operational Documentation

#### Runbooks
- Deployment procedures
- Backup procedures
- Recovery procedures
- Troubleshooting guides

#### SOPs
- Onboarding procedures
- Offboarding procedures
- Change management
- Incident response

---

## 13. Compliance & Auditing

### 13.1 Compliance Requirements

#### Data Protection
- **GDPR**: Privacy policy, data handling
- **IT Act**: Data localization, security measures
- **GST Compliance**: Accurate rate data

#### Security Compliance
- **OWASP Top 10**: Address all vulnerabilities
- **Security Headers**: Implement all headers
- **Encryption**: TLS 1.3, data at rest

### 13.2 Auditing

#### Security Audits
- **Frequency**: Quarterly
- **Scope**: All systems
- **Tools**: OWASP ZAP, Bandit, Safety

#### Performance Audits
- **Frequency**: Monthly
- **Scope**: All endpoints
- **Tools**: Lighthouse, WebPageTest

#### Compliance Audits
- **Frequency**: Annually
- **Scope**: All processes
- **Tools**: Custom checklists

---

## 14. Future Considerations

### 14.1 v2 Enhancements

#### Infrastructure
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis (Upstash)
- **Queue**: RabbitMQ (CloudAMQP)
- **Search**: Elasticsearch (Bonsai)

#### Features
- **User Accounts**: Database-backed authentication
- **API v2**: Enhanced features
- **Webhooks**: Real-time notifications
- **Analytics**: Advanced user analytics

### 14.2 Scaling Beyond Free Tier

#### When to Upgrade
- **Traffic**: >10,000 users/month
- **Revenue**: >₹50,000 MRR
- **Features**: Need database or advanced features

#### Upgrade Path
- **Frontend**: Vercel Pro ($20/month)
- **Backend**: Render Standard ($7/month)
- **Database**: Supabase Pro ($25/month)
- **Total**: ~$52/month

---

## 15. Conclusion

SaralGST DevOps strategy provides a robust foundation for deploying and maintaining the application with minimal cost and complexity. The implementation prioritizes automation, monitoring, and reliability while leveraging free-tier cloud services.

**Key Strengths**:
- Cost-effective ($1/month total)
- Automated CI/CD pipeline
- Comprehensive monitoring
- High availability
- Security-first approach

**Areas for Improvement**:
- Advanced monitoring (Datadog, New Relic)
- Log aggregation (ELK stack)
- Automated backups (Backblaze)
- Disaster recovery testing
- Performance optimization

**Next Steps**:
1. Complete infrastructure setup
2. Configure monitoring and alerting
3. Implement CI/CD pipeline
4. Test disaster recovery
5. Document all procedures
6. Monitor and iterate

---

*DevOps is not just about tools, it's about culture and processes. Continuous improvement is essential.*