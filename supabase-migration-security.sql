-- =========================================================
-- MIGRATION: Bảo mật RLS — chỉ SELECT public, write qua service role
-- Chạy tay trên Supabase Dashboard > SQL Editor
-- Idempotent: DROP POLICY IF EXISTS trước mỗi CREATE
-- Service role bypass RLS nên KHÔNG cần policy INSERT/UPDATE/DELETE
-- =========================================================

-- ---------------------------------------------------------
-- 1) items: giữ SELECT; gỡ write policies cho anon/authenticated
-- ---------------------------------------------------------
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Public/authenticated read
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.items;
DROP POLICY IF EXISTS "items_select_public" ON public.items;
CREATE POLICY "items_select_public"
  ON public.items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Remove permissive write policies (legacy)
DROP POLICY IF EXISTS "Allow insert from anon" ON public.items;
DROP POLICY IF EXISTS "Allow update from anon" ON public.items;
DROP POLICY IF EXISTS "Allow delete from anon" ON public.items;
DROP POLICY IF EXISTS "items_insert_anon" ON public.items;
DROP POLICY IF EXISTS "items_update_anon" ON public.items;
DROP POLICY IF EXISTS "items_delete_anon" ON public.items;

-- Không tạo policy INSERT/UPDATE/DELETE → anon/authenticated không ghi được.
-- Server dùng SUPABASE_SERVICE_ROLE_KEY (bypass RLS).

-- ---------------------------------------------------------
-- 2) ai_media: tương tự — chỉ SELECT public
-- ---------------------------------------------------------
ALTER TABLE public.ai_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phep doc ai_media" ON public.ai_media;
DROP POLICY IF EXISTS "ai_media_select_public" ON public.ai_media;
CREATE POLICY "ai_media_select_public"
  ON public.ai_media
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Cho phep them ai_media" ON public.ai_media;
DROP POLICY IF EXISTS "Cho phep cap nhat ai_media" ON public.ai_media;
DROP POLICY IF EXISTS "Cho phep xoa ai_media" ON public.ai_media;
DROP POLICY IF EXISTS "ai_media_insert_anon" ON public.ai_media;
DROP POLICY IF EXISTS "ai_media_update_anon" ON public.ai_media;
DROP POLICY IF EXISTS "ai_media_delete_anon" ON public.ai_media;

-- ---------------------------------------------------------
-- 3) storage.objects — bucket item-images
-- Giữ public READ (CDN/public URL); gỡ public UPLOAD/UPDATE/DELETE
-- Upload/xóa chỉ qua service role từ server action
-- ---------------------------------------------------------

-- Public read for item-images (giữ CDN public URL)
DROP POLICY IF EXISTS "Public read item-images" ON storage.objects;
DROP POLICY IF EXISTS "item_images_select_public" ON storage.objects;
CREATE POLICY "item_images_select_public"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'item-images');

-- Remove public write policies (legacy + common names)
DROP POLICY IF EXISTS "Allow public uploads to item-images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update item-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete item-images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload item-images" ON storage.objects;
DROP POLICY IF EXISTS "Public update item-images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete item-images" ON storage.objects;
DROP POLICY IF EXISTS "item_images_insert_public" ON storage.objects;
DROP POLICY IF EXISTS "item_images_update_public" ON storage.objects;
DROP POLICY IF EXISTS "item_images_delete_public" ON storage.objects;

-- Không tạo policy INSERT/UPDATE/DELETE cho storage.objects trên bucket này.
-- App upload qua supabaseAdmin (service role) trong server action uploadImage.

-- Đảm bảo bucket vẫn public cho READ (nếu đang private, bật public trong Dashboard
-- Storage > item-images > Public bucket = ON, hoặc giữ signed URL nếu chọn private).
-- Phương án khuyến nghị: Public bucket + RLS chỉ cho SELECT → URL CDN vẫn hoạt động.
