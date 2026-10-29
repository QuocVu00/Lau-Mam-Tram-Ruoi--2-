"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ĐỊNH NGHĨA THUỘC TÍNH (PROPS) CỦA MODAL
 */
interface ModalProps {
  // Trạng thái mở hay đóng của Modal
  isOpen: boolean;
  // Hàm đóng Modal khi khách bấm nút X hoặc bấm ra ngoài màn hình mờ
  onClose: () => void;
  // Tiêu đề của khung Popup
  title?: string;
  // Nội dung bên trong Modal (Form đăng nhập, Form đánh giá, Ảnh phóng to...)
  children: React.ReactNode;
  // Độ rộng tối đa: "sm" (gọn), "md" (tiêu chuẩn), "lg" (rộng)
  maxWidth?: "sm" | "md" | "lg";
}

/**
 * COMPONENT MODAL DÙNG CHUNG (src/components/ui/Modal.tsx)
 * 
 * Mục đích:
 * Hiển thị khung Popup chuẩn Mobile-First (cho Đăng nhập 1 chạm, Form đánh giá...)
 * Tự động khóa cuộn trang nền của iPhone khi Popup đang mở (chống lỗi trôi trang).
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "sm",
}: ModalProps) {
  // Khóa cuộn trang khi Modal mở, mở lại khi Modal đóng
  useEffect(() => {
    if (isOpen) {
      // Lưu lại kiểu overflow cũ và khóa cuộn trên body
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Nếu modal không mở thì không render gì ra màn hình (tiết kiệm tài nguyên)
  if (!isOpen) return null;

  // Bản đồ kích cỡ tối đa
  const maxWidthMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      {/* 1. Lớp màn mờ phía sau (Backdrop): Bấm vào đây để đóng Popup */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Khung nội dung chính của Popup */}
      {/* Trên điện thoại: Trượt từ dưới lên (Bottom-sheet) | Trên máy tính: Căn giữa màn hình */}
      <div
        className={cn(
          "relative w-full bg-white z-10 shadow-2xl transition-all",
          "rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto no-scrollbar",
          maxWidthMap[maxWidth]
        )}
      >
        {/* Nút thanh gạt nhỏ trên đầu dành riêng cho trải nghiệm vuốt trên điện thoại */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Thanh tiêu đề và nút Đóng (X) */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="text-lg font-bold text-stone-900 tracking-tight">
            {title || "Thông báo"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thân nội dung được truyền vào */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

