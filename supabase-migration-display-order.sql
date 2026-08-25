-- =========================================================
-- MIGRATION: Thêm cột display_order cho sắp xếp kéo-thả admin
-- Chạy tay trên Supabase Dashboard > SQL Editor (idempotent)
-- =========================================================

ALTER TABLE public.items
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_items_display_order
  ON public.items (display_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);

UPDATE public.items
SET display_order = 0
WHERE display_order IS NULL;
