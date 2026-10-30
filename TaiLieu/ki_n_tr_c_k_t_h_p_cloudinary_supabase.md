# Hướng dẫn Triển khai Kiến trúc: Cloudinary (Media) + Supabase (Database/Auth)

Tài liệu này tổng hợp chiến lược sử dụng kết hợp Cloudinary để quản lý hình ảnh/media và Supabase để quản lý Database/Xác thực người dùng (Auth). Đây là một kiến trúc hiện đại, tối ưu hiệu suất và chi phí giai đoạn đầu.

## 1. Tổng quan Kiến trúc

*   **Supabase (BaaS):** Xử lý Database (PostgreSQL), Xác thực người dùng (Authentication), và Logic Backend (Edge Functions).
*   **Cloudinary (Media & CDN):** Chuyên đảm nhận việc nhận file upload, tự động tối ưu hóa (resize, compress, convert sang WebP/AVIF), lưu trữ và phân phối file qua mạng lưới CDN toàn cầu.

## 2. Ưu điểm nổi bật

*   **Chi phí khởi điểm $0:** Tận dụng hoàn hảo gói Free của cả hai dịch vụ. Bạn có một hệ thống chuẩn Enterprise mà không tốn phí ban đầu.
*   **Hiệu suất (Performance) tối đa:** Hình ảnh được nén cực nhẹ và load nhanh qua CDN. Database của Supabase chỉ phải xử lý chuỗi văn bản (text) nên tốc độ truy vấn chớp nhoáng.
*   **Giảm tải cho Server/Database:** Database không bao giờ bị phình to hoặc giật lag do phải gánh các file Binary nặng nề.

## 3. Luồng hoạt động (Workflow) chuẩn

Quá trình từ lúc người dùng tải ảnh lên đến khi hiển thị diễn ra theo 4 bước:

1.  **Xác thực (Auth):** Người dùng đăng nhập vào ứng dụng (quản lý bởi Supabase Auth).
2.  **Upload lên Cloudinary:** 
    *   Client (Frontend) gửi file ảnh trực tiếp lên Cloudinary.
    *   *Lưu ý bảo mật:* Nên gọi một API/Edge Function của Supabase để lấy chữ ký (Signature) trước, sau đó mới dùng chữ ký này đẩy ảnh lên Cloudinary (Signed Upload).
3.  **Lưu vào Database:**
    *   Cloudinary xử lý xong sẽ trả về một `secure_url` (VD: `https://res.cloudinary.com/demo/image/upload/v1/user_avatar.jpg`).
    *   Frontend lấy chuỗi URL này và tiến hành lưu (INSERT/UPDATE) vào bảng tương ứng trong Database của Supabase.
4.  **Truy xuất và Hiển thị:**
    *   Khi cần hiển thị, ứng dụng query từ Supabase để lấy chuỗi URL.
    *   Gắn URL vào thẻ `<img>` trên Frontend. Trình duyệt sẽ tải ảnh siêu tốc qua CDN của Cloudinary.

## 4. Các điểm "Tử huyệt" Kỹ thuật cần lưu ý

Để hệ thống chạy ổn định và không phát sinh chi phí ngoài ý muốn, cần xử lý 2 vấn đề sau:

### A. Đồng bộ xóa (Tránh "Rác" dữ liệu)
*   **Vấn đề:** Khi một bản ghi (record) trong Supabase bị xóa (VD: xóa bài viết, xóa user), cái ảnh nằm trên Cloudinary không tự động biến mất. Để lâu sẽ ngốn sạch dung lượng lưu trữ của gói Free.
*   **Giải pháp:** Viết một Trigger hoặc sử dụng Supabase Edge Functions / Webhooks. Khi dữ liệu trong Supabase bị xóa, hàm này sẽ kích hoạt API của Cloudinary (dùng Admin API) để tìm và xóa file media tương ứng.

### B. Bảo mật Upload (Signed Uploads)
*   **Vấn đề:** Nếu dùng Unsigned Upload, bất kỳ ai dò được thông tin tài khoản Cloudinary của bạn đều có thể spam up ảnh rác làm cạn kiệt Credit.
*   **Giải pháp:** Bắt buộc sử dụng **Signed Upload**. Mọi request upload lên Cloudinary đều phải được ký duyệt từ một nguồn an toàn (ví dụ thông qua Supabase Edge Function).

## 5. Lộ trình Mở rộng (Scaling & Cost Management)

Khi ứng dụng của bạn vượt quá giới hạn gói Free (đặc biệt là giới hạn 25 Credits ~ 25GB của Cloudinary), hãy cân nhắc lộ trình sau:

*   **Giai đoạn 1 (Khởi động):** Supabase (Free) + Cloudinary (Free). Tuyệt vời để MVP (Minimum Viable Product).
*   **Giai đoạn 2 (Tăng trưởng nhẹ):** Nâng cấp Supabase lên gói Pro ($25/tháng) nếu Database hoặc Auth vượt giới hạn. Giữ nguyên Cloudinary nếu lượng media chưa quá nhiều.
*   **Giai đoạn 3 (Bùng nổ Traffic Media):** Nếu băng thông ảnh/video vượt 25GB, chi phí nâng cấp Cloudinary ($89/tháng) có thể hơi "chát". 
    *   **Phương án đổi chiều:** Lúc này, chuyển luồng upload sang lưu trữ gốc (Raw Storage) tại Supabase Storage hoặc AWS S3/Cloudflare R2 (giá siêu rẻ). 
    *   Sử dụng một dịch vụ CDN/Image Optimizer giá rẻ hơn (như BunnyCDN hoặc ImageKit) để kết nối vào Storage gốc và phân phối ảnh. Việc thay đổi này không làm ảnh hưởng đến cấu trúc text đã lưu trong Database.