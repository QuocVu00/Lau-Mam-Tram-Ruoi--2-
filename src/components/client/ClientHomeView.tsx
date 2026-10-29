"use client";

import React, { useState } from "react";
import { Header } from "@/components/client/Header";
import { Footer } from "@/components/client/Footer";
import { HeroSection } from "@/components/client/HeroSection";
import { QuickMenu } from "@/components/client/QuickMenu";
import { GlobalPromotions, type PromotionItem } from "@/components/client/GlobalPromotions";
import { BranchList, type BranchItem } from "@/components/client/BranchList";
import { FloatingButtons } from "@/components/client/FloatingButtons";
import { AuthModal } from "@/components/client/AuthModal";
import { BranchDetailModal } from "@/components/client/BranchDetailModal";
import { useAuth } from "@/hooks/useAuth";

interface ClientHomeViewProps {
  promotions: PromotionItem[];
  branches: BranchItem[];
}

/**
 * COMPONENT CLIENT HOME VIEW (src/components/client/ClientHomeView.tsx)
 * 
 * Mục đích:
 * Xem thông tin, menu và đánh giá của chi nhánh ngay trên trang khách hàng hiện tại
 * mà không cần phải chuyển sang trang khác!
 */
export function ClientHomeView({ promotions, branches }: ClientHomeViewProps) {
  const { user, isLoggedIn, logout, isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  // Chi nhánh đang được chọn để xem chi tiết ngay tại chỗ
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] selection:bg-brand-primary selection:text-white">
      
      {/* 1. Thanh tiêu đề Header */}
      <Header
        isLoggedIn={isLoggedIn}
        userName={user?.displayName}
        userAvatar={user?.avatarUrl || undefined}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={logout}
      />

      {/* 2. Thân trang chủ */}
      <main className="flex-1 pb-16 sm:pb-8">
        {/* Khối Hero giới thiệu thương hiệu lẩu 150k */}
        <HeroSection />

        {/* Khối Banner Khuyến mãi Toàn hệ thống (tự ẩn nếu hết hạn) */}
        <GlobalPromotions promotions={promotions} />

        {/* Thực đơn lướt nhanh tham khảo giá món */}
        <QuickMenu />

        {/* Khối Danh sách Chi nhánh kèm bộ lọc theo Tỉnh/Thành */}
        <BranchList
          branches={branches}
          onSelectBranch={(id) => setSelectedBranchId(id)}
        />
      </main>

      {/* 3. Nút nổi gọi điện & chỉ đường ghim ở đáy màn hình điện thoại */}
      <FloatingButtons hotline="0988150150" />

      {/* 4. Khung Popup Đăng nhập 1 chạm */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        returnUrl="/"
      />

      {/* 5. Khung Chi Tiết Chi Nhánh Ngay Tại Trang (In-place Modal/Bottom Sheet) */}
      <BranchDetailModal
        branchId={selectedBranchId}
        isOpen={!!selectedBranchId}
        onClose={() => setSelectedBranchId(null)}
        onRatingUpdated={() => {
          // Khi có bài đánh giá mới, tải lại trang nhẹ để cập nhật điểm sao ngoài trang chủ
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }}
      />

      {/* 6. Chân trang Footer */}
      <Footer />

    </div>
  );
}
