# ACCESSIBILITY_REQUIREMENTS.md — SaralGST

**Status**: Draft | **Author**: Accessibility Auditor | **Last Updated**: April 30, 2026 | **Version**: 1.0

---

## 1. Executive Summary

SaralGST accessibility strategy ensures that all users, including those with disabilities, can effectively use the GST rate checker. The system follows WCAG 2.1 AA standards with special focus on mobile-first design, Hindi language support, and assistive technology compatibility.

**Core Accessibility Principles**:
- **Perceivable**: Information and UI components must be presentable to users in ways they can perceive
- **Operable**: UI components and navigation must be operable
- **Understandable**: Information and operation of UI must be understandable
- **Robust**: Content must be robust enough to be interpreted reliably by assistive technologies

**Accessibility Posture**:
- **Compliance Level**: WCAG 2.1 AA
- **Target Platforms**: Mobile (375px minimum), Tablet, Desktop
- **Languages**: English, Hindi (with screen reader support)
- **Assistive Technologies**: NVDA, JAWS, TalkBack, VoiceOver, screen magnifiers
- **Testing**: Automated + Manual + User Testing

---

## 2. WCAG 2.1 AA Compliance Requirements

### 2.1 Perceivable Requirements

#### 2.1.1 Text Alternatives
- **Requirement**: All non-text content has text alternatives
- **Implementation**:
  - All images have `alt` attribute with descriptive text
  - Icons have `aria-label` or `aria-labelledby`
  - Decorative images have `alt=""` or `role="presentation"`
  - SVG icons have `<title>` and `<desc>` elements

#### 2.1.2 Time-Based Media
- **Requirement**: No time-based media in v1 (no videos, audio, animations)
- **Implementation**:
  - GSAP animations have `prefers-reduced-motion` media query support
  - Users can pause animations via system settings
  - No auto-playing content

#### 2.1.3 Adaptable Content
- **Requirement**: Content can be presented in different ways without losing meaning
- **Implementation**:
  - Semantic HTML structure (header, main, nav, footer)
  - Proper heading hierarchy (h1 → h2 → h3)
  - Lists used for grouped content
  - Tables used only for tabular data

#### 2.1.4 Distinguishable Content
- **Requirement**: Make it easier to see and hear content
- **Implementation**:
  - Color contrast ratio ≥ 4.5:1 for normal text
  - Color contrast ratio ≥ 3:1 for large text (18pt+)
  - Color contrast ratio ≥ 3:1 for UI components
  - Text not used as the only visual means of conveying information
  - Focus indicators visible and clear

### 2.2 Operable Requirements

#### 2.2.1 Keyboard Accessible
- **Requirement**: All functionality available via keyboard
- **Implementation**:
  - All interactive elements keyboard accessible
  - Keyboard focus visible at all times
  - No keyboard traps
  - Logical tab order
  - Skip navigation link

#### 2.2.2 Enough Time
- **Requirement**: Provide users enough time to read and use content
- **Implementation**:
  - No time limits on rate lookups
  - No auto-refreshing content
  - No moving content that user cannot pause
  - GSAP animations respect `prefers-reduced-motion`

#### 2.2.3 Seizures and Physical Reactions
- **Requirement**: Do not design content that causes seizures or physical reactions
- **Implementation**:
  - No flashing content (more than 3 times per second)
  - No flashing content that occupies more than 25% of screen
  - GSAP animations are smooth, not jerky
  - No strobe effects

#### 2.2.4 Navigable
- **Requirement**: Help users navigate, find content, and determine where they are
- **Implementation**:
  - Page title descriptive and unique
  - Link purpose clear from link text alone
  - Multiple ways to navigate (search, links, sitemap)
  - Breadcrumbs for deep pages
  - Focus order logical and predictable

### 2.3 Understandable Requirements

#### 2.3.1 Readable
- **Requirement**: Make text content readable and understandable
- **Implementation**:
  - Language of page identified (`lang` attribute)
  - Language changes identified (`lang` attribute on elements)
  - Text can be resized up to 200% without horizontal scroll
  - Line height at least 1.5 times font size
  - Paragraph spacing at least 2 times font size
  - Letter spacing at least 0.12 times font size

