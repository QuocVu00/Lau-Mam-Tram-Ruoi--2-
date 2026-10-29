# KẾ HOẠCH PHÁT TRIỂN & TRIỂN KHAI WEBSITE HỆ THỐNG "LẨU MẮM TRĂM RƯỠI"

Tài liệu tích hợp Đặc tả Yêu cầu Nghiệp vụ (BRD), Giải pháp Kỹ thuật và Kế hoạch Phân chia Nhiệm vụ cho 2 thành viên phát triển hệ thống website giới thiệu chuỗi nhà hàng, quản lý khuyến mãi và đánh giá thực tế từ khách hàng.

---

## PHẦN 1: ĐẶC TẢ YÊU CẦU NGHIỆP VỤ (BRD)

### 1. Phân hệ Khách hàng (Client-side - Thiết kế Mobile-First)
Giao diện ưu tiên tối đa trải nghiệm trên điện thoại di động (85%+ người dùng truy cập tại bàn ăn hoặc tìm đường).

#### 1.1. Trang chủ (Landing Page)
* **Hero Section:** Giới thiệu câu chuyện thương hiệu "Lẩu Mắm Trăm Rưỡi", điểm nhấn món ăn (đồng giá 150k, hương vị miền Tây, rau đồng tươi sống...).
* **Khu vực Khuyến mãi Toàn hệ thống (Global Promotions):**
  * Hiển thị banner/slider các chương trình khuyến mãi áp dụng cho toàn bộ chuỗi.
  * Tự động ẩn khu vực này nếu không có khuyến mãi nào đang chạy hoặc đã hết hạn.
* **Thực đơn (Menu) lướt nhanh:**
  * Hiển thị bảng giá nồi lẩu và các món gọi thêm (thịt, cá, rau, bún, nước uống...) dạng ảnh trượt ngang để khách tham khảo nhanh.
* **Danh sách Chi nhánh (Branch Directory):**
  * Bộ lọc nhanh theo Quận/Huyện hoặc Tỉnh/Thành.
  * Hiển thị dạng thẻ (Card): Ảnh đại diện cơ sở, Tên chi nhánh, Địa chỉ, Trạng thái (Đang mở cửa/Đóng cửa), **Điểm sao trung bình** (VD: 4.9 ⭐) và **Tổng số bài đánh giá**.

#### 1.2. Trang Chi tiết Chi nhánh
* **Thông tin & Điều hướng:**
  * Địa chỉ, Giờ hoạt động, Album ảnh không gian thực tế của chi nhánh.
  * Nút hành động nổi (Floating Action Buttons): **"Chỉ đường (Google Maps)"** (mở thẳng app bản đồ) và **"Gọi đặt bàn / Zalo"**.
* **Khuyến mãi tại Chi nhánh:** Hiển thị gộp cả khuyến mãi toàn hệ thống và khuyến mãi riêng của chi nhánh đó.
* **Khu vực Đánh giá (Reviews Feed):**
  * **Sắp xếp:** Mặc định ưu tiên bài **Mới nhất lên đầu (Newest First)**.
  * **Bộ lọc nhanh (Tabs):** `Tất cả` | `Có hình ảnh/Video` | `5 sao` | `4 sao` | `3 sao` | `2 sao` | `1 sao`.
  * **Hiển thị bài viết:** Ảnh đại diện + Tên tài khoản MXH của người đăng, thời gian đăng, số sao, nội dung, lưới ảnh/video đính kèm.
  * **Tương tác (Reactions):** Khách xem có thể thả biểu tượng cảm xúc (`Thích`, `Thả tim`, `Thèm chảy nước miếng`...).
* **Chức năng Đăng bài đánh giá:**
  * Yêu cầu định danh 1 chạm (xem chi tiết tại Mục 3).
  * Chọn số sao (1-5), nhập nhận xét, đính kèm ảnh/video quay chụp trực tiếp hoặc từ thư viện máy.

---

