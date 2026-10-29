import type { Config } from "tailwindcss";

/**
 * CẤU HÌNH TAILWIND CSS (tailwind.config.ts)
 * Thiết lập bảng màu thương hiệu "Lẩu Mắm Trăm Rưỡi" mang hơi thở miền Tây Nam Bộ
 * Tối ưu hóa kích thước màn hình cho trải nghiệm Mobile-First
 */
const config: Config = {
  // Quét toàn bộ mã nguồn bên trong thư mục src để trích xuất đầy đủ CSS classes
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Bảng màu độc quyền của Lẩu Mắm Trăm Rưỡi
      colors: {
        brand: {
          primary: "#A33A1B",   // Nâu đỏ nước cốt mắm cá linh, cá sặc
          secondary: "#D96B27", // Cam đất ngọn lửa nồi lẩu
          accent: "#F4A261",    // Vàng ấm cúng đèn bàn ăn
          light: "#FFF8F0",     // Vàng nhạt bún tươi và nước dùng
          herb: "#3A7D44",      // Xanh rau đồng tươi sống
          dark: "#2A1810",      // Nền tối thanh lịch
        },
      },
      screens: {
        xs: "375px", // Màn hình điện thoại nhỏ
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      boxShadow: {
        mobile: "0 4px 16px -2px rgba(163, 58, 27, 0.15)",
        floating: "0 8px 24px -4px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