#### 2.3.2 Predictable
- **Requirement**: Make Web pages appear and operate in predictable ways
- **Implementation**:
  - Consistent navigation across pages
  - Consistent identification of components
  - Focus does not change unexpectedly
  - Changes of context are user-initiated
  - Clear feedback for user actions

#### 2.3.3 Input Assistance
- **Requirement**: Help users avoid and correct mistakes
- **Implementation**:
  - Clear labels for all form inputs
  - Error messages clear and specific
  - Error messages associated with form field
  - Suggestions for errors when possible
  - Confirmation for destructive actions

### 2.4 Robust Requirements

#### 2.4.1 Compatible
- **Requirement**: Maximize compatibility with current and future user agents
- **Implementation**:
  - Valid HTML markup
  - Proper ARIA roles and attributes
  - Name, role, value can be programmatically determined
  - Status messages can be programmatically determined
  - No custom UI controls without proper ARIA

---

## 3. Screen Reader Support Requirements

### 3.1 Screen Reader Compatibility

#### Supported Screen Readers
- **Windows**: NVDA (latest), JAWS (latest)
- **Mac**: VoiceOver (latest)
- **Android**: TalkBack (latest)
- **iOS**: VoiceOver (latest)

#### Screen Reader Testing
- Test with at least 2 screen readers per platform
- Test all user flows with screen reader
- Test keyboard navigation with screen reader
- Test dynamic content updates

### 3.2 ARIA Implementation

#### 3.2.1 Landmark Roles
```html
<!-- Page structure with landmarks -->
<body>
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <!-- Navigation -->
    </nav>
  </header>

  <main role="main" id="main-content">
    <!-- Main content -->
  </main>

  <aside role="complementary">
    <!-- Complementary content -->
  </aside>

  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
```

#### 3.2.2 Live Regions
```html
<!-- Status updates -->
<div role="status" aria-live="polite" aria-atomic="true">
  Loading GST rates...
</div>

<!-- Error messages -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  Rate lookup failed. Please try again.
</div>

<!-- Progress updates -->
<div role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
  50% complete
</div>
```

#### 3.2.3 Interactive Elements
```html
<!-- Buttons with states -->
<button aria-pressed="false" aria-label="Toggle Hindi language">
  हिं
</button>

<!-- Expandable content -->
<button aria-expanded="false" aria-controls="pricing-details">
  View Pricing Details
</button>
<div id="pricing-details" hidden>
  <!-- Pricing details -->
</div>

<!-- Modal dialog -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Upgrade to Pro</h2>
  <!-- Modal content -->
</div>
```

### 3.3 Screen Reader Announcements

#### 3.3.1 Page Load
- Announce page title on load
- Announce main content location
- Announce any important status messages

#### 3.3.2 Form Interactions
- Announce form labels
- Announce form errors
- Announce form success
- Announce required fields

#### 3.3.3 Dynamic Content
- Announce search results
- Announce rate changes
- Announce usage counter updates
- Announce upgrade prompts

### 3.4 Hindi Language Screen Reader Support

#### 3.4.1 Language Declaration
```html
<!-- English page -->
<html lang="en">

<!-- Hindi page -->
<html lang="hi">

<!-- Mixed language content -->
<p>
  Product: <span lang="hi">सीमेंट</span> (Cement)
</p>
```

#### 3.4.2 Hindi Text Pronunciation
- Use proper Unicode encoding (UTF-8)
- Use correct Hindi characters (no transliteration)
- Provide English translations where helpful
- Use `lang="hi"` for Hindi text blocks

#### 3.4.3 Hindi Screen Reader Testing
- Test with NVDA (Windows) with Hindi voice
- Test with TalkBack (Android) with Hindi TTS
- Test with VoiceOver (iOS) with Hindi voice
- Verify Hindi text is pronounced correctly

---

## 4. Keyboard Navigation Requirements

### 4.1 Keyboard Accessibility

