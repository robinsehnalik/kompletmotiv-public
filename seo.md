# SEO Optimization Report — Komplet motiv s.r.o. (`stavimesmotivem.cz`)

This document outlines how we maximally improved Search Engine Optimization (SEO) for **Komplet motiv s.r.o.** (`https://stavimesmotivem.cz`) during its early deployment stage. For a regional construction and development business operating in the Moravian-Silesian Region (Frýdek-Místek, Ostrava, Beskydy), early-stage SEO depends on **complete indexability**, **local search authority (LocalBusiness Schema + NAP consistency)**, **zero crawl waste or soft-404s**, and **fast Core Web Vitals (LCP)**.

---

## 1. Technical Crawlability & Indexing

### Dynamic XML Sitemap with Real `<lastmod>` Timestamps
- **File**: [`src/pages/sitemap.xml.ts`](src/pages/sitemap.xml.ts)
- **Before**: Returned a hardcoded 6-item list of static pages with today's date as `<lastmod>`. Missing `/galerie` and **100% of dynamic CMS pages** (`/projekty/[slug]`, `/vystavba/[slug]`, `/blog/[slug]`).
- **After**: Queries all published entries from `cms.vystavba`, `cms.projekty`, and `cms.blog`, includes `/galerie`, and outputs accurate `<lastmod>` dates derived from each document's `_updatedAt` / `publishDate` timestamp.
- **Impact**: Googlebot and SeznamBot immediately discover every active construction offering, reference project, and blog post without relying solely on multi-hop HTML crawling.

### Eliminated Soft-404 Redirects (`302` → Real `404`)
- **Files**: [`src/pages/projekty/[slug].astro`](src/pages/projekty/[slug].astro), [`src/pages/vystavba/[slug].astro`](src/pages/vystavba/[slug].astro), [`src/pages/blog/[slug].astro`](src/pages/blog/[slug].astro), [`src/pages/404.astro`](src/pages/404.astro)
- **Before**: Requesting a non-existent or unpublished slug triggered `Astro.redirect("/404")`, returning an HTTP `302 Found` redirect instead of an HTTP `404 Not Found` status at the requested URL. Additionally, `404.astro` was in English (`Page not found`) and lacked `noindex`.
- **After**: Missing or unpublished slugs return `new Response(null, { status: 404, statusText: "Not Found" })` directly, and `404.astro` sets `Astro.response.status = 404`, `noindex={true}`, and displays localized Czech copy with a link back to the homepage.
- **Impact**: Prevents Google Search Console "Soft 404" penalties and keeps dead URLs out of the search index.

### Crawl Budget & Duplicate/Draft Protection
- **Files**: [`public/robots.txt`](public/robots.txt), [`src/layouts/Layout.astro`](src/layouts/Layout.astro), [`src/pages/gdpr.astro`](src/pages/gdpr.astro), [`src/pages/cookies.astro`](src/pages/cookies.astro), [`src/cms/middleware/auth.ts`](src/cms/middleware/auth.ts), [`src/pages/admin/AdminLayout.astro`](src/pages/admin/AdminLayout.astro)
- **Improvements**:
  - Blocked `Disallow: /*?preview*` in `public/robots.txt` and enforced `noindex, nofollow` in `Layout.astro` whenever `?preview` is present in the URL so unpublished CMS drafts can never be indexed.
  - Added `noindex={true}` to legal boilerplate pages (`/gdpr`, `/cookies`) so early domain authority focuses on commercial and informational pages.
  - Added `X-Robots-Tag: noindex, nofollow` HTTP response headers and `<meta name="robots" content="noindex, nofollow">` across all `/admin` routes.
  - Added `<link rel="sitemap" href="/sitemap.xml" />` in `<head>`.

---

## 2. Rich Structured Data (Schema.org JSON-LD)

