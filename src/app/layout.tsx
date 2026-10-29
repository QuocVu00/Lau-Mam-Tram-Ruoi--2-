import type { Metadata, Viewport } from "next";
import "./globals.css";

// 1. Cấu hình thẻ meta SEO và tiêu đề hiển thị trên trình duyệt
export const metadata: Metadata = {
  title: "Lẩu Mắm Trăm Rưỡi - Hương Vị Miền Tây Nam Bộ",
  description: "Chuỗi nhà hàng Lẩu Mắm Trăm Rưỡi - Lẩu mắm đồng giá 150k chuẩn vị miền Tây, tươi ngon, đậm đà tình quê hương.",
  keywords: ["lẩu mắm", "lẩu mắm trăm rưỡi", "lẩu miền tây", "rau đồng", "đặc sản miền tây"],
};

// 2. Cấu hình Viewport chuyên biệt cho thiết bị di động (Mobile-First)
// - width=device-width: Tự động vừa vặn theo chiều ngang của màn hình điện thoại
// - initialScale=1: Tỉ lệ hiển thị chuẩn 100% khi vừa mở trang
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Tránh lỗi trình duyệt iOS tự động phóng to bất thường khi khách bấm vào ô nhập dữ liệu
  themeColor: "#A33A1B", // Màu nâu đỏ thương hiệu trên thanh trạng thái (status bar) của điện thoại
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-brand-primary selection:text-white">
        {/* Nội dung trang con (Client hoặc Admin) sẽ được truyền vào đây */}
        {children}
      </body>
    </html>
  );
}

