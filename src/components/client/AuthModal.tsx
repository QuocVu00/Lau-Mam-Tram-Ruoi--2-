"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Sparkles, UserCheck } from "lucide-react";

/**
 * THUỘC TÍNH (PROPS) CHO POPUP ĐĂNG NHẬP KHÁCH HÀNG BẰNG GOOGLE
 */
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Đường dẫn quay lại sau khi đăng nhập xong
  returnUrl?: string;
}

/**
 * COMPONENT AUTHMODAL (src/components/client/AuthModal.tsx)
 * 
 * Luồng Khách Hàng: Đăng nhập tự động 1 chạm bằng Google
 * - Hoàn toàn không dính líu đến luồng Admin.
 * - Tự động tạo phiên làm việc 20 ngày (Dual-Tier Session: Cookie + LocalStorage).
 * - Hiển thị đúng họ tên tài khoản Google của khách hàng.
 */
export function AuthModal({ isOpen, onClose, returnUrl = "/" }: AuthModalProps) {
  const [customName, setCustomName] = useState("");

  const handleGoogleLogin = (selectedName?: string) => {
    const finalName = (selectedName || customName || "Quốc Vũ").trim();
    const currentPath = typeof window !== "undefined" ? window.location.pathname : returnUrl;
    const encodedReturnUrl = encodeURIComponent(currentPath);
    const encodedName = encodeURIComponent(finalName);

    // Chuyển hướng sang OAuth redirect của Google
    window.location.href = `/api/auth/google/redirect?returnUrl=${encodedReturnUrl}&name=${encodedName}`;
  };

  const sampleGoogleAccounts = [
    { name: "Quốc Vũ", email: "quocvu.dev@gmail.com" },
    { name: "Thảo Vy", email: "thaovy.cantho@gmail.com" },
    { name: "Nguyễn Minh Quân", email: "minhquan.hcm@gmail.com" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đăng Nhập Khách Hàng" maxWidth="sm">
      <div className="flex flex-col items-center text-center space-y-4">
        
        {/* Lời giải thích nhẹ nhàng cho khách */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Đăng nhập 1 chạm bằng tài khoản <strong className="text-stone-900 font-extrabold">Google</strong> để gửi đánh giá, nhận ưu đãi và lưu phiên tự động <strong className="text-amber-800 font-bold">20 ngày</strong>.
        </p>

        {/* 1. NÚT ĐĂNG NHẬP CHÍNH: Google 1-Touch Auto Login */}
        <div className="w-full pt-1">
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            className="w-full py-3.5 px-4 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-50/50 text-stone-900 font-extrabold text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-98 transition-all group"
          >
            {/* SVG Logo Google chính thức */}
            <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
            <span>Đăng nhập tự động với Google</span>
          </button>
        </div>

        {/* 2. CHỌN NHANH TÀI KHOẢN GOOGLE DEMO */}
        <div className="w-full pt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[1px] flex-1 bg-stone-200" />
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Hoặc chọn tài khoản Google của bạn
            </span>
            <div className="h-[1px] flex-1 bg-stone-200" />
          </div>

          <div className="space-y-1.5 text-left">
            {sampleGoogleAccounts.map((acc, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleGoogleLogin(acc.name)}
                className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/60 flex items-center justify-between text-left transition-all active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-brand-primary flex items-center justify-center font-bold text-xs shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800 leading-none">
                      {acc.name}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      {acc.email}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                  Chọn
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. TUỲ CHỌN NHẬP TÊN CỦA BẠN */}
        <div className="w-full pt-1">
          <div className="flex gap-2">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Hoặc nhập tên tài khoản Google của bạn..."
              className="flex-1 px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500 text-xs font-medium text-stone-800 placeholder:text-stone-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && customName.trim()) {
                  handleGoogleLogin();
                }
              }}
            />
            {customName.trim() && (
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="px-3 py-2 rounded-xl bg-brand-primary hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Vào ngay
              </button>
            )}
          </div>
        </div>

        {/* Thông báo bảo mật */}
        <div className="pt-2 text-center border-t border-stone-100 w-full">
          <p className="text-[11px] text-stone-500">
            Hệ thống tự động lưu phiên làm việc an toàn <strong>20 ngày</strong>.
          </p>
        </div>

      </div>
    </Modal>
  );
}