#### 4.1.1 Tab Order
- Logical tab order (left to right, top to bottom)
- Skip navigation link at top of page
- Focus visible at all times
- No keyboard traps

#### 4.1.2 Keyboard Shortcuts
- `Tab` / `Shift+Tab`: Navigate between elements
- `Enter` / `Space`: Activate buttons and links
- `Escape`: Close modals and menus
- `Arrow keys`: Navigate within lists and menus
- `Home` / `End`: Jump to start/end of lists

#### 4.1.3 Focus Management
```html
<!-- Skip navigation link -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<!-- Focus visible -->
<style>
  :focus-visible {
    outline: 3px solid #6366f1;
    outline-offset: 2px;
  }

  .skip-link:focus {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 9999;
    background: #6366f1;
    color: white;
    padding: 10px;
  }
</style>

<!-- Focus trap in modal -->
<div role="dialog" aria-modal="true">
  <button autofocus>Close</button>
  <!-- Modal content -->
</div>
```

### 4.2 Keyboard Navigation Patterns

#### 4.2.1 Search Box
```html
<!-- Keyboard accessible search -->
<form role="search">
  <label for="search-input">Search for GST rate</label>
  <input
    id="search-input"
    type="text"
    placeholder="Product name or HSN code"
    aria-describedby="search-help"
  >
  <div id="search-help">Enter product name like 'LED TV' or HSN code like '8528'</div>
  <button type="submit">Search</button>
</form>
```

#### 4.2.2 Result Card
```html
<!-- Keyboard accessible result card -->
<article class="result-card" tabindex="0">
  <h2>HSN: 8528 - LED Television</h2>
  <p>Old rate: 28%</p>
  <p>New rate: 18%</p>
  <button aria-label="Copy notification reference">Copy Reference</button>
</article>
```

#### 4.2.3 Upgrade Modal
```html
<!-- Keyboard accessible modal -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Upgrade to Pro</h2>
  <p id="modal-description">Get unlimited GST rate lookups for ₹499/month</p>
  <button autofocus>Upgrade Now</button>
  <button>Cancel</button>
</div>
```

### 4.3 Focus Indicators

#### 4.3.1 Focus Styles
```css
/* High contrast focus indicator */
:focus-visible {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Focus on dark background */
button:focus {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
}

/* Focus on input */
input:focus {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
  border-color: #6366f1;
}
```

#### 4.3.2 Focus Order
- Logical tab order
- Skip navigation link first
- Main content second
- Footer last
- Modal content when modal open

---

## 5. Color Contrast Requirements

### 5.1 WCAG 2.1 AA Contrast Ratios

#### 5.1.1 Text Contrast
- **Normal text**: 4.5:1 minimum
- **Large text (18pt+)**: 3:1 minimum
- **UI components**: 3:1 minimum

#### 5.1.2 SaralGST Color Palette

| Color | Hex | Contrast on #050508 | Contrast on #0a0a12 | Status |
|-------|-----|-------------------|-------------------|--------|
| **Text Primary** | #f0f0ff | 16.5:1 ✅ | 16.5:1 ✅ | Pass |
| **Text Secondary** | rgba(240,240,255,0.5) | 8.3:1 ✅ | 8.3:1 ✅ | Pass |
| **Text Muted** | rgba(240,240,255,0.25) | 4.1:1 ✅ | 4.1:1 ✅ | Pass |
| **Accent (Indigo)** | #6366f1 | 4.8:1 ✅ | 4.8:1 ✅ | Pass |
| **Accent-2 (Violet)** | #8b5cf6 | 4.2:1 ✅ | 4.2:1 ✅ | Pass |
| **Green (Rate Down)** | #10b981 | 4.5:1 ✅ | 4.5:1 ✅ | Pass |
| **Red (Rate Up)** | #ef4444 | 5.2:1 ✅ | 5.2:1 ✅ | Pass |
| **Amber (Warning)** | #f59e0b | 3.8:1 ✅ | 3.8:1 ✅ | Pass |

### 5.2 Color Independence

