const fs = require("fs");
const path = require("path");

/**
 * SCRIPT TỰ ĐỘNG DỌN DẸP CACHE TRƯỚC KHI CHẠY DEV (scripts/clean-dev.js)
 * 
 * Vấn đề:
 * Khi chuyển đổi giữa lệnh `npm run build` và `npm run dev`, thư mục `.next` chứa các tệp
 * BUILD_ID và manifest đóng gói của môi trường Production.
 * Máy chủ Dev của Next.js khi phát hiện các tệp này sẽ bị nhầm lẫn giữa manifest tĩnh
 * và bộ nạp CSS động trên bộ nhớ, dẫn đến lỗi 404 cho file layout.css (mất CSS toàn trang).
 * 
 * Giải pháp triệt để:
 * Tự động kiểm tra và xóa sạch cache `.next` trước mỗi lần khởi chạy `npm run dev`.
 */
function cleanNextCache() {
  const nextDir = path.join(__dirname, "..", ".next");

  if (fs.existsSync(nextDir)) {
    try {
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log("🧹 [Tự động] Đã dọn sạch cache .next để đảm bảo CSS luôn nạp chuẩn xác 100%.");
    } catch (err) {
      // Nếu file đang bị Windows khóa bởi tiến trình khác, xóa sâu vào thư mục cache
      try {
        const cacheDir = path.join(nextDir, "cache");
        if (fs.existsSync(cacheDir)) {
          fs.rmSync(cacheDir, { recursive: true, force: true });
        }
      } catch (innerErr) {
        // bỏ qua
      }
    }
  }
}

cleanNextCache();