### 2. Phân hệ Quản trị (Admin Dashboard)
* **Thống kê Tổng quan (Overview):**
  * Danh sách toàn bộ chi nhánh kèm **Tổng số đánh giá** và **Điểm sao trung bình** của từng nơi.
  * Click vào từng chi nhánh để xem danh sách chi tiết các bài đánh giá của cơ sở đó.
* **Kiểm duyệt Đánh giá (Silent Delete & Shadowban):**
  * Xem chi tiết nội dung, ảnh/video và lượt thả cảm xúc của từng bài.
  * **Chế độ 1 - Ẩn thông minh (Shadowban - Khuyên dùng):** Bài đánh giá bị ẩn khỏi mọi khách hàng khác và không tính vào điểm trung bình của quán. Tuy nhiên, **chính thiết bị/tài khoản của người đăng khi vào lại vẫn nhìn thấy bài của mình** (tránh việc khách biết bị xóa bài gây bức xúc).
  * **Chế độ 2 - Xóa vĩnh viễn (Silent Delete):** Xóa hoàn toàn khỏi giao diện của tất cả mọi người (kể cả người đăng).
  * *Lưu ý:* Cả 2 chế độ đều thực hiện âm thầm, **tuyệt đối không gửi thông báo** cho người dùng, đồng thời tự động tính toán lại Điểm sao trung bình của chi nhánh ngay lập tức.
* **Quản lý Chi nhánh (CRUD):**
  * Thêm chi nhánh mới, chỉnh sửa thông tin, cập nhật ảnh, hoặc chuyển trạng thái (Đang hoạt động / Tạm nghỉ).
* **Quản lý Khuyến mãi:**
  * Tạo chương trình mới: Tiêu đề, banner, nội dung, **Thời gian bắt đầu - Thời gian kết thúc** (Tự động gỡ khi hết hạn).
  * Tùy chọn phạm vi áp dụng: `Toàn hệ thống` hoặc `Tick chọn từng chi nhánh cụ thể`.

---

### 3. Cơ chế Định danh 1 Chạm, Xử lý Camera iPhone & Lưu Phiên 20 Ngày

#### 3.1. Đăng nhập 1 chạm (Zero-Input Authentication)
* Khách hàng **không cần gõ tên, mật khẩu hay số điện thoại**.
* Khi khách bấm vào ô "Viết đánh giá" hoặc bấm "Thả cảm xúc", nếu chưa đăng nhập, hệ thống bật Popup gọn nhẹ với 3 nút: **[Tiếp tục với Zalo]**, **[Tiếp tục với Google]**, **[Tiếp tục với Facebook]**.
* Hệ thống tự động lấy **Tên hiển thị** và **Ảnh đại diện (Avatar)** từ tài khoản mạng xã hội đó để gắn vào bài đánh giá.

#### 3.2. Giải pháp xử lý khi khách quét QR bằng Camera iPhone (iOS)
* **Vấn đề thực tế trên iPhone:**
  1. Nếu QR mở bằng khung xem trước tạm thời (*Captive Portal / In-App WebView*), khách đóng khung đó lại là mất toàn bộ Cookie, và trình duyệt tạm này cũng chưa đăng nhập sẵn Google/Facebook/Zalo.
  2. Nếu dùng tính năng đăng nhập mạng xã hội kiểu bật cửa sổ phụ (`Popup Window`), Safari trên iPhone sẽ **chặn mặc định**, làm khách bấm vào nút đăng nhập mà không thấy gì xảy ra.
  3. Khi khách chọn "Chụp ảnh/Quay video trực tiếp" trong lúc viết bài, tệp ảnh chụp ra có định dạng `.HEIC` và video là `.MOV` (các định dạng độc quyền của Apple).
