"use client";

import React from "react";
import { Sparkles } from "lucide-react";

/**
 * COMPONENT HERO SECTION (src/components/client/HeroSection.tsx)
 * 
 * Mục đích:
 * Khối giới thiệu mở đầu thương hiệu (đã tinh gọn các nút bấm và icon cam kết theo yêu cầu).
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-[#FFF8F0] to-[#FFF8F0] pt-6 pb-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* 1. Huy hiệu nhận diện đồng giá 150k */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold mb-4 shadow-sm animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
          <span>LẨU MẮM ĐỒNG GIÁ 150K / NỒI</span>
        </div>

        {/* 2. Tiêu đề chính mang âm hưởng ẩm thực miền Tây */}
        <h1 className="text-2xl sm:text-4xl font-black text-brand-primary tracking-tight leading-snug sm:leading-tight mb-3">
          Hương Vị Sông Nước Miền Tây <br />
          <span className="text-brand-secondary">Đậm Đà Tình Quê - Giá Bình Dân</span>
        </h1>

        {/* 3. Lời giới thiệu ngắn gọn */}
        <p className="max-w-md text-xs sm:text-sm text-stone-600 leading-relaxed">
          Nước cốt mắm cá linh cá sặc ủ kỹ, thơm nồng đặc trưng kết hợp cùng mâm rau đồng tươi rói (bông súng, kèo nèo, điên điển). Bữa ăn ấm cúng trọn vẹn bên người thân.
        </p>

      </div>
    </section>
  );
}

