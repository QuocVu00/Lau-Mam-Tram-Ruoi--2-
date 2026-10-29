import type { Config } from "tailwindcss";

/**
 * CẤU HÌNH TAILWIND CSS (tailwind.config.ts)
 * Thiết lập bảng màu thương hiệu "Lẩu Mắm Trăm Rưỡi" mang hơi thở miền Tây Nam Bộ
 * Tối ưu hóa kích thước màn hình cho trải nghiệm Mobile-First
 */
const config: Config = {
  // 1. Chỉ định các tệp mã nguồn mà Tailwind sẽ quét qua để tìm kiếm các tên class được sử dụng
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 2. Định nghĩa bảng màu độc quyền của Lẩu Mắm Trăm Rưỡi
      colors: {
        brand: {
          // Màu nâu đỏ đậm đặc trưng của nước cốt mắm cá linh, cá sặc
          primary: "#A33A1B",
          // Màu cam đất / vàng cháy biểu tượng cho ngọn lửa nồi lẩu sôi sục
          secondary: "#D96B27",
          // Màu vàng kem ấm cúng của ánh đèn bàn ăn gia đình
          accent: "#F4A261",
          // Màu vàng nhạt của bún tươi và nước dùng
          light: "#FFF8F0",
          // Màu xanh rau đồng (rau muống, bông súng, điên điển, kèo nèo)
          herb: "#3A7D44",
          // Màu nền tối của trang Admin
          dark: "#2A1810",
        },
      },
      // 3. Tối ưu các breakpoint cho thiết bị di động (Mobile First)
      screens: {
        xs: "375px", // Màn hình iPhone cỡ nhỏ (iPhone SE, mini)
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      // 4. Đổ bóng mềm mại cho các thẻ Card và Nút bấm nổi (Floating Button)
      boxShadow: {
        mobile: "0 4px 16px -2px rgba(163, 58, 27, 0.15)",
        floating: "0 8px 24px -4px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

