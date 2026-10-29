"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Store } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";

/**
 * ĐỊNH NGHĨA DỮ LIỆU CỦA MỘT CHI NHÁNH
 */
export interface BranchItem {
  id: string;
  name: string;
  address: string;
  district_city: string;
  open_hours: string;
  avg_rating: number;
  total_reviews: number;
  status: "ACTIVE" | "INACTIVE";
}

interface BranchListProps {
  branches: BranchItem[];
}

/**
 * COMPONENT BRANCH LIST (src/components/client/BranchList.tsx)
 * 
 * Mục đích:
 * Hiển thị danh sách toàn bộ cơ sở thuộc chuỗi Lẩu Mắm Trăm Rưỡi.
 * Nhấp vào chi nhánh sẽ mở sang trang chi tiết riêng (/branches/[id]).
 */
export function BranchList({ branches = [] }: BranchListProps) {
  // Trạng thái chọn Tỉnh/Thành trong bộ lọc
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // 1. Tự động trích xuất danh sách các Tỉnh/Thành phố từ dữ liệu chi nhánh
  const locations = ["all", ...Array.from(new Set(branches.map((b) => b.district_city || "Khác")))];

  // 2. Lọc danh sách chi nhánh theo vị trí đang chọn
  const filteredBranches = selectedLocation === "all"
    ? branches
    : branches.filter((b) => b.district_city === selectedLocation);

  return (
    <section id="branches-section" className="py-6 px-4 max-w-4xl mx-auto w-full">
      
      {/* Tiêu đề khu vực */}
      <div className="flex items-center mb-3">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-brand-primary tracking-wide">
          <Store className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Danh Sách Chi Nhánh</span>
        </div>
      </div>

      {/* 3. Thanh bấm lọc nhanh theo Tỉnh/Thành (Pill Filters) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
        {locations.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setSelectedLocation(loc)}
            className={cn(
              "whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0",
              selectedLocation === loc
                ? "bg-brand-primary text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            {loc === "all" ? "Tất cả khu vực" : loc}
          </button>
        ))}
      </div>

      {/* 4. Danh sách các thẻ Card Chi nhánh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {filteredBranches.map((branch) => {
          const isOpen = branch.status === "ACTIVE";

          return (
            <Link
              key={branch.id}
              href={`/branches/${branch.id}`}
              className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-primary/40 transition-all flex flex-col justify-between group block"
            >
              <div>
                {/* Hàng trên: Trạng thái Đang mở cửa / Tạm nghỉ */}
                <div className="flex items-center justify-between gap-2 mb-2">
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

                  {/* Điểm sao và tổng số bài review */}
                  <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                    <StarRating rating={branch.avg_rating} size="sm" />
                    <span className="text-xs font-black text-amber-900">
                      {branch.avg_rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-stone-600">
                      ({branch.total_reviews})
                    </span>
                  </div>
                </div>

                {/* Tên cơ sở */}
                <h3 className="font-extrabold text-base text-stone-900 group-hover:text-brand-primary tracking-tight leading-snug mb-2 transition-colors">
                  {branch.name}
                </h3>

                {/* Địa chỉ cơ sở */}
                <p className="flex items-start gap-1.5 text-xs text-stone-600 leading-relaxed mb-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </p>

                {/* Giờ hoạt động */}
                <p className="flex items-center gap-1.5 text-xs text-stone-600 mb-4">
                  <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Giờ mở cửa: {branch.open_hours || "10:00 - 22:00"}</span>
                </p>
              </div>

              {/* Nút hành động xem chi tiết chi nhánh sang trang mới */}
              <div className="pt-3 border-t border-stone-100">
                <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 group-hover:bg-brand-primary text-brand-primary group-hover:text-white font-bold text-xs transition-colors shadow-sm">
                  <span>Xem menu & Đánh giá chi nhánh</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </section>
  );
}