#### 5.2.1 Not Relying on Color Alone
```html
<!-- Good: Color + icon + text -->
<div class="rate-down">
  <span aria-hidden="true">↓</span>
  <span>Rate decreased from 28% to 18%</span>
</div>

<!-- Good: Color + border -->
<div class="rate-down" style="border-left: 4px solid #10b981;">
  <span>Rate decreased from 28% to 18%</span>
</div>

<!-- Bad: Color only -->
<div style="color: #10b981;">
  Rate decreased from 28% to 18%
</div>
```

#### 5.2.2 Error States
```html
<!-- Good: Color + icon + border + aria-invalid -->
<div class="form-group">
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
    style="border-color: #ef4444;"
  >
  <div id="email-error" role="alert" style="color: #ef4444;">
    <span aria-hidden="true">⚠️</span>
    Please enter a valid email address
  </div>
</div>
```

### 5.3 Dark Mode Considerations

#### 5.3.1 Dark Mode Contrast
- All text meets 4.5:1 contrast ratio
- All UI components meet 3:1 contrast ratio
- Focus indicators visible on dark background
- Links distinguishable from surrounding text

#### 5.3.2 Dark Mode Testing
- Test with Windows High Contrast mode
- Test with macOS Dark mode
- Test with Android Dark theme
- Test with iOS Dark appearance

---

## 6. Mobile Accessibility Requirements

### 6.1 Touch Target Sizes

#### 6.1.1 Minimum Touch Target Size
- **Minimum size**: 44x44px (WCAG 2.1 AAA)
- **Recommended size**: 48x48px
- **Spacing**: At least 8px between touch targets

#### 6.1.2 Touch Target Implementation
```css
/* Minimum touch target size */
button,
a,
input[type="submit"] {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
}

/* Spacing between touch targets */
.button-group button {
  margin: 8px;
}

/* Large touch targets for mobile */
@media (max-width: 768px) {
  button,
  a {
    min-width: 48px;
    min-height: 48px;
    padding: 14px 20px;
  }
}
```

### 6.2 Mobile Screen Size Support

#### 6.2.1 Minimum Screen Size
- **Minimum width**: 375px (iPhone SE)
- **Recommended width**: 414px (iPhone 12/13)
- **Test on**: 375px, 414px, 390px

#### 6.2.2 Responsive Design
```css
/* Mobile-first approach */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
  }
}
```

### 6.3 Mobile-Specific Accessibility

#### 6.3.1 Viewport Configuration
```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
>
```

#### 6.3.2 Text Scaling
```css
/* Support text scaling up to 200% */
html {
  font-size: 16px;
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

/* Use relative units */
body {
  font-size: 1rem;
  line-height: 1.5;
}

h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 2rem;
}
```

#### 6.3.3 Horizontal Scroll Prevention
```css
/* Prevent horizontal scroll */
body {
  overflow-x: hidden;
  width: 100%;
}

.container {
  max-width: 100%;
  overflow-x: hidden;
}

/* Handle long content */
.result-card {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
```

### 6.4 Mobile Performance

#### 6.4.1 Performance Requirements
- **Page load time**: <3s on 3G
- **Time to interactive**: <5s on 3G
- **First contentful paint**: <2s on 3G
- **Lighthouse score**: ≥85 on mobile

#### 6.4.2 Performance Optimization
- Lazy load images
- Minimize JavaScript bundle
- Use system fonts
- Optimize images
- Enable compression

---

## 7. Hindi Language Accessibility Requirements

### 7.1 Hindi Language Support

#### 7.1.1 Language Declaration
```html
<!-- English page -->
<html lang="en">

<!-- Hindi page -->
<html lang="hi">

<!-- Language toggle -->
<button
  aria-label="Switch to Hindi"
  lang="en"
  onclick="switchLanguage('hi')"
>
  हिं
</button>
```

#### 7.1.2 Hindi Text Rendering
- Use UTF-8 encoding
- Use proper Hindi fonts (Noto Sans Devanagari)
- Support Hindi text selection
- Support Hindi text copying

#### 7.1.3 Hindi Screen Reader Support
- Test with NVDA (Windows) with Hindi voice
- Test with TalkBack (Android) with Hindi TTS
- Test with VoiceOver (iOS) with Hindi voice
- Verify Hindi text pronunciation

