# KẾ HOẠCH PHÁT TRIỂN WEBSITE HỆ THỐNG "LẨU MẮM TRĂM RƯỠI"

Tài liệu đặc tả yêu cầu nghiệp vụ (BRD) và giải pháp kỹ thuật cho hệ thống website giới thiệu chuỗi nhà hàng, quản lý khuyến mãi và đánh giá thực tế từ khách hàng.

---

## 1. Phân hệ Khách hàng (Client-side - Thiết kế Mobile-First)

Giao diện ưu tiên tối đa trải nghiệm trên điện thoại di động (85%+ người dùng truy cập tại bàn ăn hoặc tìm đường).

### 1.1. Trang chủ (Landing Page)
* **Hero Section:** Giới thiệu câu chuyện thương hiệu "Lẩu Mắm Trăm Rưỡi", điểm nhấn món ăn (đồng giá 150k, hương vị miền Tây, rau đồng tươi sống...).
* **Khu vực Khuyến mãi Toàn hệ thống (Global Promotions):**
  * Hiển thị banner/slider các chương trình khuyến mãi áp dụng cho toàn bộ chuỗi.
  * Tự động ẩn khu vực này nếu không có khuyến mãi nào đang chạy hoặc đã hết hạn.
* **Thực đơn (Menu) lướt nhanh:**
  * Hiển thị bảng giá nồi lẩu và các món gọi thêm (thịt, cá, rau, bún, nước uống...) dạng ảnh trượt ngang để khách tham khảo nhanh.
* **Danh sách Chi nhánh (Branch Directory):**
  * Bộ lọc nhanh theo Quận/Huyện hoặc Tỉnh/Thành.
  * Hiển thị dạng thẻ (Card): Ảnh đại diện cơ sở, Tên chi nhánh, Địa chỉ, Trạng thái (Đang mở cửa/Đóng cửa), **Điểm sao trung bình** (VD: 4.9 ⭐) và **Tổng số bài đánh giá**.

### 1.2. Trang Chi tiết Chi nhánh
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

## 2. Phân hệ Quản trị (Admin Dashboard)

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

## 3. Cơ chế Định danh 1 Chạm, Xử lý Camera iPhone & Lưu Phiên 20 Ngày

### 3.1. Đăng nhập 1 chạm (Zero-Input Authentication)
* Khách hàng **không cần gõ tên, mật khẩu hay số điện thoại**.
* Khi khách bấm vào ô "Viết đánh giá" hoặc bấm "Thả cảm xúc", nếu chưa đăng nhập, hệ thống bật Popup gọn nhẹ với 3 nút: **[Tiếp tục với Zalo]**, **[Tiếp tục với Google]**, **[Tiếp tục với Facebook]**.
* Hệ thống tự động lấy **Tên hiển thị** và **Ảnh đại diện (Avatar)** từ tài khoản mạng xã hội đó để gắn vào bài đánh giá.

### 3.2. Giải pháp xử lý khi khách quét QR bằng Camera iPhone (iOS)
Khi khách ngồi tại quán và dùng ứng dụng **Camera mặc định của iPhone** để quét mã QR trên bàn:

* **Vấn đề thực tế trên iPhone:**
  1. Nếu QR mở bằng khung xem trước tạm thời (*Captive Portal / In-App WebView*), khách đóng khung đó lại là mất toàn bộ Cookie, và trình duyệt tạm này cũng chưa đăng nhập sẵn Google/Facebook/Zalo.
  2. Nếu dùng tính năng đăng nhập mạng xã hội kiểu bật cửa sổ phụ (`Popup Window`), Safari trên iPhone sẽ **chặn mặc định**, làm khách bấm vào nút đăng nhập mà không thấy gì xảy ra.
  3. Khi khách chọn "Chụp ảnh/Quay video trực tiếp" trong lúc viết bài, iOS có thể hỏi quyền truy cập Camera của trình duyệt, hoặc tệp ảnh chụp ra có định dạng `.HEIC` và video là `.MOV` (các định dạng độc quyền của Apple).

