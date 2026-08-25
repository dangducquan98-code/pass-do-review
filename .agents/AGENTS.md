# Project Memory — Bán đồ review

## Tổng quan
Next.js 16 App Router + Supabase: trang pass đồ review (public) + admin PIN + kho ảnh AI (Hermes).

## Vai trò user
BA/Ops (Quân) — ưu tiên bảo mật, UX admin giữ nguyên khi đổi backend.

## Bảo mật (Đợt A — branch upgrade/security-perf)
- Cookie `admin_auth` ký HMAC-SHA256 bằng `ADMIN_PIN` (payload `authenticated.<ts>.<sig>`), expiry 7 ngày.
- `assertAdmin()` đầu mọi server action mutation; Edge `proxy.ts` verify bằng Web Crypto (fail-closed nếu thiếu PIN).
- Write DB/storage dùng `SUPABASE_SERVICE_ROLE_KEY` (`src/lib/supabase-admin.ts`); anon chỉ SELECT public.
- Upload ảnh qua server action `uploadImage` (client vẫn compress + preview).
- AI routes: `assertAiApiKey` fail-closed (thiếu `AI_AGENT_API_KEY` → 503).
- SQL tay: `supabase-migration-security.sql`, `supabase-migration-display-order.sql`.

## Đợt B — P1 optimization (cùng branch)
- Home: select cột UI cần (không `*`); motion storefront → CSS + lightbox `dynamic(ssr:false)`.
- AI `/stats` + `/media`: count head + pagination (`limit`/`offset`, default 50).
- Upload `cacheControl: '31536000'`; index `idx_items_status`.
- Types chung `src/lib/types.ts`; zod validate `addItem`/`editItem` (msg tiếng Việt).
- Login rate limit in-memory: 5 sai / 15 phút / IP (`x-forwarded-for`).
- SEO: `sitemap.ts`, `robots.ts`, `metadataBase` + OG (không og-image trong `public/` → bỏ images).
- Scripts: `typecheck`, `test:e2e`; Playwright project mobile 390×844.

## Env cần có (.env.local — không commit)
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PIN, AI_AGENT_API_KEY
Optional: NEXT_PUBLIC_SITE_URL (fallback `https://pass-do-review.vercel.app`)

## UX admin không đổi
Login PIN, drag-drop thứ tự, upload/preview/xóa ảnh item & AI media.

## Đợt C — P2 cleanup (cùng branch)
- README thực tế (setup, SQL, admin PIN, AI API, Vercel, scripts).
- A11y: lightbox focus trap + dialog; ProductSection tablist/tab/tabpanel + arrows.
- Perf: `SortableAdminListLazy` dynamic import dnd-kit; font token Inter; bỏ padding kép add/edit.
