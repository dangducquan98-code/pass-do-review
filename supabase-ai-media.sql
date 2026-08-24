-- =========================================================
-- SQL MIGRATION: TẠO BẢNG KHO ẢNH DÀNH CHO AI AGENT (HERMES)
-- Chạy script này trong mục SQL Editor trên Supabase Dashboard
-- =========================================================

-- 1. Tạo bảng ai_media
CREATE TABLE IF NOT EXISTS public.ai_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_posted BOOLEAN NOT NULL DEFAULT FALSE,
    posted_at TIMESTAMPTZ,
    platform TEXT NOT NULL DEFAULT 'threads',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tạo Index để tăng tốc độ truy vấn cho Hermes AI & Admin
CREATE INDEX IF NOT EXISTS idx_ai_media_is_posted ON public.ai_media (is_posted);
CREATE INDEX IF NOT EXISTS idx_ai_media_item_id ON public.ai_media (item_id);
CREATE INDEX IF NOT EXISTS idx_ai_media_created_at ON public.ai_media (created_at DESC);

-- 3. Bật RLS (Row Level Security) và cho phép truy cập
ALTER TABLE public.ai_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phep doc ai_media" ON public.ai_media;
CREATE POLICY "Cho phep doc ai_media" ON public.ai_media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phep them ai_media" ON public.ai_media;
CREATE POLICY "Cho phep them ai_media" ON public.ai_media FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Cho phep cap nhat ai_media" ON public.ai_media;
CREATE POLICY "Cho phep cap nhat ai_media" ON public.ai_media FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Cho phep xoa ai_media" ON public.ai_media;
CREATE POLICY "Cho phep xoa ai_media" ON public.ai_media FOR DELETE USING (true);
