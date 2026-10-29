"use client";

import React from "react";
import { MapPin, PhoneCall } from "lucide-react";

/**
 * THUỘC TÍNH (PROPS) CỦA NÚT HÀNH ĐỘNG NỔI
 */
interface FloatingButtonsProps {
  // Số điện thoại hotline của chi nhánh (VD: "0901234567")
  hotline?: string;
  // Đường dẫn mở ứng dụng Google Maps chỉ đường trực tiếp
  googleMapUrl?: string;
}

/**
 * COMPONENT FLOATING BUTTONS (src/components/client/FloatingButtons.tsx)
 * 
 * Mục đích:
 * Hai nút hành động quan trọng nhất của khách hàng khi ăn tại quán:
 * 1. "Chỉ đường (Maps)": Mở thẳng ứng dụng Google Maps trên điện thoại để tìm đường tới quán.
 * 2. "Gọi đặt bàn / Zalo": Chạm 1 cái là gọi điện thoại trực tiếp hoặc mở Zalo chi nhánh.
 * Cố định ở đáy màn hình điện thoại (Floating Action Buttons).
 */
export function FloatingButtons({
  hotline = "0988150150",
  googleMapUrl = "https://maps.google.com",
}: FloatingButtonsProps) {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 sm:hidden pointer-events-none">
      {/* Khung chứa nổi: Cho phép các nút bên trong nhận sự kiện click */}
      <div className="max-w-md mx-auto grid grid-cols-2 gap-3 pointer-events-auto">
        
        {/* Nút 1: Chỉ đường qua Google Maps */}
        <a
          href={googleMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-stone-200/80 text-stone-800 font-bold text-sm shadow-floating active:scale-95 transition-all"
        >
          <MapPin className="w-4 h-4 text-brand-primary" />
          <span>Chỉ đường</span>
        </a>

        {/* Nút 2: Gọi điện / Zalo Đặt bàn ngay */}
        <a
          href={`tel:${hotline.replace(/\s+/g, "")}`}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-primary text-white font-bold text-sm shadow-floating active:scale-95 transition-all"
        >
          <PhoneCall className="w-4 h-4 text-amber-200 animate-bounce" />
          <span>Gọi đặt bàn</span>
        </a>

      </div>
    </div>
  );
}