* **Giải pháp kỹ thuật bắt buộc áp dụng:**
  1. **Ép mở bằng Safari chính thức:** Cấu hình đường dẫn trong mã QR chuẩn `https://` để iOS mở thẳng vào ứng dụng **Safari chính** (nơi khách đã đăng nhập sẵn tài khoản Google/Facebook trong máy).
  2. **Sử dụng luồng Redirect OAuth 2.0 (Không dùng Popup):** Khi khách bấm đăng nhập Google/Facebook/Zalo, trang web sẽ chuyển hướng trên cùng 1 tab (Top-level Redirect) hoặc gọi **Universal Link / Deep Link** để mở thẳng App Zalo/Facebook có sẵn trên iPhone -> Khách bấm "Đồng ý" 1 chạm -> Tự động quay lại đúng trang chi nhánh đang xem.
  3. **Tích hợp Google One Tap:** Hiển thị khung "Đăng nhập bằng tên bạn..." ngay góc màn hình nếu Safari của khách có sẵn Gmail, chỉ cần 1 cú chạm duy nhất không cần chuyển trang.
  4. **Hỗ trợ định dạng Apple (.HEIC / .MOV):** Thẻ chọn file trên web cấu hình chuẩn `<input type="file" accept="image/*,video/*">` để iOS cho phép khách chọn **"Chụp ảnh/Quay video"** trực tiếp hoặc lấy từ **"Thư viện ảnh"**, đồng thời bộ xử lý ngầm phải đọc và chuyển đổi được đuôi `.HEIC` và `.MOV`.

### 3.3. Cơ chế Giữ Cookie / IP Thiết bị trong 20 Ngày
Để đảm bảo khách quét mã lần đầu chỉ cần chạm đăng nhập 1 lần, trong 20 ngày tiếp theo vào lại web (hoặc sang chi nhánh khác) vẫn giữ nguyên phiên đăng nhập và kiểm soát chống spam:

* **Lưu trữ đa tầng phía Trình duyệt (Client-side):**
  * **HTTP-Only Cookie (`Max-Age = 1728000` giây = 20 ngày):** Lưu mã phiên đăng nhập (`Session_Token`) an toàn.
  * **LocalStorage & IndexedDB Backup:** Do cơ chế chống theo dõi của Apple (Safari ITP) đôi khi tự xóa Cookie nếu khách không vào lại web sau 7 ngày, hệ thống sẽ lưu đồng thời một mã `Device_Token` vào `LocalStorage` của máy để tự động khôi phục phiên đủ 20 ngày.
* **Lưu trữ & Đối chiếu phía Máy chủ (Server-side):**
  * Lưu bản ghi phiên hoạt động trong Database với hạn sử dụng `Expires_At = Thời điểm hiện tại + 20 ngày`.
  * Ghi nhận kết hợp: `User_ID` + `Device_Fingerprint` (Mã nhận diện trình duyệt) + `Địa chỉ IP`.
* **Lưu ý xử lý trùng IP Wifi tại quán:**
  * Nhiều khách ngồi ăn cùng quán sẽ bắt chung 1 mạng Wifi của quán (dẫn đến **trùng địa chỉ IP**).
  * Do đó, hệ thống **không chặn cứng theo riêng IP**, mà chặn spam và giữ phiên dựa trên tổ hợp **(Tài khoản MXH + Cookie Thiết bị)** trong 20 ngày. Địa chỉ IP được lưu kèm để Admin phát hiện nếu có 1 IP lạ từ nơi khác cố tình tạo hàng loạt tài khoản ảo trong thời gian ngắn (Rate Limiting).

---

## 4. Tiến trình Ngầm Xử lý Ảnh & Video (Background Media Processing)

Đảm bảo khách hàng bấm "Đăng" là hoàn tất nhanh chóng, không làm nặng máy chủ và không tốn băng thông khi người khác lướt xem.

| Loại tệp | Quy trình xử lý | Thông số đầu ra |
| :--- | :--- | :--- |
| **Hình ảnh** (JPG, PNG, HEIC) | **Bước 1 (Tại trình duyệt khách):** Nén sơ bộ ngay trên điện thoại trước khi gửi lên mạng để upload cực nhanh.<br>**Bước 2 (Ngầm tại Server):** Chuyển đổi toàn bộ sang định dạng chuẩn web hiện đại, tự động xoay đúng chiều ảnh chụp từ iPhone (EXIF orientation). | - Định dạng: **WebP**<br>- Độ phân giải tối đa: Full HD (1920px)<br>- Dung lượng: **< 250KB / ảnh** |
| **Video** (MP4, MOV) | **Bước 1 (Kiểm tra đầu vào):** Giới hạn thời lượng tối đa 45 giây hoặc dung lượng gốc tối đa 60MB.<br>**Bước 2 (Hàng đợi xử lý ngầm - Queue):** Ngay khi khách bấm đăng, bài viết hiển thị ngay lập tức. Video được đưa vào tiến trình ngầm (Worker/FFmpeg) để nén và chuyển đổi chuẩn phát trực tuyến. Tự động trích xuất 1 ảnh bìa (Thumbnail) từ giây thứ 1 của video. | - Định dạng: **MP4 (H.264)**<br>- Độ phân giải: **720p HD**<br>- Dung lượng giảm **60% - 80%** so với file quay gốc từ iPhone |

