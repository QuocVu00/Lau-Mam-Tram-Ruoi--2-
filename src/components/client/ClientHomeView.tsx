"use client";

import React, { useState } from "react";
import { Header } from "@/components/client/Header";
import { Footer } from "@/components/client/Footer";
import { HeroSection } from "@/components/client/HeroSection";
import { GlobalPromotions, type PromotionItem } from "@/components/client/GlobalPromotions";
import { BranchList, type BranchItem } from "@/components/client/BranchList";
import { FloatingButtons } from "@/components/client/FloatingButtons";
import { AuthModal } from "@/components/client/AuthModal";

interface ClientHomeViewProps {
  promotions: PromotionItem[];
  branches: BranchItem[];
}

/**
 * COMPONENT CLIENT HOME VIEW (src/components/client/ClientHomeView.tsx)
 * 
 * Mục đích:
 * Kết nối toàn bộ các khối giao diện của Trang chủ và quản lý trạng thái:
 * - Đóng/Mở Popup Đăng nhập 1 chạm.
 * - Hiển thị Nút hành động nổi ở góc dưới điện thoại.
 * (Đã lược bỏ phần Thực đơn lướt nhanh theo yêu cầu để giao diện tinh gọn hơn).
 */
export function ClientHomeView({ promotions, branches }: ClientHomeViewProps) {
  // Trạng thái mở hay đóng Popup Đăng nhập 1 chạm
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] selection:bg-brand-primary selection:text-white">
      
      {/* 1. Thanh tiêu đề Header */}
      <Header
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* 2. Thân trang chủ */}
      <main className="flex-1 pb-16 sm:pb-8">
        {/* Khối Hero giới thiệu thương hiệu lẩu 150k */}
        <HeroSection />

        {/* Khối Banner Khuyến mãi Toàn hệ thống (tự ẩn nếu hết hạn) */}
        <GlobalPromotions promotions={promotions} />

        {/* Khối Danh sách Chi nhánh kèm bộ lọc theo Tỉnh/Thành */}
        <BranchList branches={branches} />
      </main>

      {/* 3. Nút nổi gọi điện & chỉ đường ghim ở đáy màn hình điện thoại */}
      <FloatingButtons hotline="0988150150" />

      {/* 4. Khung Popup Đăng nhập 1 chạm (bật lên khi khách yêu cầu) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        returnUrl="/"
      />

      {/* 5. Chân trang Footer */}
      <Footer />

    </div>
  );
}

