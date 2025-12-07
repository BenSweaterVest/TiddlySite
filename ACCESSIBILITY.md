# Accessibility Guide

TiddlySite is committed to providing an accessible blogging platform for all users. This guide covers accessibility features, best practices, and testing procedures.

## Built-in Accessibility Features

### Semantic HTML

TiddlySite uses semantic HTML elements throughout:

- `<nav>` for navigation areas
- `<article>` for blog posts
- `<aside>` for sidebars
- `<header>` and `<footer>` for page sections
- `<h1>` through `<h6>` for proper heading hierarchy
- `<button>` for interactive elements (not `<div onclick>`)

### ARIA Labels

All interactive elements include appropriate ARIA labels:

```html
<!-- Example: Admin panel toggle -->
<button aria-label="Toggle admin panel" aria-expanded="false">
  Admin
</button>

<!-- Example: Search input -->
<input type="search" aria-label="Search posts and pages">

<!-- Example: Post type badges -->
<span class="cb-type-badge" aria-label="Event post">📅 Event</span>
```

### Keyboard Navigation

All functionality is accessible via keyboard:

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and links
- **Esc**: Close modals and dialogs
- **Arrow keys**: Navigate through lists (where applicable)

### Focus Indicators

Visible focus indicators on all interactive elements:

```css
/* All focusable elements */
a:focus, button:focus, input:focus, select:focus {
  outline: 2px solid var(--cb-accent);
  outline-offset: 2px;
}

/* High contrast focus for better visibility */
:focus-visible {
  outline: 3px solid var(--cb-accent);
  outline-offset: 3px;
}
```

### Color Contrast

All themes meet WCAG AA standards:

| Theme | Text on Background | Contrast Ratio |
|-------|-------------------|----------------|
| Historical | #333 on #fff | 12.6:1 (AAA) |
| Modern | #1a1a1a on #fff | 16.1:1 (AAA) |
| Dark | #e0e0e0 on #1e1e1e | 11.2:1 (AAA) |
| Vibrant | #2d3436 on #fff | 14.3:1 (AAA) |
| Professional | #1a202c on #fff | 15.7:1 (AAA) |

**Links and interactive elements meet AA standards** (4.5:1 minimum for normal text, 3:1 for large text).

### Responsive Text Sizing

Text respects user preferences:

```css
/* Base font size uses rem units */
body {
  font-size: 1rem; /* Respects browser default (usually 16px) */
}

/* Text scales with user zoom */
h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
p { font-size: 1rem; }
small { font-size: 0.875rem; }
```

## Best Practices for Content Authors

### 1. Use Descriptive Headings

**Good**:
```
!! Welcome to Our Historical Society

!!! Upcoming Events

!!! Recent Discoveries
```

**Bad**:
```
!! Click Here

!!! More Info

!!! Section 1
```

### 2. Add Alt Text to Images

**Good**:
```html
[img[Historic photo of Main Street in 1920|images/mainstreet-1920.jpg]]
Alt text: "Black and white photograph showing Main Street with horse-drawn carriages and brick buildings"
```

**Bad**:
```html
[img[images/photo.jpg]]
<!-- No alt text -->
```

### 3. Use Descriptive Link Text

**Good**:
```
Read our [[full accessibility statement|Accessibility]]

Download the [[2025 event calendar (PDF, 2MB)|calendar.pdf]]
```

**Bad**:
```
[[Click here|Accessibility]]

[[Download|calendar.pdf]]
```

### 4. Maintain Proper Heading Hierarchy

**Good**:
```
!! Main Article Title (h2)
!!! Section Heading (h3)
!!!! Subsection (h4)
```

**Bad**:
```
!! Main Title (h2)
!!!! Skipping to h4
!!! Back to h3 (breaks hierarchy)
```

### 5. Provide Context for Icons and Emojis

**Good**:
```html
<span aria-label="Event post">📅</span> Event
<span aria-label="Reading time">📖</span> 5 min read
```

**Bad**:
```
📅
📖
<!-- No context for screen readers -->
```

### 6. Use Tables for Data, Not Layout

**Good**:
```
|! Header 1 |! Header 2 |! Header 3 |
| Data 1 | Data 2 | Data 3 |
| Data 4 | Data 5 | Data 6 |
```

