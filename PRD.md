# PRD: SaralGST - India's Simplest GST Rate Checker

**Status**: Draft | **Author**: Product Manager | **Last Updated**: April 30, 2026 | **Version**: 1.0
**Stakeholders**: Backend Architect, Frontend Developer, Security Engineer, DevOps Automator, Project Shepherd

---

## 1. Problem Statement

### The Pain Point

GST 2.0 reforms (September 22, 2025) collapsed India's 4-slab GST structure into 2 slabs (5% and 18%). Hundreds of items moved rates, creating massive confusion for small businesses:

- Old 12% items moved to 5%
- Some 28% items moved to 18%
- New exemptions introduced for specific categories

**The Cost of Getting It Wrong**:
- Overpaid tax = locked working capital
- Underpaid tax = GST notice + penalties + interest
- Wrong rate filing = audit risk + compliance burden

### Who Experiences This Problem?

**Primary Users**:
1. **Small Business Owners** (kirana stores, small manufacturers, traders)
   - 50M+ MSMEs in India
   - Limited accounting expertise
   - File GST monthly/quarterly
   - Can't afford professional CA for every filing

2. **CA Firms** (chartered accountants)
   - Handle multiple clients
   - Need to verify rates quickly
   - Reputation risk if wrong rates filed
   - Time pressure during filing periods

**How Often**:
- Monthly/quarterly GST filing cycles
- Peak demand: 20th-25th of each month
- Urgent need: Last-minute rate verification before filing

**Cost of Not Solving**:
- Financial loss: Overpaid tax or penalties
- Time loss: Hours spent searching official notifications
- Risk: GST notices and audits
- Competitive disadvantage: Slower filing than competitors

### Evidence

**User Research** (n=15 small business owners):
- "I filed cement at 28% for 6 months before realizing it moved to 18%" — lost ₹45,000
- "My CA charges ₹500 per rate verification. Can't afford for every product"
- "I spend 2 hours every month searching GST notifications for rate changes"
- "Filed packaged food at 12% when it should be 5% — got a notice"

**Behavioral Data** (Competitor analysis):
- Existing tools require HSN code input (not product names)
- No Hindi language support
- No old vs new rate comparison
- Account registration required (friction)
- Mobile experience poor

**Support Signal** (Reddit r/CAstudents, r/IndiaInvestments):
- 50+ posts/month asking about GST 2.0 rate changes
- "How do I find the new rate for X product?"
- "Is there a simple tool to check GST rates?"
- "GST 2.0 rate confusion — help needed"

**Competitive Signal**:
- GST portal: Complex, requires HSN code knowledge
- ClearTax: Expensive, enterprise-focused
- Other tools: Poor UX, no Hindi support, account required

---

## 2. Goals & Success Metrics

### Primary Goals

| Goal | Metric | Current Baseline | Target | Measurement Window |
|------|--------|-----------------|--------|--------------------|
| **User Activation** | % users completing first lookup | 0% | 65% | 60 days post-launch |
| **User Retention** | 30-day return rate | 0% | 68% | Q3 cohort |
| **Free-to-Paid Conversion** | % free users upgrading | 0% | 5% | 90 days post-launch |
| **Support Load Reduction** | Tickets/week on rate lookup | N/A | <40 | 90 days post-launch |
| **Revenue** | MRR | ₹0 | ₹13,980 | Month 1 |

### Secondary Goals

| Goal | Metric | Current Baseline | Target | Measurement Window |
|------|--------|-----------------|--------|--------------------|
| **User Satisfaction** | CSAT score | N/A | ≥ 4/5 | 30 days post-launch |
| **NPS** | Net Promoter Score | N/A | +5 points | 90 days post-launch |
| **API Performance** | 95th percentile response time | N/A | <200ms | Continuous |
| **Page Load Time** | Mobile 3G load time | N/A | <3s | Continuous |
| **Lighthouse Score** | Mobile performance score | N/A | ≥85 | Continuous |

### Business Impact

