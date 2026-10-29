"use client";

import React, { useState } from "react";
import { Utensils, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ĐỊNH NGHĨA DỮ LIỆU CỦA MỘT MÓN ĂN TRONG MENU LƯỚT NHANH
 */
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: "lau" | "thit_ca" | "rau_dong" | "nuoc_uong";
  tag?: string;
  description: string;
}

// Danh sách thực đơn mẫu chuẩn vị chuỗi Lẩu Mắm Trăm Rưỡi
const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    name: "Nồi Lẩu Mắm Trăm Rưỡi (Đồng giá)",
    price: 150000,
    category: "lau",
    tag: "Món chính bán chạy nhất",
    description: "Nước lẩu cốt mắm cá linh & cá sặc thơm nồng, kèm thịt ba chỉ, cá ba sa, cà tím và 1 đĩa bún tươi.",
  },
  {
    id: "m2",
    name: "Dĩa Cá Basa & Tôm Sú tươi",
    price: 50000,
    category: "thit_ca",
    tag: "Gọi thêm",
    description: "Cá basa phi lê béo mềm và tôm sú tươi ngon nhúng lẩu cực ngọt nước.",
  },
  {
    id: "m3",
    name: "Dĩa Thịt Ba Chỉ Rút Sườn",
    price: 45000,
    category: "thit_ca",
    tag: "Gọi thêm",
    description: "Thịt ba chỉ thái mỏng vừa ăn, nạc mỡ đan xen hòa quyện nước mắm đậm đà.",
  },
  {
    id: "m4",
    name: "Mẹt Rau Đồng Tươi Sống",
    price: 30000,
    category: "rau_dong",
    tag: "Rau tươi",
    description: "Bông súng, hoa điên điển theo mùa, rau muống đồng, kèo nèo và rau đắng.",
  },
  {
    id: "m5",
    name: "Dĩa Bún Tươi Sợi Nhỏ",
    price: 10000,
    category: "rau_dong",
    description: "Bún tươi sợi nhỏ truyền thống, chan nước lẩu nóng hổi.",
  },
  {
    id: "m6",
    name: "Trà Tắc Hạt Chia / Nước Mát",
    price: 15000,
    category: "nuoc_uong",
    description: "Ly lớn giải nhiệt, thanh mát vị lẩu.",
  },
];

/**
 * COMPONENT QUICK MENU (src/components/client/QuickMenu.tsx)
 * 
 * Mục đích:
 * Thực đơn lướt nhanh dạng thanh trượt ngang (Horizontal Scroll).
 * Khách ngồi tại bàn ăn có thể lướt nhanh bằng ngón tay cái để xem giá và gọi món.
 */
export function QuickMenu() {
  // Trạng thái lọc theo danh mục món
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { key: "all", label: "Tất cả món" },
    { key: "lau", label: "🍲 Nồi Lẩu 150k" },
    { key: "thit_ca", label: "🥩 Thịt & Cá" },
    { key: "rau_dong", label: "🌿 Rau đồng" },
    { key: "nuoc_uong", label: "🥤 Nước uống" },
  ];

  // Lọc món ăn theo danh mục đang chọn
  const filteredItems = selectedCategory === "all"
    ? DEFAULT_MENU_ITEMS
    : DEFAULT_MENU_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="quick-menu-section" className="py-6 px-4 max-w-4xl mx-auto w-full">
      
      {/* Tiêu đề mục Thực đơn */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-brand-primary tracking-wide">
          <Utensils className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Thực Đơn Lướt Nhanh</span>
        </div>
        <span className="text-[11px] font-semibold text-stone-600">
          Đồng giá nồi lẩu 150.000đ
        </span>
      </div>

      {/* 1. Các thẻ phân loại nhanh (Tabs) - Cho phép lướt ngang trên di động */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key)}
            className={cn(
              "whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0",
              selectedCategory === cat.key
                ? "bg-brand-primary text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 2. Danh sách món dạng danh sách trượt ngang (Carousel) mượt mà */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:overflow-visible">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="w-[240px] sm:w-auto shrink-0 flex flex-col justify-between bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              {/* Huy hiệu tag nổi bật (nếu có) */}
              {item.tag && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-brand-secondary mb-2">
                  <Flame className="w-3 h-3" />
                  <span>{item.tag}</span>
                </div>
              )}

              {/* Tên món ăn */}
              <h4 className="font-extrabold text-sm text-stone-900 tracking-tight leading-snug mb-1">
                {item.name}
              </h4>

              {/* Mô tả ngắn nguyên liệu */}
              <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-3">
                {item.description}
              </p>
            </div>

            {/* Bảng giá niêm yết rõ ràng */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-600 font-medium">Giá bán:</span>
              <span className="text-sm font-black text-brand-primary">
                {item.price.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

