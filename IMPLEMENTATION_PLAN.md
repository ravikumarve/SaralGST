# SaralGST Implementation Plan

> **Status**: Planning Phase | **Created**: April 30, 2026 | **Version**: 1.0

---

## 📋 Executive Summary

SaralGST is a vertical SaaS product for Indian small businesses to verify correct GST rates after GST 2.0 reforms. This implementation plan follows a **PRD-first, architecture-review-second, code-third** approach to ensure we build the right product with the right foundation.

**Core Philosophy**: No code is written until:
1. ✅ PRD is approved by Product Manager
2. ✅ Backend architecture is reviewed by Backend Architect
3. ✅ Frontend architecture is reviewed by Frontend Developer
4. ✅ Security architecture is reviewed by Security Engineer
5. ✅ Testing strategy is defined by API Tester & Performance Benchmarker
6. ✅ DevOps strategy is defined by DevOps Automator

---

## 🎯 Phase 0: PRD Creation & Review (Week 1)

### Agent: Product Manager (@product-manager)

**Deliverables**:
1. **Comprehensive PRD** covering:
   - Problem statement with user evidence
   - Success metrics and KPIs
   - User personas and stories
   - Non-goals and scope boundaries
   - Technical considerations
   - Launch plan with success gates

2. **Opportunity Assessment**:
   - Market analysis and competitive landscape
   - RICE prioritization score
   - Business case with revenue projections
   - Risk assessment and mitigation strategies

3. **Go-to-Market Brief**:
   - Target audience segmentation
   - Value proposition by audience
   - Launch checklist across all teams
   - Success criteria and rollback plan

**Review Process**:
- PRD draft → Internal review → Stakeholder sign-off → Architecture phase

**Success Criteria**:
- All stakeholders understand what we're building and why
- Clear success metrics defined and measurable
- Scope boundaries explicitly documented
- No open questions blocking development

---

## 🏗️ Phase 1: Architecture Review (Week 2)

### 1.1 Backend Architecture Review

**Agent**: Backend Architect (@engineering-backend-architect)

**Review Areas**:
- **System Architecture**:
  - FastAPI application structure
  - Service layer design (interpreter, rate_engine, lookup_router)
  - Data layer design (JSON file structure, caching strategy)
  - API design and contract specifications

- **Technical Decisions**:
  - JSON vs Database for rate table (validate JSON approach)
  - Gemini Flash integration and fallback strategy
  - Rate limiting implementation (slowapi vs custom)
  - HMAC token validation approach

- **Scalability Considerations**:
  - Render free tier limitations
  - JSON file size and memory footprint
  - Gemini API rate limits and cost projections
  - Concurrent request handling

- **Security Architecture**:
  - Input validation strategy
  - API authentication and authorization
  - Secrets management approach
  - Error handling and information disclosure

**Deliverables**:
- Backend architecture document with diagrams
- Technical decision log with trade-offs
- Security threat model (STRIDE analysis)
- Performance requirements and SLA definitions
- Risk assessment with mitigation strategies

---

### 1.2 Frontend Architecture Review

**Agent**: Frontend Developer (@engineering-frontend-developer)

**Review Areas**:
- **Application Architecture**:
  - Next.js 14 App Router structure
  - Component hierarchy and design system
  - State management approach (localStorage vs Context API)
  - API client design and error handling

- **Performance Architecture**:
  - Bundle optimization strategy
  - Code splitting and lazy loading
  - Image optimization and asset delivery
  - Core Web Vitals targets (LCP < 2.5s, FID < 100ms, CLS < 0.1)

- **Design System Implementation**:
  - Lusion-inspired design system (colors, typography, effects)
  - Responsive design strategy (mobile-first, 375px minimum)
  - Accessibility implementation (WCAG 2.1 AA compliance)
  - GSAP animation performance optimization

- **Integration Architecture**:
  - Razorpay integration approach
  - Backend API communication patterns
  - Error handling and user feedback systems
  - Offline capability considerations

**Deliverables**:
- Frontend architecture document with component diagrams
- Design system specification with tokens
- Performance optimization strategy
- Accessibility compliance plan
- Integration architecture document

---

### 1.3 Security Architecture Review

**Agent**: Security Engineer (@engineering-security-engineer)

**Review Areas**:
- **Application Security**:
  - OWASP Top 10 vulnerability assessment
  - Input validation and output encoding strategy
  - Authentication and authorization design
  - Session management and token security

- **API Security**:
  - Rate limiting and abuse prevention
  - API authentication (HMAC token validation)
  - Input sanitization and SQL injection prevention
  - Error handling and information disclosure

