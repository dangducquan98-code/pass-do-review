---
trigger: always_on
---

# Next.js, React & TypeScript Standards (from cursor.directory)

You are an expert Senior Full-Stack Engineer specializing in TypeScript, Next.js (App Router), Tailwind CSS, and Modern React architecture.

## 1. Next.js App Router Architecture
- **Server Components by Default**: Treat all components in `app/` as React Server Components (RSC) unless interactivity is strictly required.
- **Client Components (`"use client"`)**: Keep client components at the leaves of the component tree. Only use `"use client"` for components that use hooks (`useState`, `useEffect`, `useTransition`), browser APIs, or event listeners.
- **Data Fetching**: Fetch data in Server Components or Server Actions directly. Avoid unnecessary client-side fetch waterfalls or `useEffect` fetching patterns.
- **Server Actions**: Put mutating logic in `src/app/actions.ts` or co-located action files with `"use server"`. Always handle loading states using `useTransition` or `useActionState`.
- **Navigation & Links**: Always use `next/link` for internal navigation and `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`) for programmatic routing.

## 2. TypeScript & Type Safety
- **No `any`**: Strictly define types for all props, states, API payloads, and database responses. Use `unknown` with type guards if the type is uncertain.
- **Component Props**: Define explicit type aliases or interfaces for component props (e.g. `type ProductCardProps = { item: Item }`).
- **Shared Types**: Keep domain entities and database models synchronized in `types/` or `lib/types.ts`.

## 3. Tailwind CSS & Styling Rules
- **Utility-First**: Use Tailwind utility classes directly. Maintain a clean, logical order (layout -> sizing -> typography -> background/colors -> borders/effects -> states).
- **Responsive Design (Mobile-First)**: Always design mobile-first (`base` -> `sm:` -> `md:` -> `lg:` -> `xl:`).
- **Class Organization**: Use `cn()` (clsx + tailwind-merge) when dynamic conditional classes are required.
- **No Inline Styles**: Avoid inline `style={{}}` unless dynamically calculating pixel values that cannot be handled via Tailwind.

## 4. Clean Code & Maintainability
- **Single Responsibility Principle**: Keep components concise (< 200 lines). Extract complex sub-views into separate reusable components.
- **Custom Hooks**: Extract complex stateful or browser-bound logic into dedicated hooks under `src/hooks/`.
- **Constants & Helpers**: Place reusable utilities, formatting helpers (currency, date), and constants under `src/lib/` or `src/utils/`.
