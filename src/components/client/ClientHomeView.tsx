"use client";

import React from "react";
import { Header } from "@/components/client/Header";
import { Footer } from "@/components/client/Footer";
import { HeroSection } from "@/components/client/HeroSection";
import { QuickMenu } from "@/components/client/QuickMenu";
import { GlobalPromotions, type PromotionItem } from "@/components/client/GlobalPromotions";
import { BranchList, type BranchItem } from "@/components/client/BranchList";
import { FloatingButtons } from "@/components/client/FloatingButtons";
import { AuthModal } from "@/components/client/AuthModal";
import { useAuth } from "@/hooks/useAuth";

interface ClientHomeViewProps {
  promotions: PromotionItem[];
  branches: BranchItem[];
}

/**
 * COMPONENT CLIENT HOME VIEW (src/components/client/ClientHomeView.tsx)
 * 
 * Mục đích:
 * Hiển thị Trang chủ chuỗi Lẩu Mắm Trăm Rưỡi.
 * Khách hàng bấm vào chi nhánh sẽ chuyển hướng sang trang chi tiết (/branches/[id]).
 */
export function ClientHomeView({ promotions, branches }: ClientHomeViewProps) {
  const { user, isLoggedIn, logout, updateDisplayName, isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] selection:bg-brand-primary selection:text-white">
      
      {/* 1. Thanh tiêu đề Header */}
      <Header
        isLoggedIn={isLoggedIn}
        userName={user?.displayName}
        userAvatar={user?.avatarUrl || undefined}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onUpdateName={updateDisplayName}
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

        {/* Khối Danh sách Chi nhánh: Bấm vào chuyển sang trang chi tiết mới */}
        <BranchList branches={branches} />
      </main>

      {/* 3. Nút nổi liên hệ Hotline (Zalo: 0901019868) ghim ở đáy màn hình điện thoại */}
      <FloatingButtons hotline="0901019868" zaloUrl="https://zalo.me/0901019868" />

      {/* 4. Khung Popup Đăng nhập 1 chạm */}
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