**Bad**:
```
| Navigation | Content |
| Links here | Article here |
<!-- Using tables for page layout -->
```

### 7. Provide Captions for Videos

If using video posts:

```
!! Conference Keynote 2025

{{Video URL}}

!!! Video Transcript

[Full transcript of keynote speech...]
```

### 8. Write Clear, Concise Content

- Use plain language
- Keep paragraphs short (3-4 sentences)
- Use bullet points for lists
- Define technical terms on first use
- Avoid jargon when possible

## Accessibility Testing

### Automated Testing Tools

**Browser Extensions**:
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (built into Chrome)

**Online Tools**:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)

### Manual Testing

#### 1. Keyboard Navigation Test

1. Disconnect your mouse (or don't use it)
2. Navigate your site using only keyboard:
   - Tab through all interactive elements
   - Use Enter/Space to activate buttons
   - Use arrow keys in dropdowns
3. Verify:
   - All functionality is accessible
   - Focus indicator is visible
   - Tab order is logical
   - No keyboard traps

#### 2. Screen Reader Test

**Windows (NVDA - Free)**:
1. Download [NVDA](https://www.nvaccess.org/)
2. Start NVDA (Ctrl+Alt+N)
3. Navigate your site
4. Listen for:
   - Proper heading announcements
   - Image alt text
   - Link descriptions
   - Form labels
   - ARIA labels

**Mac (VoiceOver - Built-in)**:
1. Enable VoiceOver (Cmd+F5)
2. Navigate your site (Ctrl+Option+Arrow keys)
3. Listen for same items as above

**Important areas to test**:
- Homepage
- Blog post
- Navigation menu
- Search functionality
- Admin panel

#### 3. Zoom Test

1. Zoom to 200% (Ctrl/Cmd +)
2. Verify:
   - All text is readable
   - No horizontal scrolling (except for intentional elements)
   - Layout doesn't break
   - All functionality still works

#### 4. Color Blind Simulation

Use browser extensions to simulate color blindness:
- [Color Oracle](https://colororacle.org/)
- [Colorblindly](https://chrome.google.com/webstore/detail/colorblindly)

Verify that:
- Information isn't conveyed by color alone
- Links are distinguishable without color
- Post type badges use text, not just color

#### 5. Mobile Screen Reader Test

**iOS (VoiceOver)**:
- Settings → Accessibility → VoiceOver → On
- Triple-click home button to toggle

**Android (TalkBack)**:
- Settings → Accessibility → TalkBack → On

Test navigation and content reading on mobile.

### Accessibility Checklist

Use this checklist for each new post/page:

#### Content
- [ ] Headings follow proper hierarchy (h2 → h3 → h4)
- [ ] All images have descriptive alt text
- [ ] Links use descriptive text (not "click here")
- [ ] Lists use proper markup (bullets or numbers)
- [ ] Tables include headers for data tables
- [ ] Videos have transcripts or captions
- [ ] Complex charts/graphs have text descriptions

#### Design
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text)
- [ ] Text can be resized to 200% without breaking
- [ ] Focus indicators are visible on all interactive elements
- [ ] No information conveyed by color alone
- [ ] Interactive elements are at least 44x44 pixels (mobile)

#### Functionality
- [ ] All functionality available via keyboard
- [ ] No keyboard traps (can Tab away from all elements)
- [ ] Forms have proper labels
- [ ] Error messages are clear and associated with fields
- [ ] Time limits can be extended or disabled
- [ ] Auto-playing content can be paused

#### Technical
- [ ] Valid HTML (no unclosed tags)
- [ ] Page has descriptive title
- [ ] Language is set (`lang="en"`)
- [ ] Skip navigation link available
- [ ] ARIA landmarks used appropriately

## WCAG 2.1 Compliance

TiddlySite aims for **WCAG 2.1 Level AA** compliance.

### Level A (Must Support)

- ✅ **1.1.1** Non-text Content (alt text)
- ✅ **1.3.1** Info and Relationships (semantic HTML)
- ✅ **2.1.1** Keyboard accessible
- ✅ **2.4.1** Bypass Blocks (skip navigation)
- ✅ **3.1.1** Language of Page
- ✅ **4.1.1** Parsing (valid HTML)
- ✅ **4.1.2** Name, Role, Value (ARIA)

### Level AA (Should Support)

- ✅ **1.4.3** Contrast (Minimum) - 4.5:1 ratio
- ✅ **1.4.5** Images of Text (avoid when possible)
- ✅ **2.4.5** Multiple Ways (navigation + search)
- ✅ **2.4.6** Headings and Labels (descriptive)
- ✅ **2.4.7** Focus Visible
- ✅ **3.2.3** Consistent Navigation
- ✅ **3.3.1** Error Identification
- ✅ **3.3.2** Labels or Instructions

### Level AAA (Nice to Have)

- ⚠️ **1.4.6** Contrast (Enhanced) - 7:1 ratio (some themes)
- ⚠️ **2.4.8** Location (breadcrumbs) - not implemented
- ⚠️ **3.1.3** Unusual Words (glossary) - user responsibility

## Common Accessibility Issues and Fixes

### Issue: Images without alt text

**Problem**:
```html
[img[photo.jpg]]
```

**Fix**:
```html
[img[Historic downtown photograph from 1920|photo.jpg]]
```

Or set title field:
```
title: Photo of Downtown
alt: Black and white photograph showing Main Street in 1920
```

---

### Issue: Poor color contrast

**Problem**:
```css
.my-text {
  color: #888;  /* Gray text on white = 2.9:1 - FAILS */
}
```

**Fix**:
```css
.my-text {
  color: var(--cb-text-secondary);  /* Theme-appropriate color */
  /* Or use darker color: #555 = 7:1 - PASSES AA */
}
```

---

### Issue: Unlabeled form inputs

**Problem**:
```html
<input type="text" placeholder="Search">
```

**Fix**:
```html
<label for="search-input">Search</label>
<input type="text" id="search-input" placeholder="Enter search terms">
```

---

### Issue: Buttons without text

**Problem**:
```html
<button>❌</button>
```

**Fix**:
```html
<button aria-label="Close dialog">❌</button>
```

---

### Issue: Skipped heading levels

**Problem**:
```
!! Main Title (h2)
!!!! Subsection (h4) ← Skipped h3
```

**Fix**:
```
!! Main Title (h2)
!!! Section (h3)
!!!! Subsection (h4)
```

---

## Accessibility Statement Template

Add this to your About page:

```markdown
!! Accessibility Statement

We are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

!!! Conformance Status

This website aims to conform to **WCAG 2.1 Level AA** standards. We have tested this site with:

* Screen readers (NVDA, JAWS, VoiceOver)
* Keyboard-only navigation
* Browser zoom up to 200%
* Color blindness simulators

!!! Measures to Support Accessibility

We take the following measures:

* Use semantic HTML5 elements
* Provide text alternatives for images
* Ensure sufficient color contrast
* Support keyboard navigation
* Test with screen readers
* Use ARIA landmarks and labels

!!! Feedback

We welcome your feedback on the accessibility of this site. Please contact us if you encounter accessibility barriers:

* Email: [your-email@example.com]
* Phone: [your phone number]

We aim to respond to feedback within 3 business days.

!!! Technical Specifications

This site relies on the following technologies:

* HTML5
* CSS3
* JavaScript (TiddlyWiki 5.3.0+)

The site is designed to be compatible with:

* Current versions of Chrome, Firefox, Safari, Edge
* Screen readers (NVDA, JAWS, VoiceOver)
* Mobile browsers (iOS Safari, Android Chrome)

!!! Limitations and Alternatives

Despite our best efforts, some content may have accessibility limitations:

* Embedded third-party content (videos, social media)
* Historical images without descriptions
* PDF documents from archives

If you encounter such content, please contact us for assistance.

Last reviewed: [DATE]
```

---

## Resources

### Standards and Guidelines

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Section 508](https://www.section508.gov/)

### Testing Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers

- [NVDA](https://www.nvaccess.org/) (Windows, free)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Windows)
- VoiceOver (Mac/iOS, built-in)
- TalkBack (Android, built-in)

### Learning Resources

- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Deque University](https://dequeuniversity.com/)

---

Last Updated: 2025-12-07
