---
trigger: always_on
---

# Performance, SEO & Asset Optimization Rules (from cursor.directory)

Follow these rules to guarantee sub-second page loads, low mobile 4G data consumption, and optimal Core Web Vitals (LCP, FID/INP, CLS):

## 1. Next.js Image Optimization
- **Mandatory `sizes` Definition**: NEVER use `<Image fill />` without a precise `sizes` attribute. Always specify responsive breakpoints (e.g. `sizes="(max-width: 768px) 110px, (max-width: 1200px) 33vw, 25vw"`) to prevent Next.js from generating oversized 3840px images on mobile devices.
- **Image Quality Control**: Set `quality={65}` for thumbnails/cards and `quality={75}` for full-screen modals. Avoid default uncompressed image rendering.
- **Priority & Lazy Loading**: Set `priority` ONLY on the above-the-fold Hero or LCP image. Let below-the-fold images lazy-load automatically.
- **Explicit Aspect Ratios**: Always wrap images in fixed/aspect-ratio containers (`aspect-square`, `aspect-video`, or explicit width/height) to eliminate Cumulative Layout Shift (CLS).

## 2. SEO & Semantic HTML
- **Semantic Tags**: Structure document with `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`. Avoid `<div>` soup.
- **Heading Hierarchy**: Exactly one `<h1>` per page. Sub-sections must strictly follow `<h2>`, `<h3>` hierarchy.
- **Metadata**: Configure `metadata` or `generateMetadata` with accurate `title`, `description`, `openGraph`, and `robots` tags.

## 3. Bundle & Re-render Minimization
- **Tree-Shaking**: Import icons specifically (e.g. `import { Store, Sparkles } from 'lucide-react'`). Avoid wildcard barrel imports.
- **Dynamic Imports**: Use `next/dynamic` with `ssr: false` for heavy, purely client-side widgets (like chart visualizers or client-only drag-and-drop engines when initial render is not required).
