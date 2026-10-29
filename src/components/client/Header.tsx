"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, Phone, LogOut, Edit2, Check, X } from "lucide-react";

/**
 * THUỘC TÍNH (PROPS) CỦA HEADER KHÁCH HÀNG
 */
interface HeaderProps {
  // Trạng thái đã đăng nhập của khách hàng
  isLoggedIn?: boolean;
  // Tên hiển thị đầy đủ của khách hàng từ Google
  userName?: string;
  // Ảnh đại diện của khách (từ Google)
  userAvatar?: string;
  // Hàm mở Popup Đăng nhập Google 1 chạm
  onOpenAuthModal?: () => void;
  // Hàm cập nhật tên hiển thị
  onUpdateName?: (newName: string) => Promise<any>;
  // Hàm đăng xuất khách hàng
  onLogout?: () => void;
}

/**
 * COMPONENT HEADER DÀNH RIÊNG CHO KHÁCH HÀNG (src/components/client/Header.tsx)
 * 
 * Quy tắc tuyệt đối:
 * - KHÔNG hiển thị bất kỳ nút/luồng Admin nào trên giao diện khách hàng.
 * - Hiển thị đúng và đầy đủ tên tài khoản Google của khách hàng.
 * - Cho phép khách hàng đổi tên hiển thị hoặc đăng xuất nhanh chóng.
 */
export function Header({
  isLoggedIn = false,
  userName,
  userAvatar,
  onOpenAuthModal,
  onUpdateName,
  onLogout,
}: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName || "");
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    if (!editName.trim() || !onUpdateName) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    await onUpdateName(editName.trim());
    setSaving(false);
    setIsEditing(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* 1. Logo & Tên thương hiệu */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-brand-primary tracking-tight">
                LẨU MẮM TRĂM RƯỠI
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-medium">
              Lẩu Mắm - Bò Nhúng Giấm - Thịt Cuốn Bánh Tráng
            </p>
          </div>
        </Link>

        {/* 2. Khu vực Khách hàng & Hotline (Đã loại bỏ hoàn toàn nút Admin) */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Hotline hỗ trợ khách hàng */}
          <a
            href="tel:0901019868"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-brand-secondary" />
            <span>0901.019.868</span>
          </a>

          {/* Luồng Khách hàng: Đăng nhập Google & hiển thị tên khách hàng Google */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1 sm:gap-1.5">
              {isEditing ? (
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full border border-amber-300 shadow-sm">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-28 sm:w-36 text-xs font-bold text-stone-900 bg-transparent outline-none"
                    autoFocus
                    placeholder="Tên tài khoản..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") setIsEditing(false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    disabled={saving}
                    title="Lưu tên"
                    className="p-1 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    title="Hủy"
                    className="p-1 rounded-full text-stone-400 hover:bg-stone-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-amber-50 pl-1.5 pr-2.5 py-1 rounded-full border border-amber-200 shadow-sm">
                  {userAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={userAvatar}
                      alt={userName || "Google Avatar"}
                      className="w-6 h-6 rounded-full border border-brand-primary/30 object-cover shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {userName ? userName.charAt(0).toUpperCase() : "G"}
                    </div>
                  )}

                  {/* Hiển thị tên tài khoản Google đầy đủ, không bị cắt ngắn */}
                  <span className="text-xs font-extrabold text-stone-900 whitespace-nowrap">
                    {userName}
                  </span>

                  {/* Nút bấm chỉnh sửa tên nếu muốn đổi */}
                  {onUpdateName && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditName(userName || "");
                        setIsEditing(true);
                      }}
                      title="Đổi tên hiển thị tài khoản Google"
                      className="p-1 rounded-full text-stone-400 hover:text-amber-700 hover:bg-amber-100/60 transition-colors"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Nút Đăng xuất khách hàng */}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Đăng xuất tài khoản khách hàng"
                  className="p-1.5 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors ml-0.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50/50 text-stone-800 border border-stone-300 hover:border-amber-400 text-xs font-extrabold transition-all shadow-sm active:scale-95"
            >
              {/* Logo Google chính thức */}
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Đăng nhập Google</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
