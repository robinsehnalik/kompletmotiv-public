# stavimesmotivem.cz (Komplet Motiv) — Client Frontend Case Study

> **Notice on Proprietary Code & NDA Compliance:**  
> This website was designed and built as a commercial deliverable for a paying client.  
> To protect client intellectual property, copyrighted assets, and proprietary brand designs,  
> the production source repository remains private. This repository serves as an architectural  
> breakdown, responsive UI review, and web performance case study.

[🔗 Visit Live Website](https://stavimesmotivem.cz) · [📐 Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md) · [👤 Return to Portfolio](https://sehnalik.com)

---

## Overview & Scope

| Attribute | Specification |
| :--- | :--- |
| **Site Type** | Corporate Marketing Site & Construction Portfolio Platform |
| **Status** | Live in Production |
| **Frontend Stack** | Astro v5 / Tailwind CSS v4 / Vanilla TypeScript |
| **Hosting & Edge Platform** | Cloudflare Pages (Global Anycast Edge Network) |
| **Backend Integration** | Cloudflare D1 (SQL) / Cloudflare Pages Functions / Resend API |

---

## Core Web Vitals & Real Performance Audits

Audited via **Lighthouse 13.5.0** (Desktop) across multi-region edge testing nodes:

| Test Location | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TTI | TBT | CLS |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Germany** | **94** | **100** | **100** | **100** | 269ms | 589ms | 589ms | 0ms | 0.15 |
| **Finland** | **94** | **100** | **100** | **100** | 305ms | 625ms | 625ms | 0ms | 0.15 |
| **US East** | **94** | **100** | **100** | **100** | 302ms | 702ms | 702ms | 0ms | 0.15 |

### Performance Engineering Takeaways
- **Zero Blocking Time (TBT = 0ms):** Public routes are compiled ahead-of-time into clean static HTML with zero client framework hydration, resulting in 0ms Total Blocking Time across all tested locations.
- **Fast Global Content Delivery (LCP < 710ms):** Cloudflare Pages Anycast edge routing ensures First Contentful Paint under 310ms and Largest Contentful Paint under 705ms, even on transatlantic requests.
- **Layout Stability:** Reserved aspect-ratio wrappers across media galleries and portfolio cards ensure layout consistency during asset loading.

---

## Key Frontend Engineering Highlights

- **Zero-Framework Runtime Baseline:** Public marketing and project pages ship as static HTML with zero JavaScript framework runtime, eliminating client hydration delays and preserving the main thread for immediate user input.
- **Native Constraint Validation:** Forms use the browser's native HTML5 validation APIs and CSS pseudo-classes (`:invalid`, `:placeholder-shown`) with accessible focus management.
- **Dynamic Construction Milestones:** Visual timeline calculating project phases (`isCompleted`, `isCurrent`, upcoming) without layout shifts.
- **Inlined Critical Styling:** Key layout CSS is inlined into the document `<head>`, avoiding render-blocking stylesheet network round trips.

For the sequence diagram and detailed lifecycle, see [`docs/FRONTEND_ARCHITECTURE.md`](docs/FRONTEND_ARCHITECTURE.md).

---

## Showcase Components & Sanitized Patterns

To demonstrate real engineering approaches used in the production application without exposing proprietary business rules or credentials, the following sanitized components are available:

- 📄 [`components/SanitizedContactForm.astro`](components/SanitizedContactForm.astro) — Native HTML5 constraint validation form with accessible error focus management and asynchronous submission.
- 🏗️ [`components/SanitizedTimeline.astro`](components/SanitizedTimeline.astro) — Multi-stage construction timeline with responsive status badges and layout-shift prevention.
- ⚡ [`examples/sanitized-ui-pattern.ts`](examples/sanitized-ui-pattern.ts) — Clean TypeScript module demonstrating programmatic constraint validation and resilient asynchronous dispatch.

---

## Inquiries & Author

Designed & developed by **Robin Sehnalík**.  
For frontend contract availability or portfolio inquiries: [https://sehnalik.com](https://sehnalik.com).