* **Giải pháp kỹ thuật bắt buộc áp dụng:**
  1. **Ép mở bằng Safari chính thức:** Cấu hình đường dẫn trong mã QR chuẩn `https://` để iOS mở thẳng vào ứng dụng **Safari chính**.
  2. **Sử dụng luồng Redirect OAuth 2.0 (Không dùng Popup):** Chuyển hướng trên cùng 1 tab (Top-level Redirect) kèm tham số `state` lưu URL trang hiện tại hoặc gọi **Universal Link / Deep Link** mở thẳng App Zalo/Facebook -> Khách bấm "Đồng ý" 1 chạm -> Tự động quay lại đúng trang chi nhánh đang xem.
  3. **Tích hợp Google One Tap:** Hiển thị khung "Đăng nhập bằng tên bạn..." ngay góc màn hình nếu Safari của khách có sẵn Gmail.
  4. **Hỗ trợ định dạng Apple (.HEIC / .MOV):** Thẻ chọn file cấu hình chuẩn `<input type="file" accept="image/*,video/*">`, bộ xử lý ngầm đọc và chuyển đổi được đuôi `.HEIC` và `.MOV`.

#### 3.3. Cơ chế Giữ Cookie / IP Thiết bị trong 20 Ngày
* **Lưu trữ đa tầng phía Trình duyệt (Client-side):**
  * **HTTP-Only Cookie (`Max-Age = 1728000` giây = 20 ngày):** Lưu mã phiên đăng nhập (`Session_Token`) an toàn.
  * **LocalStorage & IndexedDB Backup:** Lưu đồng thời mã `Device_Token` vào `LocalStorage`/`IndexedDB` để tự động khôi phục phiên đủ 20 ngày nếu Safari ITP xóa Cookie sau 7 ngày.
* **Lưu trữ & Đối chiếu phía Máy chủ (Server-side):**
  * Lưu bản ghi phiên hoạt động trong Database với hạn sử dụng `Expires_At = Thời điểm hiện tại + 20 ngày`.
  * Ghi nhận kết hợp: `User_ID` + `Device_Fingerprint` + `Địa chỉ IP`.
* **Lưu ý xử lý trùng IP Wifi tại quán:**
  * Không chặn cứng theo riêng IP (vì khách ngồi ăn cùng quán bắt chung 1 mạng Wifi). Chặn spam và giữ phiên dựa trên tổ hợp **(Tài khoản MXH + Cookie Thiết bị)** trong 20 ngày. Địa chỉ IP dùng để phát hiện bot tạo hàng loạt tài khoản ảo trong thời gian ngắn (Rate Limiting).

---

### 4. Tiến trình Ngầm Xử lý Ảnh & Video (Background Media Processing)

| Loại tệp | Quy trình xử lý | Thông số đầu ra |
| :--- | :--- | :--- |
| **Hình ảnh** (JPG, PNG, HEIC) | **Bước 1 (Tại trình duyệt khách):** Nén sơ bộ ngay trên điện thoại trước khi gửi lên mạng để upload cực nhanh.<br>**Bước 2 (Ngầm tại Server):** Chuyển đổi toàn bộ sang định dạng chuẩn web hiện đại, tự động xoay đúng chiều ảnh chụp từ iPhone (EXIF orientation). | - Định dạng: **WebP**<br>- Độ phân giải tối đa: Full HD (1920px)<br>- Dung lượng: **< 250KB / ảnh** |
| **Video** (MP4, MOV) | **Bước 1 (Kiểm tra đầu vào):** Giới hạn thời lượng tối đa 45 giây hoặc dung lượng gốc tối đa 60MB.<br>**Bước 2 (Hàng đợi xử lý ngầm - Queue):** Ngay khi khách bấm đăng, bài viết hiển thị ngay lập tức. Video được đưa vào tiến trình ngầm (Worker/FFmpeg) để nén và chuyển đổi chuẩn phát trực tuyến. Tự động trích xuất 1 ảnh bìa (Thumbnail) từ giây thứ 1 của video. | - Định dạng: **MP4 (H.264)**<br>- Độ phân giải: **720p HD**<br>- Dung lượng giảm **60% - 80%** so với file quay gốc từ iPhone |

---

### 5. Thiết kế Cơ sở Dữ liệu (Database Schema)

1. **Bảng `Users` (Khách hàng đăng nhập 1 chạm):**
   * `id` (PK), `oauth_provider` (`GOOGLE`, `FACEBOOK`, `ZALO`), `oauth_id`, `display_name`, `avatar_url`, `created_at`.