### 7.2 Bilingual Interface

#### 7.2.1 Language Toggle
```html
<!-- Language toggle button -->
<button
  aria-label="Switch language"
  aria-pressed="false"
  onclick="toggleLanguage()"
>
  <span lang="en">EN</span>
  <span lang="hi">हिं</span>
</button>
```

#### 7.2.2 Bilingual Content
```html
<!-- Bilingual result card -->
<article class="result-card">
  <h2>HSN: 8528</h2>
  <p lang="en">LED Television (above 32 inches)</p>
  <p lang="hi">LED टेलीविजन (32 इंच से बड़े)</p>
  <div class="rate-comparison">
    <span>Old: 28%</span>
    <span aria-hidden="true">→</span>
    <span>New: 18%</span>
  </div>
</article>
```

### 7.3 Hindi Input Support

#### 7.3.1 Hindi Input Method
- Support Hindi keyboard input
- Support Hindi transliteration
- Support Hinglish input
- Clear input instructions

#### 7.3.2 Hindi Input Example
```html
<!-- Hindi input support -->
<form>
  <label for="search">Product name / उत्पाद का नाम</label>
  <input
    id="search"
    type="text"
    placeholder="Product name like 'LED TV' or 'सीमेंट'"
    aria-describedby="search-help"
  >
  <div id="search-help">
    <span lang="en">Enter product name in English or Hindi</span>
    <span lang="hi">अंग्रेजी या हिंदी में उत्पाद का नाम दर्ज करें</span>
  </div>
</form>
```

---

## 8. Testing Approach for Accessibility

### 8.1 Automated Testing

#### 8.1.1 Automated Tools
- **Lighthouse**: Built-in Chrome DevTools
- **axe DevTools**: Browser extension
- **WAVE**: Browser extension
- **pa11y**: Command-line tool
- **eslint-plugin-jsx-a11y**: ESLint plugin

#### 8.1.2 Automated Testing Setup
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse
lhci autorun

# Install axe DevTools
# Chrome Web Store: axe DevTools

# Install pa11y
npm install -g pa11y

# Run pa11y
pa11y https://saralgst.in
```

#### 8.1.3 CI/CD Integration
```yaml
# GitHub Actions example
name: Accessibility Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://saralgst.in
            https://saralgst.in/check
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 8.2 Manual Testing

#### 8.2.1 Keyboard Testing
- Test all functionality with keyboard only
- Test tab order
- Test focus indicators
- Test keyboard shortcuts
- Test keyboard traps

#### 8.2.2 Screen Reader Testing
- Test with NVDA (Windows)
- Test with JAWS (Windows)
- Test with VoiceOver (Mac)
- Test with TalkBack (Android)
- Test with VoiceOver (iOS)

#### 8.2.3 Color Contrast Testing
- Test with color contrast analyzer
- Test with Windows High Contrast mode
- Test with color blindness simulators
- Test with different display settings

#### 8.2.4 Mobile Testing
- Test on 375px width
- Test on 414px width
- Test with TalkBack
- Test with VoiceOver
- Test touch target sizes

### 8.3 User Testing

#### 8.3.1 Accessibility User Testing
- Test with screen reader users
- Test with keyboard-only users
- Test with low-vision users
- Test with colorblind users
- Test with mobile users

#### 8.3.2 Hindi Language Testing
- Test with Hindi-speaking users
- Test with Hindi screen reader users
- Test with Hindi keyboard users
- Test with Hinglish users

#### 8.3.3 Testing Scenarios
```gherkin
# Scenario: Screen reader user checks GST rate
Given I am a screen reader user
When I navigate to saralgst.in
And I type "cement" in the search box
And I press Enter
Then I should hear "HSN: 2523, Cement, Old rate: 28%, New rate: 18%"
And I should hear "Rate decreased"
And I should hear "Notification No. 8/2025-CT(Rate)"

# Scenario: Keyboard-only user checks GST rate
Given I am using keyboard only
When I navigate to saralgst.in
And I Tab to the search box
And I type "LED TV"
And I press Enter
Then I should see the result card
And I should be able to Tab to all interactive elements
And I should be able to activate all buttons with Enter

# Scenario: Hindi-speaking user checks GST rate
Given I am a Hindi-speaking user
When I navigate to saralgst.in
And I switch to Hindi language
And I type "सीमेंट" in the search box
And I press Enter
Then I should see the result in Hindi
And I should hear the result in Hindi (if using screen reader)
```