---

## 5. Thiết kế Cơ sở Dữ liệu (Database Schema)

### Bảng 1: `Users` (Khách hàng đăng nhập 1 chạm)
* `id` (PK): Mã người dùng
* `oauth_provider`: Nguồn đăng nhập (`GOOGLE`, `FACEBOOK`, `ZALO`)
* `oauth_id`: Mã định danh từ MXH
* `display_name`: Tên hiển thị của khách
* `avatar_url`: Ảnh đại diện MXH
* `created_at`: Ngày tham gia lần đầu

### Bảng 2: `User_Sessions` (Quản lý Cookie / IP 20 ngày)
* `id` (PK): Mã phiên
* `user_id` (FK): Liên kết bảng `Users`
* `cookie_token`: Mã token lưu ở trình duyệt khách
* `device_fingerprint`: Mã nhận diện thiết bị/trình duyệt (User-Agent, OS...)
* `ip_address`: Địa chỉ IP lúc đăng nhập/tương tác
* `created_at`: Thời điểm tạo phiên
* `expires_at`: Thời điểm hết hạn (`created_at + 20 days`)

### Bảng 3: `Branches` (Chi nhánh)
* `id` (PK): Mã chi nhánh
* `name`: Tên chi nhánh
* `address`: Địa chỉ hiển thị
* `google_map_url`: Link dẫn đường Google Maps
* `hotline`: Số điện thoại/Zalo chi nhánh
* `open_hours`: Giờ mở cửa (VD: 10:00 - 22:00)
* `cover_images`: Danh sách ảnh chi nhánh
* `avg_rating`: Điểm sao trung bình (Tự động tính lại khi có review mới hoặc khi Admin xóa/ẩn bài)
* `total_reviews`: Tổng số đánh giá hợp lệ đang hiển thị
* `status`: Trạng thái (`ACTIVE`, `INACTIVE`)

### Bảng 4: `Promotions` (Khuyến mãi)
* `id` (PK): Mã khuyến mãi
* `title`: Tiêu đề chương trình
* `content`: Nội dung chi tiết
* `banner_url`: Ảnh banner khuyến mãi
* `scope`: Phạm vi (`GLOBAL` - Toàn hệ thống, `BRANCH` - Theo chi nhánh)
* `branch_ids`: Mảng ID các chi nhánh áp dụng (nếu `scope = BRANCH`)
* `start_at`: Ngày giờ bắt đầu
* `end_at`: Ngày giờ kết thúc (Quá giờ này tự động ẩn)
* `is_active`: Bật/Tắt thủ công

### Bảng 5: `Reviews` (Bài đánh giá)
* `id` (PK): Mã bài đánh giá
* `branch_id` (FK): Đánh giá cho chi nhánh nào
* `user_id` (FK): Người đăng
* `session_id` (FK): Phiên thiết bị/IP lúc đăng (phục vụ kiểm tra và Shadowban)
* `rating`: Số sao (`1` đến `5`)
* `comment`: Nội dung đánh giá
* `status`: Trạng thái hiển thị:
  * `PUBLIC`: Hiển thị cho tất cả mọi người.
  * `SHADOW_HIDDEN`: Chỉ người đăng (`user_id` hoặc `cookie_token` trùng khớp) mới thấy, khách khác không thấy, không tính vào điểm sao tổng.
  * `DELETED`: Xóa hoàn toàn, không ai thấy (kể cả người đăng), không tính vào điểm sao tổng.
* `created_at`: Thời gian đăng bài (Dùng để sắp xếp mới nhất)

### Bảng 6: `Review_Media` (Ảnh & Video đính kèm)
* `id` (PK): Mã tệp media
* `review_id` (FK): Thuộc bài đánh giá nào
* `media_type`: Phân loại (`IMAGE`, `VIDEO`)
* `file_url`: Đường dẫn tệp sau khi đã nén xong
* `thumbnail_url`: Ảnh thu nhỏ (dành cho Video)
* `process_status`: Trạng thái xử lý ngầm (`PROCESSING`, `READY`, `FAILED`)

### Bảng 7: `Review_Reactions` (Thả biểu tượng cảm xúc)
* `id` (PK): Mã lượt thả cảm xúc
* `review_id` (FK): Bài đánh giá được thả
* `user_id` (FK): Người thả cảm xúc (hoặc định danh theo `session_id`)
* `reaction_type`: Loại biểu tượng (`LIKE`, `HEART`, `YUM`, `WOW`)
* `created_at`: Thời gian tương tác