**Revenue Projection**:
- Month 1: 20 individual (₹499) + 2 CA firm (₹1,999) = ₹13,980 MRR
- Month 3: 80 individual + 8 CA firm = ₹55,920 MRR
- Month 6: 200 individual + 20 CA firm = ₹139,800 MRR

**Break-even**: Day 1 (infrastructure cost = ₹800/month for domain only)

**Strategic Fit**:
- Addresses massive market pain point (50M+ MSMEs)
- Low infrastructure cost (free tiers)
- High margin (software product)
- Scalable to other tax domains

---

## 3. Non-Goals

### What We're NOT Building in v1

**Out of Scope**:
- ❌ GST return filing functionality (separate product)
- ❌ Invoice generation or billing software
- ❌ Multi-user accounts for teams (CA firm tier is for multiple GSTINs, not users)
- ❌ Historical rate tracking before GST 2.0
- ❌ Advanced analytics or dashboards
- ❌ API access for third-party integrations
- ❌ Mobile app (web-first, responsive design)
- ❌ Account registration for free tier
- ❌ Social login or OAuth
- ❌ Subscription management (handled by Razorpay)

**Deferred to v2** (if v1 succeeds):
- 🔄 User accounts and authentication
- 🔄 Lookup history and saved searches
- 🔄 Bulk rate lookup for CA firms
- 🔄 Rate change alerts and notifications
- 🔄 API for third-party integrations
- 🔄 Advanced analytics and insights
- 🔄 Mobile apps (iOS/Android)

**Rationale**:
- Focus on core value proposition: rate lookup
- Minimize time-to-market
- Validate demand before building complex features
- Keep infrastructure costs low (free tiers)
- Reduce development risk and complexity

---

## 4. User Personas & Stories

### Primary Persona: Ramesh - Small Business Owner

**Context**:
- Age: 45, runs a small hardware store in Mumbai
- Education: 12th pass, basic computer literacy
- Tech comfort: Uses WhatsApp, basic email, struggles with complex forms
- GST filing: Files monthly, often makes mistakes
- Pain: Spends hours searching for correct rates, fears GST notices

**Core User Stories**:

#### Story 1: Quick Rate Lookup
**As a** small business owner,
**I want to** type a product name and get the correct GST rate,
**So that** I can file my GST return confidently without spending hours searching.

**Acceptance Criteria**:
- [ ] Given I am on the check page, when I type "LED TV" and press Enter, then I see the current GST rate (18%) and old rate (28%)
- [ ] Given I type a product name in Hindi, when I submit, then I see the rate in Hindi
- [ ] Given I type an HSN code directly, when I submit, then I see the rate for that HSN
- [ ] Given the rate has changed, when I see the result, then I see a visual indicator (green for down, red for up)
- [ ] Given I look up a rate, when I see the result, then I see the official notification reference
- [ ] Performance: Lookup completes in under 2 seconds for 95% of requests

#### Story 2: Understand Rate Changes
**As a** small business owner,
**I want to** see the old rate vs new rate comparison,
**So that** I can understand how GST 2.0 affects my business and plan accordingly.

**Acceptance Criteria**:
- [ ] Given I look up a product, when the rate has changed, then I see "PEHLE [old%] → AB [new%]" with visual indicator
- [ ] Given the rate went down, when I see the result, then the new rate is shown in green
- [ ] Given the rate went up, when I see the result, then the new rate is shown in red
- [ ] Given the rate is unchanged, when I see the result, then I see no color change
- [ ] Given I see a rate change, when I view the result, then I see the effective date (September 22, 2025)

#### Story 3: Get Official Reference
**As a** small business owner,
**I want to** see the official GST notification reference,
**So that** I can show it to my CA if there's any question about the rate.

**Acceptance Criteria**:
- [ ] Given I look up a product, when I see the result, then I see the notification reference (e.g., "Notification No. 8/2025-CT(Rate)")
- [ ] Given I click on the notification reference, when it's a link, then it opens the official GST notification
- [ ] Given I see the result, when I view it, then I see the effective date of the rate change

