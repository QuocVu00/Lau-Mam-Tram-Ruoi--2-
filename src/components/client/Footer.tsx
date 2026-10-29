import React from "react";
import { Clock, ShieldCheck } from "lucide-react";

/**
 * COMPONENT FOOTER (src/components/client/Footer.tsx)
 * 
 * Chân trang hiển thị thông tin thương hiệu Lẩu Mắm Trăm Rưỡi (ảnh logo.jpg).
 * Toàn bộ thông tin thuần túy phục vụ thực khách (không chứa luồng Admin).
 */
export function Footer() {
  return (
    <footer className="w-full bg-[#2A1810] text-[#FFF8F0] mt-auto pt-10 pb-20 sm:pb-10 border-t border-amber-900/40">
      <div className="max-w-4xl mx-auto px-4">

        {/* Phần 1: Giới thiệu thương hiệu */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-stone-800">

          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              {/* Logo thương hiệu thực tế */}
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-500/40 shadow-sm bg-white shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.jpg"
                  alt="Logo Lẩu Mắm Trăm Rưỡi"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                LẨU MẮM TRĂM RƯỠI
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Nồi lẩu đồng giá 150k đậm đà tình quê miền Tây Nam Bộ. Nước cốt mắm cá sặc, cá linh kết hợp cùng các loại rau đồng tươi sống.
            </p>
          </div>

          {/* Phần 2: Thời gian hoạt động & Đặt bàn */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-amber-200 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Giờ mở cửa</span>
            </h4>
            <p className="text-xs text-stone-300">
              10:00 - 22:00 (Tất cả các ngày trong tuần)
            </p>
            <p className="text-xs text-stone-400">
              Hotline / Zalo: <span className="text-white font-bold">0988.150.150</span>
            </p>
          </div>

          {/* Phần 3: Cam kết chất lượng minh bạch */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-amber-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Cam kết minh bạch</span>
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              100% đánh giá thực tế từ khách hàng trải nghiệm tại bàn ăn. Luôn nỗ lực đem lại hương vị thơm ngon và sự phục vụ chu đáo nhất.
            </p>
          </div>

        </div>

        {/* Dòng bản quyền */}
        <div className="pt-6 text-center text-[11px] text-stone-400">
          © {new Date().getFullYear()} Lẩu Mắm Trăm Rưỡi. Tự hào ẩm thực dân dã miền Tây.
        </div>

      </div>
    </footer>
  );
}
