---
trigger: always_on
---

# UI/UX Design Guidelines & Mobile-First Excellence (from cursor.directory)

Adhere to modern, high-converting, and aesthetically polished UI/UX principles:

## 1. Visual Hierarchy & Aesthetic Standards
- **Visual WOW Factor**: Clean, sleek, modern design with subtle glassmorphism (`backdrop-blur-md`, `bg-white/70`, `border-white/20`), elegant rounded corners (`rounded-2xl`, `rounded-3xl`), and soft layered shadows (`shadow-sm`, `shadow-xl`).
- **Typography & Rhythm**: High contrast legibility, appropriate font weights (`font-bold`, `font-semibold`), clean tracking, and balanced line heights. Avoid walls of dense text.
- **Color Palettes**: Harmonious neutral foundations (`neutral-900`, `neutral-600`, `neutral-100`) accented with a signature brand color (e.g. `blue-600`, `emerald-500`) for primary actions.

## 2. Micro-Interactions & Fluid Motion
- **Hover & Active Feedback**: Every button, card, and interactive element MUST have hover/active state transitions (`transition-all duration-300 hover:scale-[1.02]` or `hover:-translate-y-0.5`).
- **Transitions**: Use smooth easing curves for modal entrances, drawer sliders, and dropdown menus.
- **Loading & Skeletons**: Always provide skeleton loaders or clean spin states during async operations to avoid layout shift (CLS).

## 3. Mobile-First & Touch Optimization
- **Hit Targets**: Touch targets for mobile buttons must be at least 44x44px (`min-h-[44px]` or adequate padding `p-3`).
- **Safe Area Aware**: Floating action bars, bottom navigations, and dialogs must respect viewport safe areas (`pb-safe`, `bottom-4 md:bottom-8`).
- **Gestures**: Prefer native touch-friendly interactions (horizontal swipes, drag-to-dismiss) where appropriate.

## 4. No Fake Placeholders
- Use contextually realistic Vietnamese dummy data and real optimized demo images instead of generic `lorem ipsum` or broken image links.