2. **Bảng `User_Sessions` (Quản lý Cookie / IP 20 ngày):**
   * `id` (PK), `user_id` (FK), `cookie_token`, `device_fingerprint`, `ip_address`, `created_at`, `expires_at` (`created_at + 20 days`).
3. **Bảng `Branches` (Chi nhánh):**
   * `id` (PK), `name`, `address`, `district_city`, `google_map_url`, `hotline`, `open_hours`, `cover_images` (JSON), `avg_rating`, `total_reviews`, `status` (`ACTIVE`, `INACTIVE`).
4. **Bảng `Promotions` (Khuyến mãi):**
   * `id` (PK), `title`, `content`, `banner_url`, `scope` (`GLOBAL`, `BRANCH`), `branch_ids` (JSON/Array), `start_at`, `end_at`, `is_active`.
5. **Bảng `Reviews` (Bài đánh giá):**
   * `id` (PK), `branch_id` (FK), `user_id` (FK), `session_id` (FK), `rating` (`1`..`5`), `comment`, `status` (`PUBLIC`, `SHADOW_HIDDEN`, `DELETED`), `created_at`.
6. **Bảng `Review_Media` (Ảnh & Video đính kèm):**
   * `id` (PK), `review_id` (FK), `media_type` (`IMAGE`, `VIDEO`), `file_url`, `thumbnail_url`, `process_status` (`PROCESSING`, `READY`, `FAILED`).
7. **Bảng `Review_Reactions` (Thả biểu tượng cảm xúc):**
   * `id` (PK), `review_id` (FK), `user_id` (FK), `session_id` (FK), `reaction_type` (`LIKE`, `HEART`, `YUM`, `WOW`), `created_at`.

---

## PHẦN 2: PHÂN TÍCH KỸ THUẬT CỐT LÕI & DANH SÁCH API

### 1. Lưu ý Logic Nghiệp vụ Đặc biệt khi Code
* **Câu truy vấn lấy danh sách Review (Xử lý Shadowban):**
  ```sql
  SELECT * FROM Reviews 
  WHERE branch_id = :branchId 
    AND (
      status = 'PUBLIC' 
      OR (status = 'SHADOW_HIDDEN' AND (user_id = :currentUserId OR session_id = :currentSessionId))
    )
  ORDER BY created_at DESC;
  ```
* **Hàm tính lại Điểm trung bình (Trigger/Service):**
  Chỉ tính trên các bản ghi có `status = 'PUBLIC'`. Phải được gọi tự động mỗi khi: (1) Khách tạo review mới, (2) Admin đổi trạng thái review sang `SHADOW_HIDDEN` hoặc `DELETED`, (3) Admin khôi phục review về `PUBLIC`.

### 2. Hợp đồng Giao tiếp API (API Contract)
Hai thành viên sẽ thống nhất cấu trúc JSON trả về của các API sau ngay từ Ngày 1 để làm việc độc lập mà không cần chờ nhau:

* **Nhóm Auth & Session:**
  * `GET /api/auth/:provider/redirect?returnUrl=...` -> Chuyển hướng OAuth.
  * `GET /api/auth/:provider/callback` -> Xử lý kết quả OAuth, set Cookie 20 ngày, trả kèm `device_token`.
  * `POST /api/auth/google-one-tap` -> Đăng nhập nhanh qua credential của Google One Tap.
  * `POST /api/auth/restore-session` -> Nhận `device_token` + `fingerprint` từ LocalStorage để cấp lại HTTP-Only Cookie nếu bị Safari xóa.
  * `GET /api/auth/me` -> Lấy thông tin user & session hiện tại.
* **Nhóm Public (Client-side):**
  * `GET /api/promotions/global` -> Lấy khuyến mãi toàn hệ thống đang trong thời gian hiệu lực (`NOW() BETWEEN start_at AND end_at`).
  * `GET /api/branches?location=...` -> Danh sách chi nhánh + điểm sao + tổng đánh giá.
  * `GET /api/branches/:id` -> Chi tiết 1 chi nhánh + danh sách khuyến mãi gộp (`GLOBAL` + `BRANCH` của chi nhánh đó).
  * `GET /api/branches/:id/reviews?tab=ALL|MEDIA|5|4|3|2|1&page=1` -> Danh sách đánh giá (đã áp dụng bộ lọc Shadowban).
  * `POST /api/reviews` -> Đăng đánh giá mới kèm mảng file media.
  * `POST /api/reviews/:id/reactions` -> Thả / Gỡ biểu tượng cảm xúc.
