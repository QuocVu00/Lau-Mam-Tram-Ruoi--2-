"use client";

import React, { useState } from "react";
import { Tag, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * KIỂU DỮ LIỆU CỦA MỘT CHƯƠNG TRÌNH KHUYẾN MÃI
 */
export interface PromotionItem {
  id: string;
  title: string;
  content: string;
  banner_url: string;
  start_at: string | Date;
  end_at: string | Date;
}

interface GlobalPromotionsProps {
  // Danh sách các khuyến mãi đang có hiệu lực
  promotions: PromotionItem[];
}

/**
 * COMPONENT GLOBAL PROMOTIONS (src/components/client/GlobalPromotions.tsx)
 * 
 * Mục đích:
 * Hiển thị Banner/Slider các chương trình khuyến mãi toàn hệ thống.
 * 
 * Yêu cầu đặc tả nghiệp vụ (BRD Mục 1.1):
 * TỰ ĐỘNG ẨN KHU VỰC NÀY nếu mảng promotions rỗng hoặc các chương trình đã hết hạn.
 */
export function GlobalPromotions({ promotions = [] }: GlobalPromotionsProps) {
  // Trạng thái lưu vị trí banner đang hiển thị (slide index)
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Logic lọc thời gian thực: Chỉ lấy các khuyến mãi còn hạn
  const now = new Date();
  const activePromotions = promotions.filter((promo) => {
    const end = new Date(promo.end_at);
    return end >= now;
  });

  // 2. YÊU CẦU BRD BẮT BUỘC: Nếu không có khuyến mãi nào hợp lệ -> Tự động ẩn hoàn toàn (return null)
  if (activePromotions.length === 0) {
    return null;
  }

  // Chuyển sang banner tiếp theo
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activePromotions.length);
  };

  // Quay lại banner trước đó
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activePromotions.length) % activePromotions.length);
  };

  const currentPromo = activePromotions[currentIndex];

  return (
    <section className="py-4 px-4 max-w-4xl mx-auto w-full">
      {/* Tiêu đề mục khuyến mãi */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-brand-primary tracking-wide">
          <Tag className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Ưu Đãi Toàn Chuỗi</span>
        </div>
        
        {/* Số thứ tự banner (ví dụ: 1/2) nếu có nhiều hơn 1 khuyến mãi */}
        {activePromotions.length > 1 && (
          <span className="text-[11px] font-bold text-stone-600">
            {currentIndex + 1} / {activePromotions.length}
          </span>
        )}
      </div>

      {/* Khung hiển thị Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-900 to-brand-primary text-white shadow-mobile">
        
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1.5 flex-1 pr-6">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-stone-900 uppercase">
              Đang diễn ra
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              {currentPromo.title}
            </h3>
            <p className="text-xs text-amber-100/90 leading-relaxed line-clamp-2">
              {currentPromo.content}
            </p>
            {/* Thời hạn chương trình */}
            <div className="flex items-center gap-1.5 text-[11px] text-amber-200/80 pt-1">
              <Calendar className="w-3 h-3" />
              <span>
                Đến hết {new Date(currentPromo.end_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>

        {/* Nút lướt banner trái / phải (chỉ hiện khi có từ 2 banner trở lên) */}
        {activePromotions.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 right-2 flex flex-col gap-1">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Khuyến mãi trước"
              className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Khuyến mãi tiếp theo"
              className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