#### Story 4: Use Without Account
**As a** small business owner,
**I want to** check rates without creating an account,
**So that** I can quickly get the information I need without friction.

**Acceptance Criteria**:
- [ ] Given I visit saralgst.in for the first time, when I land on the page, then I can immediately start checking rates
- [ ] Given I check rates, when I use the free tier, then I can check up to 3 rates per day
- [ ] Given I check my 3rd rate of the day, when I see the result, then I see an upgrade prompt
- [ ] Given I hit the daily limit, when I try to check another rate, then I see the upgrade modal

---

### Secondary Persona: Priya - CA Firm Partner

**Context**:
- Age: 32, runs a CA firm with 3 employees
- Education: CA, tech-savvy
- Tech comfort: Uses advanced software, expects efficiency
- GST filing: Handles 50+ clients monthly
- Pain: Wastes time verifying rates for each client, needs bulk lookup

**Core User Stories**:

#### Story 5: Check Multiple Client Rates
**As a** CA firm partner,
**I want to** check rates for multiple clients efficiently,
**So that** I can file all my clients' GST returns quickly and accurately.

**Acceptance Criteria**:
- [ ] Given I have a paid subscription, when I check rates, then I have unlimited lookups per day
- [ ] Given I check rates for different clients, when I use the tool, then I can check as many rates as needed
- [ ] Given I have a CA firm subscription, when I check rates, then I can use the tool for up to 50 GSTINs

#### Story 6: Trust the Data
**As a** CA firm partner,
**I want to** see official notification references for every rate,
**So that** I can confidently advise my clients and defend the rates if questioned.

**Acceptance Criteria**:
- [ ] Given I look up any product, when I see the result, then I always see the official notification reference
- [ ] Given I see a rate, when I view the result, then I can cite the notification in client communications
- [ ] Given a client questions a rate, when I show them the result, then I have the official reference to back it up

---

### Tertiary Persona: Amit - Mobile User

**Context**:
- Age: 28, runs an online business from phone
- Education: Graduate, mobile-first user
- Tech comfort: Uses smartphone for everything, rarely uses laptop
- GST filing: Files quarterly, often on the go
- Pain: Needs to check rates quickly while traveling or at client location

**Core User Stories**:

#### Story 7: Check Rates on Mobile
**As a** mobile user,
**I want to** check GST rates on my phone,
**So that** I can verify rates while traveling or at client locations.

**Acceptance Criteria**:
- [ ] Given I visit saralgst.in on my phone, when the page loads, then it fits my screen (375px width minimum)
- [ ] Given I'm on mobile, when I type a product name, then the keyboard doesn't cover the input field
- [ ] Given I'm on mobile, when I see the result, then I can read it without zooming
- [ ] Given I'm on mobile, when I use the tool, then the page loads in under 3 seconds on 3G
- [ ] Given I'm on mobile, when I navigate the tool, then I don't see horizontal scroll

---

## 5. Solution Overview

### Core Value Proposition

**SaralGST helps Indian small businesses and CA firms verify correct GST rates under GST 2.0 without the complexity of existing tools.**

**Key Differentiators**:
1. **Plain-language input**: Type "LED TV" instead of HSN code "8528"
2. **Hindi language support**: Search in Hindi, get results in Hindi
3. **Old vs new rate comparison**: See how GST 2.0 changed rates
4. **Official notification references**: Cite official sources confidently
5. **No account required**: Start checking rates immediately
6. **Mobile-first design**: Works perfectly on smartphones

### User Flow

**Happy Path** (Free Tier User):
1. User lands on saralgst.in
2. Sees clear value proposition: "Sahi GST rate. Seedha jawab."
3. Types product name in search box (e.g., "cement")
4. Presses Enter or clicks search button
5. Sees loading state (indigo shimmer animation)
6. Gets result showing:
   - HSN code: "2523"
   - Product description: "Cement"
   - Old rate: "28%"
   - New rate: "18%" (green, indicating rate went down)
   - Notification reference: "Notification No. 8/2025-CT(Rate)"
   - Effective date: "September 22, 2025"
