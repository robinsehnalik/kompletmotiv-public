# Frontend Architecture & Engineering Decisions

This document outlines the frontend architectural principles, rendering strategies, performance budgets, and UI engineering decisions implemented for **stavimesmotivem.cz** (Komplet Motiv s.r.o.).

---

## Client Interaction & Serverless Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant Edge as Cloudflare Pages Edge
    participant Worker as /api/submit Function
    participant DB as Cloudflare D1 (SQL)
    participant Mail as Resend API

    User->>Edge: GET / (or /vystavba, /kontakt)
    Edge-->>User: 200 OK (Pre-rendered HTML + Inlined Tailwind CSS)
    
    Note over User: User interacts with Contact Form
    User->>User: Event 'submit' -> form.checkValidity()
    alt Form Invalid
        User->>User: Add class .was-validated, focus first :invalid input
    else Form Valid
        User->>User: Update UI state ("Odesílám..."), lock submit button
        User->>Worker: POST /api/submit { name, email, message }
        Worker->>Worker: Validate request payload & headers
        Worker->>DB: INSERT INTO submissions (name, email, message, status: 'new')
        Worker->>Mail: Dispatch transactional auto-responder
        Mail-->>Worker: 200 OK
        Worker->>DB: UPDATE submissions SET status = 'replied'
        Worker-->>User: 200 OK { success: true }
        User->>User: Render confirmation notice, reset form fields
    end
```

---

## Architectural Principles

### 1. Zero-Framework Runtime Baseline
- **Pure Static Output:** Marketing pages and portfolio views are pre-compiled into static HTML at build time using Astro v5. No monolithic SPA framework runtime (such as React or Vue) is bundled or loaded on public-facing pages.
- **Native Script Modules:** Interactive components (e.g. contact form, gallery lightbox) use standalone vanilla TypeScript modules loaded via native browser script tags.
- **Main Thread Availability:** Because there is no client-side virtual DOM reconciliation or hydration pass, the browser main thread remains unblocked and ready for immediate user input upon first paint.

### 2. Multi-Region Core Web Vitals Audit Data

Production benchmarks audited via **Lighthouse 13.5.0** (Desktop) across global test locations:

| Test Location | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TTI | TBT | CLS |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Germany** | **94** | **100** | **100** | **100** | 269ms | 589ms | 589ms | 0ms | 0.15 |
| **Finland** | **94** | **100** | **100** | **100** | 305ms | 625ms | 625ms | 0ms | 0.15 |
| **US East** | **94** | **100** | **100** | **100** | 302ms | 702ms | 702ms | 0ms | 0.15 |

#### Architectural Analysis:
* **TBT = 0ms across all regions:** Zero client runtime JavaScript prevents long tasks from blocking user interaction during page initialization.
* **First Contentful Paint < 310ms:** Global edge CDN caching on Cloudflare Pages provides sub-310ms paint times even on transatlantic requests.
* **LCP < 710ms:** Hero assets formatted as WebP with explicit preloading and inlined critical styling ensure Largest Contentful Paint stays well below Google's 2.5s "Good" boundary.

---

## Production Component Architecture Showcases

Sanitized versions of the core UI components are available directly in this repository:

1. **Native Constraint Validation Form ([`components/SanitizedContactForm.astro`](../components/SanitizedContactForm.astro)):**
   - Utilizes CSS pseudo-classes (`:invalid`, `:placeholder-shown`) and native HTML5 form validation.
   - Programmatically moves focus to the first invalid field upon submission for full accessibility (a11y).
   - Manages asynchronous submission states (loading, success, error) with auto-dismissing notifications.

2. **Construction Progress Timeline ([`components/SanitizedTimeline.astro`](../components/SanitizedTimeline.astro)):**
   - Renders project phases with dynamic status calculation (`isCompleted`, `isCurrent`, upcoming).
   - Layout-shift-free vertical progression with pulsing indicators for active milestones.

3. **Client Submission Module ([`examples/sanitized-ui-pattern.ts`](../examples/sanitized-ui-pattern.ts)):**
   - Independent TypeScript module demonstrating form data extraction, validation checks, and error handling.

---

## Asset Pipeline & Styling

- **Tailwind CSS v4 Integration:** Compiled directly via Vite at build time for precise dead-code elimination.
- **Critical CSS Inlining:** Stylesheets are bundled and inlined to avoid render-blocking network round trips.
- **Responsive Media Delivery:** Construction photography uses multi-resolution `sizes` and `srcset` attributes to serve appropriately sized assets to mobile viewports.

---

## Accessibility & Standards Compliance

- **Semantic HTML5:** Native landmark elements (`<header>`, `<main>`, `<article>`, `<nav>`, `<footer>`) ensure clear structure for screen readers.
- **Focus Management:** Invalid inputs receive automatic focus during validation attempts, allowing assistive technology users to identify and correct errors immediately.
- **Color Contrast:** Text and background color tokens meet WCAG 2.1 AA contrast requirements (audited at 100/100).