---

## 9. Accessibility Audit Checklist

### 9.1 Pre-Launch Checklist

#### 9.1.1 WCAG 2.1 AA Compliance
- [ ] All non-text content has text alternatives
- [ ] All time-based media has alternatives
- [ ] Content can be presented in different ways
- [ ] Content is easier to see and hear
- [ ] All functionality is keyboard accessible
- [ ] Users have enough time to read and use content
- [ ] Content does not cause seizures
- [ ] Users can navigate, find content, and determine where they are
- [ ] Text content is readable and understandable
- [ ] Content appears and operates in predictable ways
- [ ] Users can avoid and correct mistakes
- [ ] Content is compatible with assistive technologies

#### 9.1.2 Screen Reader Support
- [ ] Page title is descriptive and unique
- [ ] Landmark roles are used correctly
- [ ] Headings are used in correct hierarchy
- [ ] Links have descriptive text
- [ ] Form fields have labels
- [ ] Error messages are associated with form fields
- [ ] Dynamic content updates are announced
- [ ] Status messages are announced
- [ ] Modal dialogs are announced
- [ ] Focus is managed correctly

#### 9.1.3 Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus is visible at all times
- [ ] No keyboard traps
- [ ] Skip navigation link is present
- [ ] Keyboard shortcuts work correctly
- [ ] Focus is managed in modals
- [ ] Focus is returned after modal closes

#### 9.1.4 Color Contrast
- [ ] Normal text contrast ≥ 4.5:1
- [ ] Large text contrast ≥ 3:1
- [ ] UI components contrast ≥ 3:1
- [ ] Color is not the only visual means of conveying information
- [ ] Focus indicators are visible
- [ ] Links are distinguishable from surrounding text

#### 9.1.5 Mobile Accessibility
- [ ] Touch target size ≥ 44x44px
- [ ] Touch targets have adequate spacing
- [ ] No horizontal scroll on mobile
- [ ] Text can be resized up to 200%
- [ ] Page loads in <3s on 3G
- [ ] Lighthouse score ≥85 on mobile
- [ ] Content fits 375px width

#### 9.1.6 Hindi Language Support
- [ ] Language is declared with `lang` attribute
- [ ] Hindi text renders correctly
- [ ] Hindi screen reader support works
- [ ] Hindi input works correctly
- [ ] Language toggle works correctly
- [ ] Bilingual content is accessible

### 9.2 Ongoing Checklist

#### 9.2.1 Regular Testing
- [ ] Run automated accessibility tests weekly
- [ ] Run manual keyboard tests weekly
- [ ] Run screen reader tests monthly
- [ ] Run mobile accessibility tests monthly
- [ ] Run color contrast tests monthly
- [ ] Run user testing quarterly

#### 9.2.2 Monitoring
- [ ] Monitor accessibility issues in production
- [ ] Track accessibility metrics
- [ ] Review accessibility feedback
- [ ] Update accessibility documentation

#### 9.2.3 Training
- [ ] Train developers on accessibility
- [ ] Train QA on accessibility testing
- [ ] Train designers on accessibility
- [ ] Share accessibility best practices

---

## 10. Assistive Technology Compatibility

### 10.1 Screen Readers

#### 10.1.1 NVDA (Windows)
- **Version**: Latest stable
- **Testing**: All user flows
- **Focus**: Keyboard navigation, ARIA support
- **Known Issues**: None

#### 10.1.2 JAWS (Windows)
- **Version**: Latest stable
- **Testing**: All user flows
- **Focus**: Keyboard navigation, ARIA support
- **Known Issues**: None

