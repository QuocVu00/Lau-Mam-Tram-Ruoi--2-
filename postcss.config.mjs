/**
 * CẤU HÌNH POSTCSS (postcss.config.mjs)
 * PostCSS là công cụ xử lý CSS, giúp Tailwind CSS và Autoprefixer hoạt động.
 */
export default {
  plugins: {
    // 1. Kích hoạt Tailwind CSS để chuyển các class utility thành mã CSS thực tế
    tailwindcss: {},
    // 2. Tự động thêm các tiền tố trình duyệt (vendor prefixes như -webkit-, -moz-) để CSS chạy tốt trên mọi trình duyệt (đặc biệt là Safari trên iOS)
    autoprefixer: {},
  },
};

