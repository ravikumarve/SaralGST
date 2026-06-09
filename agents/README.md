# SaralGST Agent Directory

> **Status**: Complete | **Created**: April 30, 2026 | **Total Agents**: 15

---

## 📋 Agent Overview

This directory contains all the agents needed for the SaralGST project implementation. Agents are organized by their primary function and aligned with project phases.

---

## 🎯 Core Agents (9)

These agents are essential for the SaralGST project and are actively involved in multiple phases.

### 1. Product Manager
**File**: `product-manager.md`
**Role**: PRD creation, stakeholder alignment, success metrics
**Phases**: Phase 0 (PRD Review), All phases (stakeholder management)
**Key Responsibilities**:
- Create comprehensive PRD
- Validate problem statement and user evidence
- Define success metrics and KPIs
- Approve user stories and acceptance criteria
- Manage stakeholder communication

### 2. Backend Architect
**File**: `engineering-backend-architect.md`
**Role**: Backend architecture, technical decisions, security design
**Phases**: Phase 1 (Architecture Review), Phase 3 (Backend Development)
**Key Responsibilities**:
- Design FastAPI application structure
- Define service layer architecture
- Make technical decisions (JSON vs Database, Gemini vs GPT-4)
- Create threat model (STRIDE analysis)
- Review backend code and architecture

### 3. Frontend Developer
**File**: `engineering-frontend-developer.md`
**Role**: Frontend architecture, design system, performance optimization
**Phases**: Phase 1 (Architecture Review), Phase 4 (Frontend Development)
**Key Responsibilities**:
- Design Next.js 14 App Router structure
- Define component hierarchy and design system
- Implement Lusion-inspired design system
- Optimize performance (Core Web Vitals)
- Ensure accessibility (WCAG 2.1 AA compliance)

### 4. Security Engineer
**File**: `engineering-security-engineer.md`
**Role**: Security architecture, threat modeling, vulnerability assessment
**Phases**: Phase 1 (Architecture Review), All phases (security oversight)
**Key Responsibilities**:
- Perform threat modeling (STRIDE analysis)
- Review OWASP Top 10 vulnerabilities
- Define security requirements and controls
- Review code for security issues
- Create incident response playbook

### 5. API Tester
**File**: `testing-api-tester.md`
**Role**: API testing strategy, test automation, quality assurance
**Phases**: Phase 1 (Testing Strategy), Phase 5 (Integration & Testing)
**Key Responsibilities**:
- Define API testing strategy
- Create automated test suite (95%+ coverage target)
- Test API functionality, security, and performance
- Integrate tests into CI/CD pipeline
- Validate API contracts and documentation

### 6. Performance Benchmarker
**File**: `testing-performance-benchmarker.md`
**Role**: Performance testing, optimization, SLA compliance
**Phases**: Phase 1 (Testing Strategy), Phase 5 (Integration & Testing)
**Key Responsibilities**:
- Define performance testing strategy
- Conduct load testing and stress testing
- Validate performance SLAs (API < 200ms, page load < 3s)
- Optimize bundle size and mobile performance
- Monitor Core Web Vitals

### 7. DevOps Automator
**File**: `engineering-devops-automator.md`
**Role**: CI/CD pipeline, deployment strategy, monitoring setup
**Phases**: Phase 1 (DevOps Strategy), Phase 7 (Launch Preparation)
**Key Responsibilities**:
- Design CI/CD pipeline (GitHub Actions)
- Define deployment strategy (Render + Vercel)
- Set up monitoring and alerting
- Configure security scanning in CI/CD
- Create deployment runbooks

### 8. Code Reviewer
**File**: `engineering-code-reviewer.md`
**Role**: Code quality, best practices, security review
**Phases**: Phase 3-5 (Development phases)
**Key Responsibilities**:
- Review code for correctness and maintainability
- Identify security vulnerabilities
- Suggest performance optimizations
- Ensure best practices are followed
- Provide constructive feedback