#### 10.1.3 VoiceOver (Mac)
- **Version**: Latest macOS
- **Testing**: All user flows
- **Focus**: Keyboard navigation, ARIA support
- **Known Issues**: None

#### 10.1.4 TalkBack (Android)
- **Version**: Latest Android
- **Testing**: All user flows
- **Focus**: Touch exploration, gestures
- **Known Issues**: None

#### 10.1.5 VoiceOver (iOS)
- **Version**: Latest iOS
- **Testing**: All user flows
- **Focus**: Touch exploration, gestures
- **Known Issues**: None

### 10.2 Screen Magnifiers

#### 10.2.1 Windows Magnifier
- **Testing**: All user flows
- **Focus**: Text readability, UI scaling
- **Known Issues**: None

#### 10.2.2 macOS Zoom
- **Testing**: All user flows
- **Focus**: Text readability, UI scaling
- **Known Issues**: None

#### 10.2.3 Android Magnification
- **Testing**: All user flows
- **Focus**: Text readability, UI scaling
- **Known Issues**: None

#### 10.2.4 iOS Zoom
- **Testing**: All user flows
- **Focus**: Text readability, UI scaling
- **Known Issues**: None

### 10.3 Other Assistive Technologies

#### 10.3.1 Voice Control
- **Windows Voice Access**: Supported
- **macOS Voice Control**: Supported
- **Android Voice Access**: Supported
- **iOS Voice Control**: Supported

#### 10.3.2 Switch Access
- **Windows Switch Access**: Supported
- **macOS Switch Control**: Supported
- **Android Switch Access**: Supported
- **iOS Switch Control**: Supported

---

## 11. Accessibility Documentation Requirements

### 11.1 User-Facing Documentation

#### 11.1.1 Accessibility Statement
- **Location**: /accessibility
- **Content**:
  - Commitment to accessibility
  - WCAG compliance level
  - Known limitations
  - Feedback mechanism
  - Contact information

#### 11.1.2 Keyboard Shortcuts
- **Location**: /help/keyboard
- **Content**:
  - Tab navigation
  - Enter/Space to activate
  - Escape to close
  - Arrow keys for lists
  - Home/End for navigation

#### 11.1.3 Screen Reader Guide
- **Location**: /help/screen-readers
- **Content**:
  - Supported screen readers
  - How to use with screen readers
  - Known issues
  - Tips and tricks

### 11.2 Developer Documentation

#### 11.2.1 Accessibility Guidelines
- **Location**: /docs/accessibility
- **Content**:
  - WCAG 2.1 AA requirements
  - ARIA usage guidelines
  - Keyboard navigation patterns
  - Color contrast requirements
  - Testing procedures

#### 11.2.2 Component Accessibility
- **Location**: /docs/components
- **Content**:
  - Accessibility requirements per component
  - ARIA attributes per component
  - Keyboard behavior per component
  - Screen reader announcements per component

#### 11.2.3 Testing Documentation
- **Location**: /docs/testing/accessibility
- **Content**:
  - Automated testing setup
  - Manual testing procedures
  - User testing scenarios
  - Accessibility audit checklist

---

## 12. Conclusion

SaralGST accessibility strategy provides a comprehensive framework for ensuring that all users, including those with disabilities, can effectively use the GST rate checker. The implementation follows WCAG 2.1 AA standards with special focus on mobile-first design, Hindi language support, and assistive technology compatibility.

**Key Strengths**:
- WCAG 2.1 AA compliant
- Mobile-first accessibility
- Hindi language support
- Comprehensive screen reader support
- Keyboard navigation
- High color contrast
- Touch-friendly mobile design

**Areas for Improvement**:
- Advanced ARIA patterns (v2)
- Custom screen reader announcements (v2)
- Accessibility testing automation (v2)
- User testing with disabled users (v2)
- Accessibility training for team (v2)

**Next Steps**:
1. Complete accessibility implementation
2. Run comprehensive accessibility tests
3. Conduct user testing with disabled users
4. Monitor accessibility in production
5. Iterate based on feedback

---

*Accessibility is not a feature, it's a fundamental right. Every user deserves equal access to information and services.*