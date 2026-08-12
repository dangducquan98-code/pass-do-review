---
trigger: always_on
---

# Coding Standards (Next.js & React)
When writing code for this project, follow these standards:
1. **Next.js App Router**: Always use the new `app/` directory architecture.
2. **Server/Client Components**: Use Server Components by default. Only add `"use client"` when interactivity (hooks, event listeners) is required.
3. **TypeScript**: Strongly type all components, props, and API responses.
4. **TailwindCSS**: Use Tailwind for all styling. Keep classes organized.
5. **Clean Code**: Extract complex logic into custom hooks or utility functions (`lib/` or `utils/`).
6. **SEO & Performance**: Use `next/image` for all images to ensure WebP optimization. Use proper semantic HTML tags (`<article>`, `<section>`, `<nav>`).
