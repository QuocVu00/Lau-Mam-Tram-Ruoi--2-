/**
 * CẤU HÌNH NEXT.JS (next.config.mjs)
 * Điều chỉnh các tính năng cốt lõi của Next.js cho toàn bộ dự án
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Cho phép Next/Image tải và tối ưu ảnh từ các nguồn mạng xã hội (Google, Facebook, Zalo)
  // Phục vụ cho tính năng hiển thị Avatar người dùng và ảnh review
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Ảnh avatar từ Google
      },
      {
        protocol: "https",
        hostname: "graph.facebook.com", // Ảnh avatar từ Facebook
      },
      {
        protocol: "https",
        hostname: "*.zadn.vn", // Ảnh avatar từ Zalo
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Ảnh mẫu dùng cho quá trình phát triển (Seed Data)
      },
    ],
  },
  // 2. Tắt chế độ hiển thị thẻ X-Powered-By trên HTTP Header để bảo mật máy chủ
  poweredByHeader: false,
  // 3. Bật nén phản hồi tĩnh (Gzip/Brotli) giúp tải trang nhanh hơn trên mạng 3G/4G
  compress: true,
};

export default nextConfig;