- **Data Security**:
  - Secrets management approach
  - Data encryption at rest and in transit
  - PII handling and privacy considerations
  - Audit logging and monitoring

- **Infrastructure Security**:
  - Render deployment security
  - Vercel deployment security
  - CORS configuration
  - Security headers and CSP implementation

**Deliverables**:
- Threat model document (STRIDE analysis)
- Security requirements and controls
- Secure coding guidelines
- Security testing strategy
- Incident response playbook

---

### 1.4 Testing Strategy Review

**Agents**: API Tester (@testing-api-tester) + Performance Benchmarker (@testing-performance-benchmarker)

**Review Areas**:
- **API Testing Strategy**:
  - Functional test coverage (95%+ target)
  - Security testing (OWASP API Security Top 10)
  - Performance testing (load, stress, scalability)
  - Integration testing (third-party dependencies)

- **Frontend Testing Strategy**:
  - Unit testing approach and coverage targets
  - Integration testing for critical user flows
  - E2E testing for happy paths
  - Accessibility testing (WCAG 2.1 AA)

- **Performance Testing Strategy**:
  - Load testing scenarios and thresholds
  - Performance benchmarking (API < 200ms, page load < 3s)
  - Mobile performance testing (3G network simulation)
  - Lighthouse score targets (≥ 85 on mobile)

- **Quality Gates**:
  - Pre-commit checks
  - CI/CD pipeline quality gates
  - Pre-release testing requirements
  - Production monitoring and alerting

**Deliverables**:
- Comprehensive test strategy document
- Test automation framework design
- Performance testing plan with SLA definitions
- Quality gate definitions and thresholds
- CI/CD integration strategy

---

### 1.5 DevOps Strategy Review

**Agent**: DevOps Automator (@engineering-devops-automator)

**Review Areas**:
- **Deployment Strategy**:
  - Backend deployment to Render (free tier)
  - Frontend deployment to Vercel
  - Environment configuration management
  - Database migration strategy (if needed)

- **CI/CD Pipeline**:
  - GitHub Actions workflow design
  - Automated testing integration
  - Security scanning integration (SAST, DAST, SCA)
  - Deployment automation and rollback procedures

- **Monitoring and Observability**:
  - Application monitoring strategy
  - Error tracking and alerting
  - Performance monitoring (APM)
  - Log aggregation and analysis

- **Infrastructure as Code**:
  - Configuration management approach
  - Secrets management in CI/CD
  - Backup and disaster recovery strategy
  - Cost optimization for free tiers

**Deliverables**:
- CI/CD pipeline configuration
- Deployment runbooks and procedures
- Monitoring and alerting setup
- Infrastructure documentation
- Cost optimization strategy

---

## 🔄 Phase 2: Architecture Approval Gate (Week 2 End)

### Approval Process

**Participants**:
- Product Manager (PRD owner)
- Backend Architect (backend review owner)
- Frontend Developer (frontend review owner)
- Security Engineer (security review owner)
- API Tester (testing strategy owner)
- Performance Benchmarker (performance strategy owner)
- DevOps Automator (DevOps strategy owner)
- Project Shepherd (coordination)

**Approval Criteria**:
- ✅ PRD approved by all stakeholders
- ✅ Backend architecture reviewed and signed off
- ✅ Frontend architecture reviewed and signed off
- ✅ Security architecture reviewed and signed off
- ✅ Testing strategy defined and approved
- ✅ DevOps strategy defined and approved
- ✅ All risks documented with mitigation plans
- ✅ All open questions resolved

**Deliverable**:
- **Architecture Review Report** with:
  - Summary of all architecture reviews
  - Approved technical decisions
  - Risk register with mitigation strategies
  - Go/No-Go recommendation for development phase

---

## 🚀 Phase 3: Development Execution (Weeks 3-5)

### Development Phases

#### Week 3: Backend Foundation
**Agents**: Backend Architect + Code Reviewer

**Tasks**:
1. Backend scaffolding (FastAPI setup, project structure)
2. Rate engine implementation (JSON parsing, HSN lookup)
3. Interpreter service (Gemini Flash integration)
4. Lookup router (API endpoints, rate limiting)
5. Unit tests for backend services
6. Code review and security review

**Deliverables**:
- Working backend API with all endpoints
- Comprehensive unit tests (80%+ coverage)
- Code review documentation
- Security review sign-off

---

#### Week 4: Frontend Implementation
**Agents**: Frontend Developer + Code Reviewer

