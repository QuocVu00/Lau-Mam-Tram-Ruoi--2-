"use client";

import React, { useState } from "react";
import { Header } from "@/components/client/Header";
import { Footer } from "@/components/client/Footer";
import { BranchHeader } from "@/components/client/BranchHeader";
import { ReviewForm } from "@/components/client/ReviewForm";
import { ReviewItem, type ReviewData } from "@/components/client/ReviewItem";
import { FloatingButtons } from "@/components/client/FloatingButtons";
import { AuthModal } from "@/components/client/AuthModal";
import { MessageSquare, Tag, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * THUỘC TÍNH (PROPS) CHO TRANG CHI TIẾT CHI NHÁNH
 */
interface BranchDetailViewProps {
  branch: {
    id: string;
    name: string;
    address: string;
    district_city?: string;
    google_map_url?: string;
    hotline?: string;
    open_hours?: string;
    avg_rating: number;
    total_reviews: number;
    status: "ACTIVE" | "INACTIVE";
    images?: string[];
  };
  reviews: ReviewData[];
  promotions?: {
    id: string;
    title: string;
    content: string;
  }[];
}

/**
 * COMPONENT BRANCH DETAIL VIEW (src/components/client/BranchDetailView.tsx)
 * 
 * Mục đích:
 * Toàn bộ giao diện Trang Chi Tiết Chi Nhánh (Mobile-First):
 * 1. Khối Header thông tin chi nhánh + Album ảnh quán.
 * 2. Khuyến mãi áp dụng tại chi nhánh.
 * 3. Biểu mẫu Viết đánh giá tại bàn ăn (ReviewForm).
 * 4. Bộ lọc tabs đánh giá: [Tất cả] | [Có ảnh/video] | [5 sao] ... [1 sao].
 * 5. Danh sách các bài đánh giá (mới nhất lên đầu).
 * 6. Nút nổi Gọi điện / Google Maps cố định ở đáy điện thoại.
 */
export function BranchDetailView({
  branch,
  reviews: initialReviews,
  promotions = [],
}: BranchDetailViewProps) {
  // Trạng thái danh sách review
  const [reviewsList, setReviewsList] = useState<ReviewData[]>(initialReviews);
  // Trạng thái Tab lọc review hiện tại: "ALL" | "MEDIA" | "5" | "4" | "3" | "2" | "1"
  const [activeTab, setActiveTab] = useState<string>("ALL");
  // Trạng thái mở popup Đăng nhập 1 chạm
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Danh sách các tab lọc theo đúng đặc tả BRD Mục 1.2
  const filterTabs = [
    { key: "ALL", label: `Tất cả (${reviewsList.length})` },
    { key: "MEDIA", label: "📸 Có hình ảnh/Video" },
    { key: "5", label: "5 ⭐" },
    { key: "4", label: "4 ⭐" },
    { key: "3", label: "3 ⭐" },
    { key: "2", label: "2 ⭐" },
    { key: "1", label: "1 ⭐" },
  ];

  // Logic lọc bài đánh giá theo Tab đang chọn
  const filteredReviews = reviewsList.filter((rev) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "MEDIA") return rev.media && rev.media.length > 0;
    return rev.rating.toString() === activeTab;
  });

  // Khi có bài đánh giá mới vừa được đăng thành công -> đưa ngay lên đầu danh sách
  const handleNewReview = (newReview: unknown) => {
    if (newReview && typeof newReview === "object") {
      setReviewsList((prev) => [newReview as ReviewData, ...prev]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] selection:bg-brand-primary selection:text-white">
      
      {/* 1. Header trên cùng */}
      <Header onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      {/* 2. Khối thông tin chi nhánh & Album ảnh */}
      <BranchHeader
        name={branch.name}
        address={branch.address}
        openHours={branch.open_hours || "10:00 - 22:00"}
        avgRating={branch.avg_rating}
        totalReviews={branch.total_reviews}
        status={branch.status}
        images={branch.images}
      />

      {/* 3. Thân trang chi tiết */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 pb-24 sm:pb-12">
        
        {/* Khối Khuyến mãi áp dụng riêng tại chi nhánh này (nếu có) */}
        {promotions.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-brand-primary/10 border border-brand-primary/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-primary mb-2">
              <Tag className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Ưu Đãi Tại Chi Nhánh</span>
            </div>
            {promotions.map((p) => (
              <div key={p.id} className="space-y-1">
                <h4 className="text-sm font-extrabold text-stone-900">{p.title}</h4>
                <p className="text-xs text-stone-600">{p.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* 4. Biểu mẫu viết đánh giá tại bàn ăn */}
        <ReviewForm
          branchId={branch.id}
          isLoggedIn={false}
          onRequireLogin={() => setIsAuthModalOpen(true)}
          onReviewSubmitted={handleNewReview}
        />

        {/* 5. Khu vực Reviews Feed */}
        <div className="space-y-4">
          
          {/* Tiêu đề & Bộ lọc Tabs */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-brand-primary tracking-wide">
                <MessageSquare className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Đánh Giá Từ Thực Khách</span>
              </div>
              <span className="text-[11px] text-stone-600 font-medium flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Mới nhất lên đầu</span>
              </span>
            </div>

            {/* Thanh Tabs lọc nhanh lướt ngang (Pill tabs) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0",
                    activeTab === tab.key
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Danh sách bài viết đánh giá */}
          {filteredReviews.length > 0 ? (
            <div className="space-y-3 pt-1">
              {filteredReviews.map((rev) => (
                <ReviewItem
                  key={rev.id}
                  review={rev}
                  isLoggedIn={false}
                  onRequireLogin={() => setIsAuthModalOpen(true)}
                />
              ))}
            </div>
          ) : (
            // Trạng thái trống khi chưa có bài theo bộ lọc
            <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center text-stone-600 text-xs sm:text-sm">
              Chưa có bài đánh giá nào cho mục này. Hãy là người đầu tiên để lại cảm nhận bạn nhé!
            </div>
          )}

        </div>

      </main>

      {/* 7. Nút nổi gọi điện & mở Google Maps cố định ở đáy điện thoại */}
      <FloatingButtons
        hotline={branch.hotline || "0988150150"}
        googleMapUrl={branch.google_map_url || "https://maps.google.com"}
      />

      {/* 8. Popup Đăng nhập 1 chạm Zalo / Google / FB */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        returnUrl={`/branches/${branch.id}`}
      />

      {/* 9. Chân trang Footer */}
      <Footer />

    </div>
  );
}