* **Nhóm Quản trị (Admin Dashboard):**
  * `GET /api/admin/overview` -> Thống kê toàn chuỗi chi nhánh.
  * `GET /api/admin/branches/:id/reviews` -> Xem toàn bộ review của chi nhánh (bao gồm cả bài đã ẩn/xóa và IP/Session của người đăng).
  * `PATCH /api/admin/reviews/:id/moderation` -> Chuyển trạng thái `PUBLIC` | `SHADOW_HIDDEN` | `DELETED` và cập nhật lại điểm chi nhánh.
  * `POST/PUT/DELETE /api/admin/branches` -> CRUD Chi nhánh.
  * `POST/PUT/DELETE /api/admin/promotions` -> CRUD Khuyến mãi.

---

## PHẦN 3: PHÂN CHIA NHIỆM VỤ CHO 2 THÀNH VIÊN (CHỐNG XUNG ĐỘT CODE)

### 1. Nguyên tắc Phân công & Quản lý Source Code (Git Workflow)
Để 2 thành viên làm việc song song tốc độ cao mà **tuyệt đối không bị đè code (Merge Conflict)**:
* **Thành viên A (Backend, Auth, Media Worker & Admin Logic):** Phụ trách toàn bộ phần lõi Server, Database, OAuth2, Tiến trình nén ảnh/video ngầm, và ghép nối chức năng cho trang Admin.
* **Thành viên B (Frontend Mobile-First, Client UX, Nén ảnh Client & Admin UI):** Phụ trách toàn bộ giao diện người dùng Mobile-first, trải nghiệm lướt trang, xử lý Camera/File phía trình duyệt iPhone, lưu trữ LocalStorage/IndexedDB và dựng khung giao diện Admin.
* **Quy tắc phân tách thư mục (Folder Ownership):**
  * Thành viên A chỉ làm việc trong: `/src/server (hoặc /backend)`, `/src/workers`, `/prisma (hoặc /migrations)`, `/src/app/api`.
  * Thành viên B chỉ làm việc trong: `/src/components`, `/src/app/(client)`, `/src/hooks`, `/src/utils/client-media`.
  * Riêng thư mục `/src/app/admin`: **Thành viên B** dựng giao diện tĩnh (UI Components) ở Giai đoạn đầu -> **Thành viên A** vào ghép API ở Giai đoạn cuối. Không ai sửa chung 1 file tại cùng 1 thời điểm.

---

### 2. Bảng Phân công Chi tiết theo 5 Giai đoạn (Sprints)