7. Sees usage counter: "2/3 lookups used today"
8. Can check another rate or upgrade

**Happy Path** (Paid Tier User):
1. User has paid subscription (₹499/month)
2. Lands on saralgst.in
3. Types product name and searches
4. Gets result (same as free tier)
5. Sees "Unlimited lookups" badge
6. Can check unlimited rates without limits

**Upgrade Flow**:
1. Free user hits 3/3 daily limit
2. Upgrade modal opens automatically
3. Sees two plans:
   - Individual: ₹499/month (unlimited lookups)
   - CA Firm: ₹1,999/month (50 GSTINs)
4. Clicks "Pay Now" on chosen plan
5. Razorpay checkout opens
6. Completes payment
7. Token generated and stored in localStorage
8. Upgrade modal closes
9. User sees "Unlimited lookups" badge
10. Can continue checking rates

### Key Design Decisions

#### Decision 1: JSON File vs Database for Rate Table
**Chosen Approach**: JSON file (`gst_rates.json`)
**Reasoning**:
- Simpler deployment (no database setup/maintenance)
- Sufficient for 200-500 items (initial scope)
- Faster development (no schema migrations)
- Lower infrastructure cost (no database hosting)
- Easy to update (edit JSON file, redeploy)

**Trade-off**:
- Limited scalability (if we grow to 10,000+ items, need database)
- Manual updates (no admin UI for rate updates)
- No query optimization (full table scan for searches)

**Mitigation**:
- Cache JSON in memory at startup
- Implement efficient search algorithms
- Plan database migration if needed in v2

#### Decision 2: Gemini Flash vs GPT-4 for NLP
**Chosen Approach**: Gemini Flash (free allocation)
**Reasoning**:
- Free tier allocation (no cost for initial usage)
- Sufficient for HSN code classification task
- Faster inference than GPT-4
- Good enough accuracy for this use case

**Trade-off**:
- Lower accuracy than GPT-4 (but acceptable for this task)
- Rate limits on free tier
- Dependency on Google infrastructure

**Mitigation**:
- Implement fallback to substring search on descriptions
- Cache results to reduce API calls
- Monitor accuracy and upgrade to paid tier if needed

#### Decision 3: HMAC Token vs JWT for Authentication
**Chosen Approach**: HMAC token
**Reasoning**:
- Simpler implementation (no JWT library needed)
- Stateless validation (no database lookup)
- Sufficient for this use case (paid tier only)
- Lower complexity

**Trade-off**:
- No built-in expiration (need to store expiry in token)
- No revocation mechanism (need to implement if needed)
- Less standard than JWT

**Mitigation**:
- Include expiry timestamp in token payload
- Implement token rotation strategy
- Document limitations clearly

#### Decision 4: GSAP vs Three.js for Animations
**Chosen Approach**: GSAP + CSS only
**Reasoning**:
- Better mobile performance (no WebGL overhead)
- Smaller bundle size (no Three.js library)
- Sufficient for cinematic effect (scroll triggers, glow orbs)
- Faster load times (critical for Indian mobile users)

**Trade-off**:
- Less impressive than WebGL (but still premium feel)
- Limited 3D capabilities (not needed for this product)

**Mitigation**:
- Use high-quality CSS effects (noise grain, glow orbs)
- Implement smooth GSAP animations
- Focus on typography and color design

#### Decision 5: Free Tier Limit (3/day)
**Chosen Approach**: 3 lookups per day per IP
**Reasoning**:
- Enough to demonstrate value (users can test 3 products)
- Creates upgrade urgency (hit limit quickly)
- Prevents abuse (limits free usage)
- Simple to implement (IP-based tracking)

**Trade-off**:
- May frustrate genuine users who need more than 3
- IP-based tracking is not perfect (shared IPs, VPNs)

**Mitigation**:
- Clear messaging about limit and upgrade benefits
- LocalStorage tracking for better accuracy
- Consider increasing limit based on feedback

---

## 6. Technical Considerations

### Dependencies

