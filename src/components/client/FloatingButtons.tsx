"use client";

import React, { useState, useEffect } from "react";
import { PhoneCall, X } from "lucide-react";

/**
 * THUỘC TÍNH (PROPS) CỦA NÚT LIÊN HỆ NỔI
 */
interface FloatingButtonsProps {
  // Đường dẫn Zalo liên hệ (Mặc định dẫn tới số hotline: 0901019868)
  zaloUrl?: string;
  // Số điện thoại hotline
  hotline?: string;
  // Giữ lại thuộc tính cũ để tránh cảnh báo TypeScript ở các component khác
  googleMapUrl?: string;
}

/**
 * COMPONENT FLOATING BUTTONS (src/components/client/FloatingButtons.tsx)
 * 
 * Mục đích:
 * Nút hành động nổi ghim gọn gàng ở GÓC DƯỚI BÊN PHẢI màn hình:
 * 1. Trạng thái bình thường: Chỉ hiện 1 icon tròn nhỏ gọn ở góc.
 * 2. Bấm lần 1: Mở rộng ra nút [ 📞 Liên hệ Hotline ] như lúc đầu kèm nút đóng (✕).
 * 3. Bấm lần 2: Mới chính thức mở sang trang chat Zalo (Chống bấm nhầm 100%).
 */
export function FloatingButtons({
  zaloUrl = "https://zalo.me/0901019868",
  hotline = "0901019868",
}: FloatingButtonsProps) {
  // Trạng thái mở rộng thanh dài: false = icon tròn, true = hiện nút Liên hệ Hotline
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Đường dẫn mở chat Zalo chính thức
  const targetZaloUrl = zaloUrl || `https://zalo.me/${hotline.replace(/\s+/g, "")}`;

  // Tự động thu gọn lại icon tròn sau 8 giây nếu khách không bấm tiếp (tránh vướng víu)
  useEffect(() => {
    if (!isExpanded) return;
    const timer = setTimeout(() => setIsExpanded(false), 8000);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  return (
    // Ghim cố định ở GÓC DƯỚI BÊN PHẢI (bottom-5 right-4), z-index cao để luôn nổi trên cùng
    <div className="fixed bottom-5 right-4 z-40">
      
      {/* TRƯỜNG HỢP 1: KHI ĐÃ BẤM MỞ RỘNG (Hiện đúng icon và chữ "Liên hệ Hotline" như lúc đầu) */}
      {isExpanded ? (
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
          
          {/* Nút hành động chính: Có icon PhoneCall và chữ "Liên hệ Hotline" như lúc đầu */}
          <a
            href={targetZaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsExpanded(false)} // Tự thu gọn lại sau khi bấm
            className="flex items-center gap-2 py-2.5 px-4 rounded-full bg-brand-primary text-white text-xs sm:text-sm font-extrabold hover:bg-orange-700 active:scale-95 transition-all shadow-sm"
          >
            {/* Icon điện thoại rung nhẹ */}
            <PhoneCall className="w-4 h-4 text-amber-200 animate-bounce" />
            <span>Liên hệ Hotline</span>
          </a>

          {/* Nút Đóng (✕) nếu khách bấm nhầm hoặc không muốn mở nữa */}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            title="Đóng / Thu gọn"
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* TRƯỜNG HỢP 2: KHI ĐANG THU GỌN (Chỉ hiện 1 icon tròn nhỏ gọn ở góc khoanh đỏ) */
        <button
          type="button"
          onClick={() => setIsExpanded(true)} // Bấm lần 1: Mở ra nút [ 📞 Liên hệ Hotline ]
          title="Liên hệ Hotline Zalo"
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary text-white shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white/80 group"
        >
          {/* Vòng tròn hiệu ứng sóng âm nhấp nháy nhẹ thu hút ánh nhìn */}
          <span className="absolute inset-0 rounded-full bg-brand-primary animate-ping opacity-25" />
          
          {/* Biểu tượng điện thoại */}
          <PhoneCall className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
        </button>
      )}

    </div>
  );
}
