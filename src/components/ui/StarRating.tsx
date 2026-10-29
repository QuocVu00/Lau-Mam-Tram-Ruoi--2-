"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ĐỊNH NGHĨA CÁC THUỘC TÍNH (PROPS) CHO COMPONENT STARRATING
 */
interface StarRatingProps {
  // Điểm số sao hiện tại (từ 1 đến 5, có thể là số thập phân như 4.8 khi hiển thị)
  rating: number;
  // Hàm callback kích hoạt khi người dùng bấm chọn số sao (chỉ dùng khi interactive = true)
  onRatingChange?: (rating: number) => void;
  // Chế độ cho phép người dùng click để đánh giá hay chỉ để xem (mặc định: false - chỉ xem)
  interactive?: boolean;
  // Kích thước của ngôi sao: "sm" (nhỏ), "md" (vừa), "lg" (lớn)
  size?: "sm" | "md" | "lg";
  // Tùy chọn hiển thị chữ số điểm đi kèm bên cạnh (VD: "4.9")
  showScore?: boolean;
}

/**
 * COMPONENT STARRATING (src/components/ui/StarRating.tsx)
 * 
 * Mục đích:
 * 1. Hiển thị điểm số sao đánh giá (dành cho Thẻ chi nhánh & Danh sách review).
 * 2. Cho phép khách hàng chạm tay vào để chọn từ 1 đến 5 sao (dành cho Form đánh giá).
 */
export function StarRating({
  rating,
  onRatingChange,
  interactive = false,
  size = "md",
  showScore = false,
}: StarRatingProps) {
  // Trạng thái lưu số sao tạm thời khi người dùng rê chuột/di ngón tay qua (hover effect)
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Bản đồ kích thước (pixel) của ngôi sao
  const sizeMap = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  return (
    <div className="inline-flex items-center gap-1">
      {/* Vòng lặp tạo ra đúng 5 ngôi sao (đánh số từ 1 đến 5) */}
      {[1, 2, 3, 4, 5].map((starIndex) => {
        // Điểm sao thực tế cần so sánh: Ưu tiên điểm đang hover, nếu không thì lấy rating gốc
        const currentDisplayRating = hoverRating !== null ? hoverRating : rating;
        // Ngôi sao được tô vàng nếu chỉ số của nó nhỏ hơn hoặc bằng điểm số hiện tại
        const isFilled = starIndex <= currentDisplayRating;

        return (
          <button
            key={starIndex}
            type="button"
            // Vô hiệu hóa nút nếu chỉ ở chế độ xem (để không nhận click hay tab)
            disabled={!interactive}
            // Khi di chuột vào (trên máy tính) hoặc bắt đầu chạm (trên điện thoại)
            onMouseEnter={() => interactive && setHoverRating(starIndex)}
            // Khi rời chuột ra ngoài thì trả về điểm gốc
            onMouseLeave={() => interactive && setHoverRating(null)}
            // Khi khách hàng bấm chọn dứt khoát số sao này
            onClick={() => interactive && onRatingChange && onRatingChange(starIndex)}
            className={cn(
              "transition-transform duration-150 focus:outline-none",
              // Nếu ở chế độ tương tác: thêm hiệu ứng phóng to nhẹ khi bấm và con trỏ hình bàn tay
              interactive
                ? "cursor-pointer active:scale-125 hover:scale-110"
                : "cursor-default"
            )}
            aria-label={`${starIndex} sao`}
          >
            <Star
              className={cn(
                sizeMap[size],
                "transition-colors duration-200",
                isFilled
                  ? "fill-amber-400 text-amber-400 drop-shadow-sm" // Ngôi sao sáng vàng ấm
                  : "fill-stone-200 text-stone-300"                // Ngôi sao xám chưa chọn
              )}
            />
          </button>
        );
      })}

      {/* Hiển thị số điểm kèm theo (nếu prop showScore = true) */}
      {showScore && (
        <span className="ml-1 text-xs font-bold text-stone-700">
          {rating > 0 ? rating.toFixed(1) : "Chưa có"}
        </span>
      )}
    </div>
  );
}