- **Files**: [`src/layouts/Layout.astro`](src/layouts/Layout.astro), [`src/pages/projekty/[slug].astro`](src/pages/projekty/[slug].astro), [`src/pages/vystavba/[slug].astro`](src/pages/vystavba/[slug].astro), [`src/pages/blog/[slug].astro`](src/pages/blog/[slug].astro)
- **Before**: Zero JSON-LD structured data existed on any page.
- **After**: Every public page outputs a rich `<script type="application/ld+json">` `@graph` containing:
  1. **`GeneralContractor` / `HomeAndConstructionBusiness` / `LocalBusiness`**:
     - Official company name (`Komplet motiv s.r.o.`), tax ID (`IČ: 14064103`), founders (`Jiří Zdeněk`, `Dalibor Sochorek`), phone (`+420 602 527 110`), email (`info@stavimesmotivem.cz`), postal address (`Ó. Lysohorského 702, 738 01 Frýdek-Místek, CZ`), GPS coordinates (`49.6853, 18.3504`), and `areaServed` (`Frýdek-Místek`, `Ostrava`, `Moravskoslezský kraj`).
  2. **`WebSite`**: Site-level entity linked to the `LocalBusiness` publisher with `inLanguage: "cs-CZ"`.
  3. **`BreadcrumbList`**: Automatically generated hierarchy on detail pages (`Domů → Projekty → [Název projektu]`, `Domů → Výstavba → [Název výstavby]`, `Domů → Blog → [Název článku]`) for rich breadcrumb trails in Google and Seznam SERPs.
  4. **Page-Specific Entities**:
     - `CreativeWork` on `/projekty/[slug]` and `/vystavba/[slug]` with location (`contentLocation`), publication/modification timestamps, and project cover image.
     - `BlogPosting` on `/blog/[slug]` with `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`, `publisher`, and `mainEntityOfPage`.

---

## 3. On-Page Meta, OpenGraph & Local SEO Signals

### Complete OpenGraph & Social Metadata
- **File**: [`src/layouts/Layout.astro`](src/layouts/Layout.astro)
- **Before**: `astro-seo` was only passed `openGraph.basic`, omitting `og:description`, `og:locale`, and `og:site_name` across the entire site. Detail pages hardcoded `/opengraph.png` and `type: "website"`, ignoring their actual project/article cover image and publication dates. CMS settings `favicon` and `opengraphImage` were also ignored.
- **After**:
  - Populated `openGraph.optional` (`description`, `locale: "cs_CZ"`, `siteName: "Komplet motiv s.r.o."`).
  - Dynamic pages pass `image={entry.image}`, `type="article"`, `publishedTime`, and `modifiedTime` so shared links on Facebook, LinkedIn, WhatsApp, and X display the actual building photo and article metadata.
  - Wired CMS `settings.favicon` and `settings.opengraphImage` fallbacks.
  - Upgraded the homepage fallback `<title>` from a generic slogan (`Komplet motiv s.r.o. — Stavíme s motivem`) to a high-intent regional title: **`Stavební firma Frýdek-Místek a Ostrava | Komplet motiv s.r.o.`**.
  - Added regional geo tags (`<meta name="geo.region" content="CZ-80" />`, `<meta name="geo.placename" content="Frýdek-Místek" />`).

### Local SEO NAP (Name, Address, Phone) Consistency
- **Files**: [`src/pages/contact.astro`](src/pages/contact.astro), [`src/components/footer.astro`](src/components/footer.astro)
- **Before**: `contact.astro` fetched `phone` from the CMS into a variable (`const phone = settings?.phone || "+420 602 527 110"`) but never rendered it in the HTML. `footer.astro` also lacked phone and email links.
- **After**: Rendered clickable `tel:` and `mailto:` links in both the Contact page and the global Footer, ensuring 100% visual and semantic NAP consistency with the `LocalBusiness` JSON-LD schema.

---

## 4. Core Web Vitals (LCP) & Image/Accessibility SEO

