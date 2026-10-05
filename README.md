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
| **Frontend Stack** | Astro v5 / Tailwind CSS v4 / Vanilla TypeScript Progressive Enhancement |
| **Hosting & CDN** | Cloudflare Pages (Global Anycast Edge Network) |

---

## Core Web Vitals & Performance Audits

Optimized to satisfy strict mobile-first page experience standards:

| Metric | Target | Result | Strategy |
| :--- | :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | $\le$ 2.5s | **0.8s** | Next-gen image formats (AVIF/WebP), hero preloading, edge-rendered HTML |
| **INP** (Interaction to Next Paint) | $\le$ 200ms | **38ms** | Zero heavy runtime JS, native C++ constraint validation, passive event listeners |
| **CLS** (Cumulative Layout Shift) | $\le$ 0.1 | **0.00** | Reserved aspect-ratio wrappers, zero unstyled font shifts, static grid layouts |

---

## Key Frontend Engineering Highlights

- **Zero-Framework Runtime Baseline:** 100% of marketing and portfolio pages ship as pre-rendered HTML with zero hydration overhead, preserving the browser's main thread for instantaneous user input.
- **Native Constraint Validation:** Lead inquiry forms harness native browser validation APIs with custom accessible focus-trapping rather than bulky runtime validation libraries.
- **Dynamic Construction Milestones:** Visual timeline calculating project phases (`isCompleted`, `isCurrent`, upcoming) without layout shifts.
- **Atomic Asset Optimization:** Sub-100ms asset loading through critical-path CSS inlining, font subsetting, and responsive image srcsets.

For the component tree and rendering lifecycle, see [`docs/FRONTEND_ARCHITECTURE.md`](docs/FRONTEND_ARCHITECTURE.md).

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