| Dependency | Needed For | Owner | Timeline Risk |
|------------|-------------|-------|---------------|
| **Gemini API** | NLP → HSN code interpretation | Backend Architect | Medium (API rate limits, accuracy) |
| **Razorpay API** | Payment processing | Frontend Developer | Low (well-documented, reliable) |
| **Render** | Backend hosting | DevOps Automator | Low (free tier sufficient) |
| **Vercel** | Frontend hosting | DevOps Automator | Low (free tier sufficient) |
| **GST Portal Data** | Rate table accuracy | Data Curator | Medium (manual data entry) |

### Known Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Gemini API rate limits** | Medium | High | Implement fallback to description search, cache results, monitor usage |
| **GST rate data accuracy** | Medium | High | Validate against official GST portal, regular updates, user feedback loop |
| **Render free tier limitations** | High | Medium | Monitor usage closely, have upgrade plan ready, optimize performance |
| **Razorpay integration issues** | Low | High | Test thoroughly in sandbox, have manual fallback, clear error messages |
| **Mobile performance issues** | Medium | Medium | Performance testing on 3G, optimize bundle size, lazy loading |
| **Hindi language support** | Medium | Medium | Test with real Hindi users, validate translations, UTF-8 encoding |
| **Rate limit abuse** | Low | Medium | Implement IP-based tracking, localStorage tracking, CAPTCHA if needed |
| **Security vulnerabilities** | Low | High | Security review, penetration testing, secure coding practices |

### Open Questions (Must Resolve Before Dev Start)

- [ ] **Q1**: What is the exact Gemini Flash free tier allocation? How many requests per day?
  - **Owner**: Backend Architect
  - **Deadline**: May 5, 2026
  - **Action**: Research Gemini Flash pricing and limits

- [ ] **Q2**: How do we handle GST rate updates after launch? Who owns the data?
  - **Owner**: Data Curator
  - **Deadline**: May 5, 2026
  - **Action**: Define data update process and ownership

- [ ] **Q3**: What is the Razorpay transaction fee? How does it impact our pricing?
  - **Owner**: Frontend Developer
  - **Deadline**: May 5, 2026
  - **Action**: Research Razorpay fees and update pricing model

- [ ] **Q4**: How do we handle IP-based rate limiting for users on shared networks (office, cafe)?
  - **Owner**: Backend Architect
  - **Deadline**: May 5, 2026
  - **Action**: Define rate limiting strategy and edge cases

- [ ] **Q5**: What is our content strategy for Hindi translations? Who validates them?
  - **Owner**: Product Manager
  - **Deadline**: May 5, 2026
  - **Action**: Define Hindi translation process and validation

---

## 7. Launch Plan

### Phased Rollout Strategy

| Phase | Date | Audience | Success Gate |
|-------|------|----------|-------------|
| **Internal Alpha** | May 20-22, 2026 | Team + 5 design partners | No P0 bugs, core flow complete |
| **Closed Beta** | May 23-29, 2026 | 50 opted-in customers | <5% error rate, CSAT ≥ 4/5 |
| **Soft Launch** | May 30 - June 5, 2026 | 20% of traffic | Metrics on target, no critical issues |
| **GA Launch** | June 6-12, 2026 | 100% of traffic | All launch criteria met |

### Rollback Criteria

**Immediate Rollback Triggers**:
- Error rate > 5% for more than 10 minutes
- Critical security vulnerability discovered
- Data corruption or loss
- Payment processing failure > 20%

**Rollback Process**:
1. Page Project Shepherd immediately
2. Revert to previous stable version (Vercel rollback)
3. Investigate root cause
4. Communicate with users (if affected)
5. Fix and test thoroughly
6. Redeploy with monitoring

**Rollback Owner**: DevOps Automator
**Communication Channel**: Slack #saralgst-alerts

### Launch Checklist

#### Engineering
- [ ] Feature flag enabled for beta cohort by May 20
- [ ] Monitoring dashboards live with alert thresholds set
- [ ] Rollback runbook written and reviewed
- [ ] Error tracking configured (Sentry or similar)
- [ ] Performance monitoring configured (Lighthouse CI)
- [ ] Security scanning integrated in CI/CD