| Giai đoạn | Thành viên A (Backend, Auth & Media Worker) | Thành viên B (Frontend Mobile-First & Client UX) | Điểm ghép nối (Sync Point) |
| :--- | :--- | :--- | :--- |
| **Giai đoạn 1:<br>Khởi tạo & Nền tảng** | - Khởi tạo Database & viết Migration cho 7 bảng.<br>- Đánh Index các cột truy vấn (`branch_id`, `status`, `cookie_token`, `start_at`, `end_at`).<br>- Viết script Seed Data (tạo sẵn 5 chi nhánh, menu mẫu, 2 khuyến mãi, 20 bài review mẫu).<br>- Định nghĩa chuẩn dữ liệu trả về (Mock API / Swagger). | - Khởi tạo cấu trúc Frontend, cấu hình TailwindCSS/UI System chuẩn Mobile-First.<br>- Thiết kế hệ thống màu sắc thương hiệu "Lẩu Mắm Trăm Rưỡi" (tông ấm, dân dã miền Tây).<br>- Xây dựng các Component dùng chung: Header, Footer, StarRating, Modal, Floating Button. | Thống nhất xong file `api-contract.json` và chạy lệnh Seed DB thành công. |
| **Giai đoạn 2:<br>Khách hàng (Client) & Auth 1 Chạm** | - Xây dựng API OAuth2 Redirect cho **Google, Facebook, Zalo** (lưu `state` để redirect về đúng trang chi nhánh).<br>- Viết API `/auth/restore-session` đối chiếu `device_token` + `fingerprint` và cấp lại `HTTP-Only Cookie` 20 ngày.<br>- Viết các API Public: Lấy KM Global, Danh sách chi nhánh, Chi tiết chi nhánh. | - Code **Trang chủ**: Hero section, Menu trượt ngang, Banner KM Global (tự ẩn khi mảng rỗng), Danh sách Chi nhánh (kèm bộ lọc Quận/Tỉnh).<br>- Code **Trang Chi tiết Chi nhánh**: Album ảnh, Nút nổi Chỉ đường & Gọi Zalo.<br>- Code Popup Đăng nhập 1 chạm + Tích hợp **Google One Tap** + Logic tự động lưu/khôi phục `device_token` từ `LocalStorage` & `IndexedDB`. | Ghép luồng Đăng nhập trên Safari iPhone thật: Bấm login -> Chuyển hướng -> Quay lại đúng trang chi nhánh và giữ phiên. |
| **Giai đoạn 3:<br>Đánh giá (Reviews) & Tương tác** | - Viết API `GET /branches/:id/reviews` tích hợp bộ lọc (`Tất cả`, `Có ảnh/video`, `1-5 sao`) và **logic kiểm tra `SHADOW_HIDDEN`**.<br>- Viết API `POST /reviews` và hàm tự động tính lại `avg_rating`, `total_reviews` của chi nhánh.<br>- Viết API `POST /reviews/:id/reactions` và bộ lọc Rate-limit chống spam (theo `user_id` + `session_id`, không chặn trùng IP Wifi quán). | - Code khu vực **Reviews Feed**: Tabs lọc nhanh, danh sách bài đánh giá, lưới hiển thị ảnh/video (có trạng thái chờ khi video đang xử lý), nút thả cảm xúc (`LIKE`, `HEART`, `YUM`, `WOW`) có hiệu ứng mượt.<br>- Code **Form Viết Đánh giá**: Chọn sao, nhập nội dung, nút mở Camera/Thư viện chuẩn iOS (`accept="image/*,video/*"`). | Test đăng bài đánh giá chữ và thả cảm xúc, kiểm tra điểm sao chi nhánh tự động nhảy đúng. |
| **Giai đoạn 4:<br>Xử lý Ảnh/Video (.HEIC/.MOV) & UI Admin** | - Cài đặt Queue Worker (BullMQ / Background Worker) + `Sharp`/`libheif` + `FFmpeg`.<br>- Xử lý ngầm **Ảnh**: Đọc cả `.HEIC`, tự xoay chiều EXIF, nén sang `WebP < 250KB` (Full HD).<br>- Xử lý ngầm **Video**: Đọc cả `.MOV`/`.MP4`, nén sang `MP4 (H.264) 720p`, cắt 1 ảnh `Thumbnail` ở giây thứ 1, cập nhật trạng thái `READY`. | - Viết bộ xử lý **Media phía Trình duyệt (Client-side)**: Kiểm tra video <= 45s hoặc <= 60MB trước khi cho upload; nén sơ bộ ảnh JPG/PNG ngay trên điện thoại khách để gửi lên cực nhanh.<br>- Dựng toàn bộ **Giao diện tĩnh (UI) cho Admin Dashboard**: Trang Overview, Bảng kiểm duyệt Review, Form CRUD Chi nhánh & Khuyến mãi. | Test lấy iPhone chụp ảnh `.HEIC` và quay video `.MOV` đăng lên: bài hiện ngay lập tức, vài giây sau video nén xong phát mượt mà. |
| **Giai đoạn 5:<br>Hoàn thiện Admin, Kiểm duyệt & Nghiệm thu** | - Viết toàn bộ API Admin (`overview`, `CRUD branches`, `CRUD promotions`, `moderation`).<br>- Ghép API vào giao diện Admin do Thành viên B đã dựng.<br>- Kiểm tra kỹ logic **Shadowban** và **Silent Delete**: đảm bảo ẩn/xóa âm thầm và tính lại điểm sao tức thì. | - Tối ưu hiệu năng Mobile (Lazy load ảnh/video, Skeleton loading, tối ưu tốc độ tải 3G/4G).<br>- Tạo bộ mã QR Code chuẩn `https://` cho từng chi nhánh để in ấn.<br>- Cùng Thành viên A kiểm thử toàn diện (End-to-End Testing) trên iPhone (Safari) và Android (Chrome/Zalo). | Nghiệm thu toàn bộ tính năng, đóng gói và đưa lên môi trường Production. |

