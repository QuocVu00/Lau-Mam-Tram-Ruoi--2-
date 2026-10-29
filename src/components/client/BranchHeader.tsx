"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Camera } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";

/**
 * THUỘC TÍNH (PROPS) CỦA PHẦN ĐẦU TRANG CHI NHÁNH
 */
interface BranchHeaderProps {
  name: string;
  address: string;
  openHours: string;
  avgRating: number;
  totalReviews: number;
  status: "ACTIVE" | "INACTIVE";
  // Danh sách các link ảnh không gian quán
  images?: string[];
}

/**
 * COMPONENT BRANCH HEADER (src/components/client/BranchHeader.tsx)
 * 
 * Mục đích:
 * Hiển thị khối thông tin đầu trang chi nhánh:
 * 1. Nút quay lại Trang chủ.
 * 2. Album ảnh không gian thực tế của quán (lướt ngang trên điện thoại).
 * 3. Tên chi nhánh, địa chỉ chi tiết, giờ mở cửa và điểm sao trung bình.
 */
export function BranchHeader({
  name,
  address,
  openHours,
  avgRating,
  totalReviews,
  status,
  images = [],
}: BranchHeaderProps) {
  // Trạng thái lưu ảnh đang được chọn xem lớn
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isOpen = status === "ACTIVE";

  // Danh sách ảnh mẫu dự phòng nếu chi nhánh chưa cập nhật ảnh
  const displayImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
  ];

  return (
    <div className="w-full bg-white border-b border-amber-100 pb-5">
      
      {/* 1. Thanh điều hướng trên cùng kèm nút Quay lại */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-primary active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>

        {/* Trạng thái hoạt động */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
            isOpen
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-stone-100 text-stone-500 border border-stone-200"
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              isOpen ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
            )}
          />
          {isOpen ? "Đang mở cửa" : "Tạm nghỉ"}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        
        {/* 2. Album ảnh không gian thực tế của quán */}
        <div className="relative rounded-2xl overflow-hidden bg-stone-900 shadow-sm mb-4">
          
          {/* Ảnh lớn đang chọn */}
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImages[activeImageIndex]}
              alt={name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Dải ảnh nhỏ (Thumbnails) phía dưới để khách bấm chuyển ảnh */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/50 backdrop-blur-md rounded-xl p-1.5">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {displayImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "w-10 h-7 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                    activeImageIndex === idx ? "border-amber-400 scale-105" : "border-transparent opacity-70"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Số lượng ảnh */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-white px-2 shrink-0">
              <Camera className="w-3.5 h-3.5" />
              <span>{activeImageIndex + 1}/{displayImages.length}</span>
            </div>
          </div>

        </div>

        {/* 3. Tên chi nhánh & Điểm sao */}
        <div className="space-y-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-snug">
              {name}
            </h1>

            {/* Điểm sao và tổng đánh giá */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl self-start sm:self-auto">
              <StarRating rating={avgRating} size="sm" />
              <span className="text-sm font-black text-brand-primary">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                ({totalReviews} đánh giá thực tế)
              </span>
            </div>
          </div>

          {/* Địa chỉ cụ thể */}
          <p className="flex items-start gap-1.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <span>{address}</span>
          </p>

          {/* Giờ mở cửa */}
          <p className="flex items-center gap-1.5 text-xs text-stone-500">
            <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Giờ phục vụ: {openHours || "10:00 - 22:00"}</span>
          </p>

        </div>

      </div>

    </div>
  );
}