### 9. Project Shepherd
**File**: `project-management-project-shepherd.md`
**Role**: Project coordination, timeline management, stakeholder communication
**Phases**: All phases (project oversight)
**Key Responsibilities**:
- Coordinate cross-functional work
- Manage project timeline and milestones
- Facilitate stakeholder communication
- Track progress and risks
- Ensure quality gates are met

---

## 🤝 Supporting Agents (6)

These agents provide specialized support for specific aspects of the project.

### 10. Data Engineer (Data Curator)
**File**: `engineering-data-engineer.md`
**Role**: GST rate data curation, validation, maintenance
**Phases**: Phase 3 (Backend Development), Phase 6 (Quality Assurance)
**Key Responsibilities**:
- Curate GST rate data (200+ items target)
- Validate data against official GST portal
- Create data validation scripts
- Maintain data accuracy and updates
- Ensure data quality and completeness

### 11. Accessibility Auditor
**File**: `testing-accessibility-auditor.md`
**Role**: Accessibility testing, WCAG compliance, inclusive design
**Phases**: Phase 1 (Architecture Review), Phase 6 (Quality Assurance)
**Key Responsibilities**:
- Validate WCAG 2.1 AA compliance
- Test with screen readers (VoiceOver, NVDA)
- Ensure keyboard navigation
- Validate color contrast and visual accessibility
- Provide accessibility recommendations

### 12. Test Results Analyzer
**File**: `testing-test-results-analyzer.md`
**Role**: Test results analysis, quality metrics, trend analysis
**Phases**: Phase 5-6 (Testing & QA phases)
**Key Responsibilities**:
- Analyze test results and trends
- Identify quality issues and patterns
- Generate quality metrics and reports
- Track test coverage and effectiveness
- Provide insights for improvement

### 13. Growth Hacker
**File**: `marketing-growth-hacker.md`
**Role**: Growth strategy, launch optimization, user acquisition
**Phases**: Phase 7 (Launch Preparation), Phase 8 (Launch & Monitoring)
**Key Responsibilities**:
- Define growth strategy and tactics
- Optimize launch for maximum impact
- Design user acquisition funnels
- Analyze growth metrics and experiments
- Iterate on growth strategies

### 14. Reddit Community Builder
**File**: `marketing-reddit-community-builder.md`
**Role**: Reddit engagement, community building, content distribution
**Phases**: Phase 7 (Launch Preparation), Phase 8 (Launch & Monitoring)
**Key Responsibilities**:
- Create Reddit posts for r/india, r/IndiaInvestments, r/LegalAdviceIndia, r/CAstudents
- Engage with Reddit communities
- Build community around SaralGST
- Monitor Reddit feedback and engagement
- Adapt content based on community response

### 15. Content Creator
**File**: `marketing-content-creator.md`
**Role**: Content creation, marketing materials, launch assets
**Phases**: Phase 7 (Launch Preparation), Phase 8 (Launch & Monitoring)
**Key Responsibilities**:
- Create blog posts and articles
- Write social media content
- Develop marketing copy
- Create help center documentation
- Produce launch announcement materials

---

## 🔄 Agent Phase Alignment

### Phase 0: PRD Review (Week 1)
**Active Agents**:
- Product Manager (Lead)
- Project Shepherd (Coordination)

**Deliverables**: Approved PRD with stakeholder sign-off

---

### Phase 1: Architecture Review (Week 2)
**Active Agents**:
- Backend Architect (Backend architecture)
- Frontend Developer (Frontend architecture)
- Security Engineer (Security architecture)
- API Tester (Testing strategy)
- Performance Benchmarker (Performance strategy)
- DevOps Automator (DevOps strategy)
- Accessibility Auditor (Accessibility requirements)
- Project Shepherd (Coordination)

**Deliverables**: All architecture documents, Architecture Review Report

---

### Phase 2: Architecture Approval Gate (Week 2 End)
**Active Agents**:
- All agents (Review and approval)
- Project Shepherd (Coordination)

