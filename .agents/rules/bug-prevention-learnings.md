# Bug Prevention, Known Gotchas & Lessons Learned (Dự án Bán Đồ Review)

Quy tắc cốt lõi: **GHI NHỚ TẤT CẢ LỖI ĐÃ TỪNG GẶP VÀ TUYỆT ĐỐI KHÔNG TÁI DIỄN KHI VIẾT CODE HOẶC TÍNH NĂNG MỚI.**

---

## 1. Điều Hướng Tab & Lọc Dữ Liệu (Tab Switching & Routing)
- **Lỗi đã gặp:** 
  - Dùng `<Link href="/?tab=sold#hash">` dẫn đến lỗi phải click 2 lần (lần 1 trình duyệt bắt hash navigation, lần 2 mới tải).
  - Dùng server-side query params cho Tab khi dữ liệu đã có sẵn trên trang gây độ trễ mạng (300ms - 500ms), người dùng tưởng web bị đơ nên bấm nhiều lần liên tiếp.
- **Quy tắc bắt buộc:**
  - Khi danh sách sản phẩm đã được tải về Client, chuyển Tab phải sử dụng **Client State (`useState`)** để đổi giao diện tức thì trong **0ms**.
  - Đồng bộ URL ngầm bằng `window.history.replaceState` để giữ liên kết chia sẻ mà không kích hoạt RSC refetch làm đơ UI.
  - Không bao giờ thêm thẻ neo `#hash` vào `Link` có kèm query params trong Next.js App Router.

---

## 2. Đồng Bộ State Kéo Thả & Cập Nhật Lạc Quan (Dnd-Kit & Optimistic UI)
- **Lỗi đã gặp:** 
  - `SortableAdminList` dùng `useState(initialItems)` nên khi `SortableRow` đổi trạng thái sản phẩm và gọi `router.refresh()`, component con không render lại ngay khiến cột trạng thái bị đứng yên.
- **Quy tắc bắt buộc:**
  - Luôn cập nhật state lạc quan (Optimistic UI Update) ngay tại Client thông qua callback `onStatusChange` và `onDelete` trước khi server action hoàn tất (phản hồi 0.01s).
  - Luôn có `useEffect(() => { setItems(initialItems) }, [initialItems])` để đồng bộ lại khi props từ server thay đổi.

---

## 3. Thiết Kế Mobile-First & Chống Tràn Màn Hình (Mobile Layouts)
- **Lỗi đã gặp:**
  - Dùng thẻ `<table>` với `min-w-[600px]` ở trang Admin làm tràn màn hình điện thoại, người dùng phải cuộn ngang để bấm nút sửa/xóa.
  - Bố cục sản phẩm 1 cột ngang trên mobile làm ảnh bị bé (110px) và ép chữ chật chội.
- **Quy tắc bắt buộc:**
  - Trang danh sách Admin trên mobile phải dùng **Flexbox Card Row** linh hoạt (`flex items-center gap-3 p-3 bg-white rounded-2xl`).
  - Trang bán hàng cho khách trên mobile phải ưu tiên **2-Column Grid** (`grid grid-cols-2 gap-3`) với ảnh vuông `aspect-square` tràn viền đẹp mắt.
  - Vùng chạm cảm ứng (Touch targets) cho mọi nút bấm tối thiểu **44x44px** hoặc có padding đủ lớn.

---

## 4. Tương Tác Cảm Ứng & Tránh Ẩn Nút Trên Mobile (Touch vs Hover)
- **Lỗi đã gặp:**
  - Nút xóa ảnh dùng `opacity-0 group-hover:opacity-100`, trên màn hình cảm ứng điện thoại không có chuột rê (hover) nên nút xóa bị tàng hình.
- **Quy tắc bắt buộc:**
  - Với các nút quan trọng trên mobile, luôn đặt `opacity-90 sm:opacity-0 group-hover:opacity-100` để trên điện thoại luôn hiển thị rõ ràng, trên máy tính mới ẩn khi không hover.

---

## 5. Chống Phóng To Tự Động Trên iOS Safari (Input Zoom Bug)
- **Lỗi đã gặp:**
  - Thẻ `<input>` và `<select>` dùng cỡ chữ nhỏ hơn 16px (như 12px, 14px) khiến trình duyệt Safari trên iPhone tự động phóng to (zoom in) màn hình khi gõ phím.
- **Quy tắc bắt buộc:**
  - Mọi thẻ `<input>`, `<select>`, `<textarea>` luôn đặt cỡ chữ cơ sở từ 16px: `text-base sm:text-sm`.

---

## 6. Tối Ưu Hình Ảnh Đỉnh Cao (Image Performance)
- **Quy tắc bắt buộc:**
  - Trong `next.config.ts` luôn bật `formats: ['image/avif', 'image/webp']` và `minimumCacheTTL: 2592000` (30 ngày).
  - Ảnh hàng đầu (top 4) phải có `priority={true}` để sub-second LCP.
  - Tất cả ảnh nén trước khi upload lên Supabase Storage qua `browser-image-compression` (chuẩn webp, max 600KB, max 1600px).
  - Khi xóa hoặc sửa sản phẩm, luôn gọi hàm dọn rác ảnh mồ côi trên Supabase Storage bucket `item-images`.
