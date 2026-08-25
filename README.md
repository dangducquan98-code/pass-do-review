# Góc Pass Đồ Review

Web bán / pass đồ review (công nghệ, gia dụng): trang public + admin PIN + kho ảnh AI cho bot Hermes.

**Stack:** Next.js 16 (App Router) · React 19 · Supabase · Vercel

## Setup local

```bash
npm install
cp .env.example .env.local   # điền giá trị thật (không commit)
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Biến môi trường (`.env.local`)

| Biến | Ghi chú |
|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (chỉ SELECT public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only — write DB/storage |
| `ADMIN_PIN` | PIN đăng nhập admin |
| `AI_AGENT_API_KEY` | Key cho AI API (`x-api-key`) |
| `NEXT_PUBLIC_SITE_URL` | Optional — canonical/OG (fallback production URL) |

## SQL setup (Supabase Dashboard → SQL Editor)

Chạy lần lượt:

1. `supabase-setup.sql` — bảng `items`, storage, RLS cơ bản  
2. `supabase-ai-media.sql` — bảng `ai_media` (nếu dùng kho ảnh AI)  
3. `supabase-migration-display-order.sql` — cột `display_order` + index  
4. `supabase-migration-security.sql` — RLS: anon chỉ SELECT; write qua service role  

## Admin

- URL: `/admin` → nhập PIN (`ADMIN_PIN`) → `/admin/dashboard`
- Cookie session ký HMAC, hết hạn 7 ngày
- Quản lý kho (kéo-thả thứ tự), thêm/sửa món, kho ảnh AI

## AI API

Auth: header `x-api-key: <AI_AGENT_API_KEY>` (hoặc `Authorization: Bearer …`).  
Thiếu key trên server → `503`; sai/thiếu trên request → `401`.

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `GET` | `/api/ai/stats` | Thống kê total / unposted / posted |
| `GET` | `/api/ai/media` | Danh sách ảnh (`limit`/`offset`, filter status) |
| `GET` | `/api/ai/next-post` | Ảnh chưa đăng tiếp theo |
| `POST` | `/api/ai/mark-posted` | Body `{ id, platform? }` — đánh dấu đã đăng |

## Deploy Vercel

1. Import repo → Framework: Next.js  
2. Set cùng các env như `.env.example` (+ optional `NEXT_PUBLIC_SITE_URL`)  
3. Deploy — production mặc định: `https://pass-do-review.vercel.app`

## Scripts

| Script | Lệnh |
|--------|------|
| Dev | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| E2E | `npm run test:e2e` |