---

## PHẦN 4: DANH SÁCH KIỂM TRA NGHIỆM THU (DEFINITION OF DONE)

Trước khi bàn giao hệ thống đưa vào vận hành thực tế tại quán, cả 2 thành viên cần tích chọn (pass) toàn bộ 8 kịch bản kiểm thử sau:

- [ ] **Kịch bản 1 (Quét QR trên iPhone):** Dùng Camera mặc định của iPhone quét mã QR -> Mở thẳng vào Safari chính thức -> Bấm đăng nhập Google/Zalo/Facebook -> Chuyển hướng mượt mà, không bị chặn Popup, quay lại đúng trang chi nhánh vừa xem.
- [ ] **Kịch bản 2 (Lưu phiên 20 ngày):** Sau khi đăng nhập, thử xóa thủ công Cookie trên trình duyệt rồi tải lại trang -> Hệ thống tự động lấy `device_token` từ LocalStorage để khôi phục lại phiên đăng nhập mà không bắt khách đăng nhập lại.
- [ ] **Kịch bản 3 (Chung Wifi tại quán):** Dùng 5 điện thoại khác nhau bắt chung 1 mạng Wifi của quán, đăng đánh giá liên tục -> Hệ thống hoạt động bình thường, không chặn nhầm IP của khách.
- [ ] **Kịch bản 4 (Upload ảnh `.HEIC` và video `.MOV` từ iPhone):** Chọn quay video trực tiếp từ iPhone (30 giây) và chụp 2 tấm ảnh -> Bấm đăng thành công nhanh chóng -> Ảnh hiển thị đúng chiều (không bị xoay ngang), dung lượng ảnh tải về `< 250KB` định dạng `.webp`, video phát trực tuyến mượt ở `720p MP4` và có sẵn ảnh bìa (Thumbnail).
- [ ] **Kịch bản 5 (Kiểm duyệt Shadowban):** Admin bấm nút "Ẩn thông minh (Shadowban)" vào 1 bài đánh giá 1 sao -> Điểm trung bình của chi nhánh tăng lên ngay lập tức -> Mở máy của người đăng bài đó lên xem vẫn thấy bài viết hiển thị bình thường -> Mở máy của khách hàng khác lên xem thì bài đó hoàn toàn biến mất.
- [ ] **Kịch bản 6 (Kiểm duyệt Silent Delete):** Admin bấm "Xóa vĩnh viễn" -> Bài viết biến mất trên mọi thiết bị (kể cả máy người đăng), điểm trung bình tự động tính lại, không có bất kỳ thông báo nào gửi tới người dùng.
- [ ] **Kịch bản 7 (Khuyến mãi tự động):** Tạo 1 khuyến mãi có giờ kết thúc là 5 phút sau -> Trên trang chủ và trang chi nhánh hiển thị banner -> Đúng 5 phút sau tải lại trang, khu vực khuyến mãi tự động ẩn đi mà không cần Admin can thiệp.
- [ ] **Kịch bản 8 (Bộ lọc & Sắp xếp Review):** Các bài đánh giá mới nhất luôn nằm trên cùng; khi bấm vào các tab `Có hình ảnh/Video` hoặc `5 sao`..`1 sao`, danh sách lọc chính xác và phản hồi tức thì.