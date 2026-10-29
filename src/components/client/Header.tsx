"use client";

import React from "react";
import Link from "next/link";
import { UtensilsCrossed, Phone, User as UserIcon } from "lucide-react";

/**
 * THUỘC TÍNH (PROPS) CỦA HEADER
 */
interface HeaderProps {
  // Trạng thái đã đăng nhập của khách hàng
  isLoggedIn?: boolean;
  // Tên hiển thị của khách (nếu đã đăng nhập)
  userName?: string;
  // Ảnh đại diện của khách (từ Google, Zalo, FB)
  userAvatar?: string;
  // Hàm mở Popup Đăng nhập 1 chạm khi khách bấm vào nút đăng nhập
  onOpenAuthModal?: () => void;
}

/**
 * COMPONENT HEADER (src/components/client/Header.tsx)
 * 
 * Mục đích:
 * Thanh điều hướng trên cùng chuẩn Mobile-First mang phong cách dân dã miền Tây.
 * Hiển thị Logo thương hiệu, Hotline hỗ trợ và Nút đăng nhập 1 chạm nhanh.
 */
export function Header({
  isLoggedIn = false,
  userName,
  userAvatar,
  onOpenAuthModal,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 1. Khu vực Logo & Tên thương hiệu */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            {/* Tên thương hiệu (đã bỏ huy hiệu 150K theo yêu cầu) */}
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-brand-primary tracking-tight">
                LẨU MẮM TRĂM RƯỠI
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-medium">
              Đậm Đà Tình Quê Miền Tây
            </p>
          </div>
        </Link>

        {/* 2. Khu vực Hành động bên phải (Hotline & Đăng nhập) */}
        <div className="flex items-center gap-2">
          
          {/* Nút gọi hotline hỗ trợ nhanh */}
          <a
            href="tel:0988150150"
            className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-brand-secondary" />
            <span>0988.150.150</span>
          </a>

          {/* Nút Đăng nhập 1 chạm hoặc Avatar người dùng */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 pl-1">
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userAvatar}
                  alt={userName || "Avatar"}
                  className="w-8 h-8 rounded-full border border-brand-primary/30 object-cover shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-bold text-stone-800 max-w-[100px] truncate">
                {userName}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold transition-all active:scale-95"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