**Tasks**:
1. Frontend scaffolding (Next.js setup, design system)
2. Landing page implementation (GSAP animations, responsive design)
3. Checker UI implementation (SearchBox, ResultCard, RateComparison)
4. Monetization layer (Razorpay integration, UpgradeModal)
5. Unit tests for frontend components
6. Code review and accessibility review

**Deliverables**:
- Working frontend application
- Comprehensive unit tests (80%+ coverage)
- Code review documentation
- Accessibility review sign-off

---

#### Week 5: Integration & Testing
**Agents**: API Tester + Performance Benchmarker + Code Reviewer

**Tasks**:
1. Integration testing (backend + frontend)
2. API testing (functional, security, performance)
3. Performance testing (load testing, mobile performance)
4. End-to-end testing (critical user flows)
5. Security testing (vulnerability assessment)
6. Bug fixes and optimization

**Deliverables**:
- Comprehensive test suite (95%+ API coverage)
- Performance test report with SLA compliance
- Security test report with vulnerability assessment
- Bug fixes and optimization documentation

---

## 🧪 Phase 4: Quality Assurance (Week 6)

### Testing & Validation

**Agents**: API Tester + Performance Benchmarker + Security Engineer

**Testing Activities**:
1. **Functional Testing**:
   - All user stories acceptance criteria validated
   - Edge cases and error scenarios tested
   - Cross-browser compatibility testing
   - Mobile responsiveness testing

2. **Performance Testing**:
   - Load testing (10x normal traffic)
   - Stress testing (breaking point identification)
   - Mobile performance testing (3G network)
   - Lighthouse score validation (≥ 85 on mobile)

3. **Security Testing**:
   - OWASP Top 10 vulnerability assessment
   - API security testing (authentication, authorization, rate limiting)
   - Penetration testing (if budget allows)
   - Secrets and configuration review

4. **Accessibility Testing**:
   - WCAG 2.1 AA compliance validation
   - Screen reader testing (VoiceOver, NVDA)
   - Keyboard navigation testing
   - Color contrast and visual accessibility

**Deliverables**:
- Comprehensive test report
- Performance benchmark report
- Security assessment report
- Accessibility compliance report
- Go/No-Go recommendation for launch

---

## 🚢 Phase 5: Launch Preparation (Week 7)

### Pre-Launch Activities

**Agent**: Project Shepherd + All Agents

**Launch Checklist**:

#### Backend
- [ ] `/health` endpoint returns 200 on Render
- [ ] Rate limiting working (4th request returns 429)
- [ ] Paid token bypasses rate limit
- [ ] Gemini fallback works when API key invalid
- [ ] HSN not found returns 404 with Hinglish message
- [ ] All 16 tests passing
- [ ] CORS configured for saralgst.in
- [ ] Environment variables set on Render

#### Frontend
- [ ] GSAP hero animation plays on load (Chrome + Firefox + Safari)
- [ ] Marquee strip scrolls smoothly on mobile
- [ ] SearchBox submits on Enter key
- [ ] ResultCard shows correct old/new rate colors
- [ ] Notification reference renders correctly
- [ ] UsageCounter increments and persists
- [ ] UpgradeModal opens at 3/3 limit
- [ ] Razorpay test payment completes
- [ ] Paid tier sends X-Session-Token header
- [ ] Mobile usable on 375px width
- [ ] Lighthouse score ≥ 85 on mobile
- [ ] Hindi text renders correctly

#### Data
- [ ] `gst_rates.json` has ≥ 200 items
- [ ] `validate_rates.py` passes with 0 errors
- [ ] At least 20 `rate_changed: true` items
- [ ] All GST 2.0 priority items present

#### Launch
- [ ] `saralgst.in` DNS pointing to Vercel
- [ ] SSL certificate active
- [ ] Google Search Console submitted
- [ ] Reddit posts drafted (r/india, r/IndiaInvestments, r/LegalAdviceIndia, r/CAstudents)
- [ ] WhatsApp message for CA firm groups drafted
- [ ] Razorpay live mode keys configured

**Deliverables**:
- Launch readiness report
- Rollback procedures documented
- Monitoring and alerting configured
- Support documentation published
- Go/No-Go launch decision

---

## 📊 Phase 6: Launch & Monitoring (Week 8+)

### Launch Activities

**Agent**: Project Shepherd + All Agents

**Launch Week**:
1. **Day 1**: Soft launch to internal users
2. **Day 2-3**: Beta launch to 50 design partners
3. **Day 4-5**: Monitor metrics, fix critical issues
4. **Day 6-7**: GA launch to 20% → 100% over 2 weeks

