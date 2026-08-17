---
trigger: always_on
---

# Supabase & Database Architecture Rules (from cursor.directory)

Strict rules for managing data mutations, queries, and security with Supabase in Next.js:

## 1. Query Design & Column Selection
- **Select Explicit Columns**: Prefer selecting explicit columns (e.g. `.select('id, name, sell_price, status, images, display_order')`) rather than `select('*')` on high-traffic public endpoints.
- **Explicit Ordering & Pagination**: Always provide explicit deterministic ordering (e.g. `.order('display_order', { ascending: true })`) to avoid unpredictable server rendering shifts.
- **Error Handling**: Always deconstruct `{ data, error } = await supabase...` and throw or handle errors with informative user-facing alerts.

## 2. Server-Side Execution & Security
- **Service Role Key Security**: NEVER expose `SUPABASE_SERVICE_ROLE_KEY` in client components or browser bundles. Only use service role credentials inside Server Actions or Route Handlers.
- **Server Action Mutations**: Run database inserts, updates, and deletes via Next.js Server Actions (`"use server"`). Call `revalidatePath('/')` or `revalidateTag()` immediately after successful mutations to keep client cache updated.

## 3. Media & Storage Bucket Handling
- **Image Deletions**: When deleting or replacing items, always clean up orphaned files in Supabase Storage buckets.
- **Unique File Names**: Prefix uploaded file paths with UUID or timestamp (`${Date.now()}-${file.name}`) to prevent CDN cache poisoning or overwriting collisions.