**Deliverables**: Go/No-Go recommendation for development

---

### Phase 3: Backend Development (Week 3)
**Active Agents**:
- Backend Architect (Lead)
- Code Reviewer (Code review)
- Security Engineer (Security review)
- Data Engineer (Data curation)
- API Tester (Test development)
- Project Shepherd (Coordination)

**Deliverables**: Working backend API, unit tests, code review

---

### Phase 4: Frontend Development (Week 4)
**Active Agents**:
- Frontend Developer (Lead)
- Code Reviewer (Code review)
- Accessibility Auditor (Accessibility review)
- Performance Benchmarker (Performance review)
- Project Shepherd (Coordination)

**Deliverables**: Working frontend app, unit tests, code review

---

### Phase 5: Integration & Testing (Week 5)
**Active Agents**:
- API Tester (API testing)
- Performance Benchmarker (Performance testing)
- Security Engineer (Security testing)
- Test Results Analyzer (Results analysis)
- Code Reviewer (Code review)
- Project Shepherd (Coordination)

**Deliverables**: Comprehensive test suite, test reports

---

### Phase 6: Quality Assurance (Week 6)
**Active Agents**:
- API Tester (Functional testing)
- Performance Benchmarker (Performance testing)
- Security Engineer (Security testing)
- Accessibility Auditor (Accessibility testing)
- Test Results Analyzer (Quality metrics)
- Project Shepherd (Coordination)

**Deliverables**: QA reports, Go/No-Go recommendation

---

### Phase 7: Launch Preparation (Week 7)
**Active Agents**:
- DevOps Automator (Deployment setup)
- Growth Hacker (Launch strategy)
- Reddit Community Builder (Reddit posts)
- Content Creator (Marketing materials)
- Project Shepherd (Coordination)

**Deliverables**: Launch checklist, monitoring setup, marketing assets

---

### Phase 8: Launch & Monitoring (Week 8+)
**Active Agents**:
- All agents (Launch support)
- Project Shepherd (Coordination)
- Growth Hacker (Growth optimization)
- Reddit Community Builder (Community engagement)
- Content Creator (Content updates)

**Deliverables**: Successful launch, metrics tracking, optimization

---

## 📊 Agent Utilization Summary

| Agent | Total Phases | Primary Phases | Supporting Phases |
|-------|--------------|----------------|-------------------|
| Product Manager | 2 | Phase 0 | All phases |
| Backend Architect | 2 | Phase 1, 3 | - |
| Frontend Developer | 2 | Phase 1, 4 | - |
| Security Engineer | 4 | Phase 1, 5, 6 | All phases |
| API Tester | 2 | Phase 1, 5 | - |
| Performance Benchmarker | 2 | Phase 1, 5 | - |
| DevOps Automator | 2 | Phase 1, 7 | - |
| Code Reviewer | 3 | Phase 3, 4, 5 | - |
| Project Shepherd | 8 | All phases | - |
| Data Engineer | 2 | Phase 3, 6 | - |
| Accessibility Auditor | 2 | Phase 1, 6 | - |
| Test Results Analyzer | 2 | Phase 5, 6 | - |
| Growth Hacker | 2 | Phase 7, 8 | - |
| Reddit Community Builder | 2 | Phase 7, 8 | - |
| Content Creator | 2 | Phase 7, 8 | - |

---

## 🚀 How to Use These Agents

### For Project Shepherd
1. Review this directory to understand all available agents
2. Assign agents to appropriate phases
3. Coordinate agent activities and deliverables
4. Track progress and manage dependencies
5. Ensure quality gates are met

### For Individual Agents
1. Read your agent file to understand your role
2. Review PRD.md and IMPLEMENTATION_PLAN.md
3. Understand your phase responsibilities
4. Complete your deliverables on time
5. Coordinate with other agents as needed

### For invoking Agents
Use the following format to invoke an agent:

```bash
# Example: Invoke Product Manager for PRD review
"You are working on SaralGST. Read PRD.md. Your role is Product Manager. Review the PRD and provide your approval or feedback."

# Example: Invoke Backend Architect for architecture review
"You are working on SaralGST. Read PRD.md and IMPLEMENTATION_PLAN.md. Your role is Backend Architect. Review the backend architecture requirements and create a comprehensive backend architecture document."

# Example: Invoke Security Engineer for threat modeling
"You are working on SaralGST. Read PRD.md. Your role is Security Engineer. Perform threat modeling using STRIDE analysis and create a security architecture document."
```

---

## 📝 Agent File Naming Convention

All agent files follow this naming convention:
- `{category}-{agent-name}.md`

**Categories**:
- `engineering` - Technical implementation agents
- `testing` - Quality assurance and testing agents
- `product` - Product management agents
- `project-management` - Project coordination agents
- `marketing` - Marketing and growth agents

---

## 🎯 Success Metrics by Agent

### Product Manager
- PRD approved by all stakeholders
- Success metrics defined and measurable
- User stories validated with acceptance criteria

### Backend Architect
- Backend architecture document completed
- Technical decisions documented with trade-offs
- Threat model created (STRIDE analysis)

### Frontend Developer
- Frontend architecture document completed
- Design system defined and implemented
- Performance optimization strategy defined

### Security Engineer
- Security architecture document completed
- Threat model created (STRIDE analysis)
- Security requirements defined

### API Tester
- Test strategy document completed
- Test automation framework designed
- Quality gates defined

### Performance Benchmarker
- Performance testing plan completed
- Performance benchmarks defined
- SLA requirements specified

### DevOps Automator
- DevOps strategy document completed
- CI/CD pipeline designed
- Monitoring and alerting defined

### Code Reviewer
- Code review documentation completed
- Best practices defined
- Security review sign-off

### Project Shepherd
- Project status reports completed
- Timeline maintained
- Stakeholders aligned

### Data Engineer
- GST rate data curated (200+ items)
- Data validation scripts created
- Data quality maintained

### Accessibility Auditor
- Accessibility requirements defined
- WCAG 2.1 AA compliance validated
- Accessibility testing completed

### Test Results Analyzer
- Test results analyzed
- Quality metrics generated
- Insights provided

### Growth Hacker
- Growth strategy defined
- Launch optimization plan created
- User acquisition funnels designed

### Reddit Community Builder
- Reddit posts created
- Community engagement strategy defined
- Reddit feedback monitored

### Content Creator
- Marketing materials created
- Blog posts written
- Help center documentation published

---

## 📞 Agent Communication

### Primary Communication
- Async via documentation (PRD.md, IMPLEMENTATION_PLAN.md)
- Agent-specific deliverables in respective phases
- Project status updates via Project Shepherd

### Secondary Communication
- Weekly sync meetings as needed
- Architecture review meetings
- Go/No-Go decision meetings
- Launch coordination meetings

### Escalation Channel
- Project Shepherd for blockers and issues
- Product Manager for stakeholder decisions
- Individual agents for domain-specific issues

---

## 🏆 Agent Success Criteria

### Overall Project Success
- All agents complete their deliverables on time
- All quality gates are met
- All architecture reviews are approved
- All tests pass with required coverage
- Launch is successful with no critical issues

### Individual Agent Success
Each agent is successful when:
- Their deliverables are completed on time
- Their work meets quality standards
- Their contributions enable project success
- Their documentation is clear and actionable
- Their coordination with other agents is effective

---

## 🎉 Agent Directory Status

**Total Agents**: 15
**Core Agents**: 9
**Supporting Agents**: 6
**Status**: ✅ Complete and Ready for Use

**Next Step**: Begin Phase 0 - PRD Review with Product Manager

---

**Document Owner**: Project Shepherd
**Last Updated**: April 30, 2026
**Next Review**: May 7, 2026

---

*Sahi rate. Seedha jawab. Sirf SaralGST.*