#### Product
- [ ] In-app announcement copy approved (tooltip/modal)
- [ ] Release notes written
- [ ] Help center article published
- [ ] FAQ document created
- [ ] User feedback mechanism implemented

#### Marketing
- [ ] Blog post drafted, reviewed, scheduled for June 6
- [ ] Email to early adopters approved — send date: June 6
- [ ] Social copy ready (LinkedIn, Twitter/X)
- [ ] Reddit posts drafted (r/india, r/IndiaInvestments, r/LegalAdviceIndia, r/CAstudents)
- [ ] WhatsApp message for CA firm groups drafted

#### Operations
- [ ] Support documentation published
- [ ] Support team trained (if applicable)
- [ ] Incident response playbook ready
- [ ] Communication templates prepared
- [ ] Customer feedback process defined

---

## 8. Appendix

### User Research Session Notes

**Session 1**: Ramesh, hardware store owner, Mumbai
- "I filed cement at 28% for 6 months. Lost ₹45,000."
- "My CA charges ₹500 per rate verification. Too expensive."
- "I spend 2 hours every month searching GST notifications."
- "I need a simple tool. I don't understand HSN codes."

**Session 2**: Priya, CA firm partner, Delhi
- "I handle 50+ clients. Rate verification takes too long."
- "I need official references to defend rates if questioned."
- "Mobile access would be great. I'm often at client locations."
- "Hindi support would help many of my clients."

**Session 3**: Amit, online business owner, Bangalore
- "I do everything on my phone. Need mobile-friendly tool."
- "I file quarterly. Often forget rate changes."
- "I'd pay ₹500/month for unlimited access."
- "Quick results are important. I'm always in a hurry."

### Competitive Analysis

**GST Portal (official)**:
- Pros: Official source, comprehensive data
- Cons: Complex interface, requires HSN code, no Hindi support

**ClearTax**:
- Pros: Comprehensive GST solution, trusted brand
- Cons: Expensive (₹999/month), enterprise-focused, complex

**Other rate checker tools**:
- Pros: Simple interface
- Cons: Poor UX, no Hindi support, account required, outdated data

### Design Mocks

**Landing Page**:
- Hero section with "Sahi GST rate. Seedha jawab." headline
- Problem strip with scrolling marquee
- How it works (3 steps)
- What changed (rate comparison preview)
- For CA firms (B2B upsell)
- Pricing (Free vs Pro)
- Footer with minimal info

**Check Page**:
- Full-width search box with language toggle
- Result card with old/new rate comparison
- Notification reference badge
- Usage counter (free tier)
- Upgrade modal (at limit)

### Analytics Dashboard

**Metrics to Track**:
- Daily active users
- Lookup volume (total, by tier)
- Free-to-paid conversion rate
- Error rate (by endpoint)
- API response time (p50, p95, p99)
- Page load time (by device type)
- User satisfaction (CSAT, NPS)
- Revenue (MRR, churn)

**Alert Thresholds**:
- Error rate > 1%: Warning
- Error rate > 5%: Critical
- API response time p95 > 500ms: Warning
- API response time p95 > 1s: Critical
- Page load time > 5s: Warning
- Page load time > 10s: Critical

### Relevant Support Tickets

**Competitor Support Analysis** (Reddit, Quora):
- "How do I find the new rate for cement under GST 2.0?"
- "Is there a simple tool to check GST rates without HSN codes?"
- "GST 2.0 rate confusion — help needed for small business"
- "Where can I find official notification references for rate changes?"

**Themes Identified**:
- Complexity of existing tools
- Need for Hindi language support
- Desire for old vs new rate comparison
- Importance of official references
- Mobile access requirements

---

**PRD Status**: Draft - Ready for Architecture Review Phase
**Next Step**: Backend Architect reviews backend architecture
**Approval Required**: All stakeholders before development start

---

*Sahi rate. Seedha jawab. Sirf SaralGST.*