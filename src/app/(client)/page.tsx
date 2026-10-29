/**
 * TRANG CHỦ DỰ ÁN (src/app/(client)/page.tsx)
 * Trang hiển thị đầu tiên khi khách hàng truy cập website
 */
export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* Biểu tượng thương hiệu và huy hiệu giá 150k */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-4">
        <span>🍲</span>
        <span>Hệ Thống Lẩu Mắm Trăm Rưỡi</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight mb-3">
        Đậm Đà Vị Quê - Đồng Giá 150K
      </h1>

      <p className="max-w-md text-stone-600 text-sm sm:text-base mb-6 leading-relaxed">
        Hệ thống website đang được thiết lập nền tảng chuẩn mực: Thiết kế Mobile-First, Đăng nhập 1 chạm Zalo/Google, và Đánh giá thực tế từ bàn ăn.
      </p>

      {/* Thẻ trạng thái thông báo khởi tạo thành công */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-mobile max-w-sm w-full text-left">
        <h3 className="font-bold text-stone-800 text-sm mb-2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Cấu trúc dự án đã sẵn sàng!
        </h3>
        <ul className="text-xs text-stone-500 space-y-1.5">
          <li>✓ Next.js App Router + TypeScript</li>
          <li>✓ Tailwind CSS chuẩn màu sắc Lẩu Mắm Trăm Rưỡi</li>
          <li>✓ Phân tách rõ ràng Client - Admin - API - Workers</li>
          <li>✓ Sẵn sàng cho Giai đoạn 1: Database & UI Components</li>
        </ul>
      </div>
    </main>
  );
}