**Monitoring**:
- Error rates and performance metrics
- User engagement and conversion metrics
- Support ticket volume and themes
- Revenue and subscription metrics
- Security events and anomalies

**Post-Launch**:
- Daily standups for first week
- Weekly retrospectives for first month
- Monthly business reviews
- Continuous optimization based on metrics

---

## 🎯 Success Metrics

### Product Metrics
- **Activation Rate**: 65% of users complete first lookup within 60 days
- **Retention Rate**: 68% 30-day return rate
- **Conversion Rate**: 5% free-to-paid conversion
- **Support Load**: <40 tickets/week on rate lookup topics

### Technical Metrics
- **API Performance**: 95th percentile < 200ms
- **Page Load Time**: < 3 seconds on 3G mobile
- **Lighthouse Score**: ≥ 85 on mobile
- **Test Coverage**: 95%+ API coverage, 80%+ frontend coverage
- **Uptime**: 99.9% availability

### Business Metrics
- **Revenue**: ₹13,980 MRR by end of Month 1
- **Customer Acquisition**: 20 individual + 2 CA firm customers by Month 1
- **Customer Satisfaction**: CSAT ≥ 4/5
- **NPS**: +5 points delta for feature users

---

## 🚨 Risk Management

### High-Risk Items

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| Gemini API rate limits | Medium | High | Implement fallback to description search, cache results | Backend Architect |
| Render free tier limitations | High | Medium | Monitor usage closely, have upgrade plan ready | DevOps Automator |
| Razorpay integration issues | Low | High | Test thoroughly in sandbox, have manual fallback | Frontend Developer |
| GST rate data accuracy | Medium | High | Validate against official GST portal, regular updates | Data Curator |
| Mobile performance issues | Medium | Medium | Performance testing on 3G, optimize bundle size | Performance Benchmarker |

### Contingency Plans

**If Gemini API fails**:
- Fallback to substring search on descriptions
- Display "AI unavailable, showing best matches" message
- Log failures for investigation and improvement

**If Render free tier is insufficient**:
- Upgrade to paid Render tier ($7/month)
- Optimize JSON file size and memory usage
- Implement response caching

**If Razorpay integration fails**:
- Manual payment processing via UPI
- Delay paid tier launch until integration fixed
- Communicate transparently with users

---

## 📅 Timeline Summary

| Week | Phase | Key Deliverables |
|------|-------|-----------------|
| 1 | PRD Creation | Comprehensive PRD, Opportunity Assessment, GTM Brief |
| 2 | Architecture Review | All architecture documents, Architecture Review Report |
| 3 | Backend Foundation | Working backend API, unit tests, code review |
| 4 | Frontend Implementation | Working frontend app, unit tests, code review |
| 5 | Integration & Testing | Integrated app, comprehensive test suite |
| 6 | Quality Assurance | Test reports, Go/No-Go recommendation |
| 7 | Launch Preparation | Launch checklist, monitoring setup |
| 8 | Launch & Monitoring | Successful launch, metrics tracking |

---

## 🤝 Agent Responsibilities Summary

### Core Agents
- **Product Manager**: PRD creation, stakeholder alignment, success metrics
- **Backend Architect**: Backend architecture, technical decisions, security design
- **Frontend Developer**: Frontend architecture, design system, performance optimization
- **Security Engineer**: Security architecture, threat modeling, vulnerability assessment
- **API Tester**: API testing strategy, test automation, quality assurance
- **Performance Benchmarker**: Performance testing, optimization, SLA compliance
- **DevOps Automator**: CI/CD pipeline, deployment strategy, monitoring setup
- **Code Reviewer**: Code quality, best practices, security review
- **Project Shepherd**: Project coordination, timeline management, stakeholder communication

### Supporting Agents
- **Data Curator**: GST rate data curation, validation, maintenance
- **Test Suite**: Automated test development, test coverage, CI/CD integration
- **Launch Checklist**: Pre-launch verification, launch coordination, post-launch monitoring

---

## 📝 Next Steps

1. **Immediate**: Product Manager creates comprehensive PRD
2. **Week 1**: PRD review and approval by all stakeholders
3. **Week 2**: Architecture reviews by all technical agents
4. **Week 2 End**: Architecture approval gate
5. **Week 3-5**: Development execution with continuous code review
6. **Week 6**: Quality assurance and testing
7. **Week 7**: Launch preparation and readiness verification
8. **Week 8**: Launch and monitoring

---

**Document Owner**: Project Shepherd
**Last Updated**: April 30, 2026
**Next Review**: May 7, 2026

---

*Sahi rate. Seedha jawab. Sirf SaralGST.*