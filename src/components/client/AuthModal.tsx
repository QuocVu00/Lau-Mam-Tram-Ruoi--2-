"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";

/**
 * THUỘC TÍNH (PROPS) CHO POPUP ĐĂNG NHẬP 1 CHẠM
 */
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Đường dẫn mà khách sẽ quay trở lại sau khi đăng nhập xong (mặc định là trang hiện tại)
  returnUrl?: string;
}

/**
 * COMPONENT AUTHMODAL (src/components/client/AuthModal.tsx)
 * 
 * Mục đích:
 * Cơ chế Đăng nhập 1 chạm (Zero-Input Authentication) chuẩn Mobile-First.
 * Khách KHÔNG CẦN gõ tên hay mật khẩu, chỉ cần chọn 1 trong 3 mạng xã hội.
 * 
 * Kỹ thuật cốt lõi (iOS Safari Support):
 * TUYỆT ĐỐI KHÔNG mở popup window (vì Safari trên iPhone sẽ chặn mặc định).
 * Thay vào đó, dùng Redirect điều hướng trên cùng 1 tab (Top-level Redirect) hoặc Universal Link.
 */
export function AuthModal({ isOpen, onClose, returnUrl = "/" }: AuthModalProps) {
  // Hàm xử lý khi khách bấm vào 1 trong 3 nút đăng nhập
  const handleOAuthLogin = (provider: "zalo" | "google" | "facebook") => {
    // Mã hóa đường dẫn quay lại để sau khi đăng nhập xong chuyển đúng về trang chi nhánh khách đang xem
    const encodedReturnUrl = encodeURIComponent(
      typeof window !== "undefined" ? window.location.pathname : returnUrl
    );

    // Chuyển hướng trình duyệt sang Route Handler xử lý OAuth 2.0
    window.location.href = `/api/auth/${provider}/redirect?returnUrl=${encodedReturnUrl}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đăng nhập 1 chạm" maxWidth="sm">
      <div className="flex flex-col items-center text-center space-y-4">
        
        {/* Lời giải thích nhẹ nhàng cho khách */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Không cần nhập mật khẩu hay số điện thoại. Chọn tài khoản mạng xã hội của bạn để viết đánh giá và nhận ưu đãi ngay!
        </p>

        {/* Danh sách 3 nút Đăng nhập 1 chạm */}
        <div className="w-full space-y-2.5 pt-1">
          
          {/* 1. Nút Tiếp tục với Zalo (Phổ biến nhất tại Việt Nam) */}
          <button
            type="button"
            onClick={() => handleOAuthLogin("zalo")}
            className="w-full py-3 px-4 rounded-xl bg-[#0068FF] hover:bg-[#0056d6] text-white font-bold text-sm flex items-center justify-center gap-3 shadow-sm active:scale-98 transition-all"
          >
            <span className="w-6 h-6 rounded-full bg-white text-[#0068FF] flex items-center justify-center font-black text-xs">
              Z
            </span>
            <span>Tiếp tục với Zalo</span>
          </button>

          {/* 2. Nút Tiếp tục với Google (Hỗ trợ Google One Tap) */}
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            className="w-full py-3 px-4 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-sm flex items-center justify-center gap-3 shadow-sm active:scale-98 transition-all"
          >
            {/* SVG Logo Google đa sắc màu */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>Tiếp tục với Google</span>
          </button>

          {/* 3. Nút Tiếp tục với Facebook */}
          <button
            type="button"
            onClick={() => handleOAuthLogin("facebook")}
            className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm flex items-center justify-center gap-3 shadow-sm active:scale-98 transition-all"
          >
            <span className="w-6 h-6 rounded-full bg-white text-[#1877F2] flex items-center justify-center font-black text-sm">
              f
            </span>
            <span>Tiếp tục với Facebook</span>
          </button>

        </div>

        {/* Cam kết bảo mật quyền riêng tư */}
        <p className="text-[11px] text-stone-400 pt-2">
          Hệ thống chỉ lưu tên hiển thị & ảnh đại diện để gắn vào bài đánh giá. Phiên làm việc được lưu an toàn 20 ngày.
        </p>

      </div>
    </Modal>
  );
}

