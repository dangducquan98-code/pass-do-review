-- Migration to support multiple images

-- 1. Thêm cột mới `images` kiểu mảng (array) chuỗi (text)
ALTER TABLE items ADD COLUMN images TEXT[] DEFAULT '{}';

-- 2. Di chuyển dữ liệu từ cột `image_url` cũ sang cột `images` mới (nếu có ảnh)
UPDATE items SET images = ARRAY[image_url] WHERE image_url IS NOT NULL AND image_url != '';

-- 3. Xóa cột `image_url` cũ để gọn gàng
ALTER TABLE items DROP COLUMN image_url;