- **Files**: [`src/components/hero.astro`](src/components/hero.astro), [`src/components/CmsPicture.astro`](src/components/CmsPicture.astro), [`src/pages/projekty.astro`](src/pages/projekty.astro), [`src/pages/vystavba.astro`](src/pages/vystavba.astro), [`src/pages/blog.astro`](src/pages/blog.astro), [`src/pages/galerie.astro`](src/pages/galerie.astro), [`src/pages/projekty/[slug].astro`](src/pages/projekty/[slug].astro), [`src/pages/vystavba/[slug].astro`](src/pages/vystavba/[slug].astro), [`src/pages/blog/[slug].astro`](src/pages/blog/[slug].astro)
- **LCP Resource Prioritization**:
  - Removed `hidden md:block` around the eager `fetchpriority="high"` hero image in `hero.astro` so mobile devices no longer waste bandwidth downloading a hidden high-priority image during initial page load.
  - Added `fetchpriority="high"` to the main LCP cover image on `/projekty/[slug]`, `/vystavba/[slug]`, and `/blog/[slug]`, as well as only the first card (`index === 0`) on listing pages.
  - Removed the redundant `fetchpriority="auto"` default in `CmsPicture.astro` so standard images omit `fetchpriority` cleanly.
- **Descriptive Image `alt` Attributes & Iframe Accessibility**:
  - Differentiated gallery `alt` text on project and construction pages (`${entry.title} – fotografie realizace 1`, `${entry.title} – průběh realizace 1`, `${entry.title} – stav před zahájením výstavby`) instead of repeating identical `alt={entry.title}` strings on up to 20 images per page.
  - Added a descriptive `title` attribute to the Google Maps `<iframe>` on `/vystavba/[slug]`.

---

## 5. Early-Stage Content Authority & Database Integrity

- **Files**: [`data/seed-production.sql`](data/seed-production.sql), [`src/cms/migrations/0002_aberrant_lilandra.sql`](src/cms/migrations/0002_aberrant_lilandra.sql)
- **Removed English Lorem Ipsum Template Pollution**:
  - `data/seed-production.sql` previously seeded 4 English tech template blog posts (*"The Complete Guide to Full Stack Web Development"*, *"How to become a Frontend Master"*, *" Essential Typography Rules..."* with Lorem Ipsum body text) onto a Czech `<html lang="cs">` construction site.
  - Replaced them with 2 authentic Czech construction guides targeting regional search queries (*"Jak připravit stavební pozemek a vyřídit stavební povolení na Frýdecko-Místecku a Ostravsku"* and *"Nízkoenergetický rodinný dům na klíč: Jaké technologie se dnes vyplatí"*).
- **Fixed Database Migration & Seed Schema Mismatch**:
  - Added missing columns (`start_date`, `delivery_date` on `cms_vystavba`; `favicon`, `opengraph_image` on `cms_settings`) to `0002_aberrant_lilandra.sql` and aligned `data/seed-production.sql` column counts so all `cms_vystavba` and `cms_settings` records seed without errors.

---

## 6. Recommended Next Steps After Production Deployment

1. **Google Search Console & Seznam Webmaster**:
   - Verify domain ownership (`stavimesmotivem.cz`) in both **Google Search Console** and **Seznam Webmaster** (critical for Czech local search traffic).
   - Submit `https://stavimesmotivem.cz/sitemap.xml`.
2. **Google Business Profile (Firemní profil Google) & Firmy.cz**:
   - Claim/update the profile for **Komplet motiv s.r.o.** using the exact same NAP data (`Ó. Lysohorského 702, 738 01 Frýdek-Místek`, `+420 602 527 110`, `https://stavimesmotivem.cz`) so Google Maps and Seznam Mapy.cz link directly to the site's `LocalBusiness` entity.
3. **Production CMS Cleanup (if already seeded)**:
   - If the production Cloudflare D1 database was already seeded before this update, delete the 4 old English template blog posts via `/admin/collections/blog` and run the updated seed for the Czech construction articles.
