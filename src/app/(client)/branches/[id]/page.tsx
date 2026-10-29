"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Sparkles,
  MessageSquare,
  Camera,
  Heart,
  ThumbsUp,
  Flame,
  Laugh,
  X,
  CheckCircle2,
  QrCode,
} from "lucide-react";
import { Header } from "@/components/client/Header";
import { Footer } from "@/components/client/Footer";
import { AuthModal } from "@/components/client/AuthModal";
import { StarRating } from "@/components/ui/StarRating";
import { QuickMenu } from "@/components/client/QuickMenu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface BranchData {
  id: string;
  name: string;
  address: string;
  districtCity: string | null;
  googleMapUrl: string | null;
  hotline: string | null;
  openHours: string | null;
  coverImages: string[];
  avgRating: number;
  totalReviews: number;
  status: string;
}

interface PromotionData {
  id: string;
  title: string;
  content: string;
  bannerUrl: string;
  scope: string;
  startAt: string;
  endAt: string;
}

interface ReviewItem {
  id: string;
  branchId: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    oauthProvider: string;
  };
  media: Array<{
    id: string;
    mediaType: "IMAGE" | "VIDEO";
    fileUrl: string;
    thumbnailUrl: string | null;
    processStatus: string;
  }>;
  reactions: {
    LIKE: number;
    HEART: number;
    YUM: number;
    WOW: number;
    userReaction?: "LIKE" | "HEART" | "YUM" | "WOW" | null;
  };
}

export default function BranchDetailPage() {
  const params = useParams();
  const branchId = params?.id as string;

  const { user, isLoggedIn, logout, updateDisplayName, isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  const [branch, setBranch] = useState<BranchData | null>(null);
  const [promotions, setPromotions] = useState<PromotionData[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  // Modal QR Code bàn ăn
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Form viết đánh giá
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [mediaList, setMediaList] = useState<Array<{ media_type: string; file_url: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 1. Tải thông tin chi nhánh
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/branches/${branchId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setBranch(data.data.branch);
          setPromotions(data.data.promotions || []);
        }
      } catch (err) {
        console.error("Lỗi tải thông tin chi nhánh:", err);
      } finally {
        setLoading(false);
      }
    }

    if (branchId) {
      loadData();
    }
  }, [branchId]);

  // 2. Tải danh sách đánh giá theo Tab lọc (đã áp dụng Shadowban tự động theo phiên)
  const loadReviews = async (tab = selectedTab) => {
    try {
      const res = await fetch(`/api/branches/${branchId}/reviews?tab=${tab}&limit=20`);
      const data = await res.json();
      if (data.success && data.data) {
        setReviews(data.data);
      }
    } catch (e) {
      console.error("Lỗi tải reviews:", e);
    }
  };

  useEffect(() => {
    if (branchId) {
      loadReviews(selectedTab);
    }
  }, [branchId, selectedTab]);

  // Xử lý Thả / Gỡ cảm xúc
  const handleReaction = async (reviewId: string, reactionType: "LIKE" | "HEART" | "YUM" | "WOW") => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction_type: reactionType }),
      });
      const data = await res.json();
      if (data.success) {
        loadReviews(selectedTab);
      }
    } catch (e) {
      console.error("Lỗi thả cảm xúc:", e);
    }
  };

  // Xử lý Upload file từ iPhone / Thiết bị
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        if (result.success && result.data) {
          setMediaList((prev) => [
            ...prev,
            { media_type: result.data.media_type, file_url: result.data.file_url },
          ]);
        }
      } catch (err) {
        console.error("Lỗi upload:", err);
      }
    }
    setUploading(false);
  };

  // Xử lý Gửi bài đánh giá
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch_id: branchId,
          rating,
          comment,
          media: mediaList,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setComment("");
        setRating(5);
        setMediaList([]);
        setIsReviewModalOpen(false);

        // Cập nhật lại điểm sao chi nhánh và tải lại feed
        const branchRes = await fetch(`/api/branches/${branchId}`);
        const branchJson = await branchRes.json();
        if (branchJson.success && branchJson.data) {
          setBranch(branchJson.data.branch);
        }
        loadReviews(selectedTab);
      } else if (data.requiresAuth) {
        setIsAuthModalOpen(true);
      } else {
        alert(data.error || "Gửi đánh giá thất bại");
      }
    } catch (err) {
      console.error("Lỗi gửi review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !branch) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-600 font-bold text-sm">Đang tải thông tin quán...</p>
        </div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4">
        <p className="text-stone-800 font-bold text-base mb-4">Không tìm thấy chi nhánh!</p>
        <Link
          href="/"
          className="px-4 py-2 bg-brand-primary text-white rounded-xl font-bold text-sm"
        >
          Quay lại Trang Chủ
        </Link>
      </div>
    );
  }

  const branchUrl = typeof window !== "undefined" ? window.location.href : `https://laumamtramruoi.vn/branches/${branchId}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0]">
      <Header
        isLoggedIn={isLoggedIn}
        userName={user?.displayName}
        userAvatar={user?.avatarUrl || undefined}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onUpdateName={updateDisplayName}
        onLogout={logout}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 pb-28">
        {/* Thanh điều hướng quay lại & Mã QR */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tất cả chi nhánh</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-brand-primary text-xs font-bold shadow-sm transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-brand-primary" />
            <span>Mã QR bàn ăn</span>
          </button>
        </div>

        {/* 1. Thông tin Chi nhánh */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm mb-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="font-black text-xl sm:text-2xl text-stone-900 leading-tight">
              {branch.name}
            </h1>
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 shrink-0">
              <StarRating rating={branch.avgRating} size="sm" />
              <span className="text-sm font-black text-amber-900 ml-1">
                {branch.avgRating.toFixed(1)}
              </span>
              <span className="text-xs text-stone-500">({branch.totalReviews})</span>
            </div>
          </div>

          <p className="flex items-start gap-2 text-xs sm:text-sm text-stone-600 mb-2">
            <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <span>{branch.address}</span>
          </p>

          <p className="flex items-center gap-2 text-xs text-stone-600 mb-4">
            <Clock className="w-4 h-4 text-stone-500 shrink-0" />
            <span>Giờ hoạt động: {branch.openHours || "10:00 - 22:30"}</span>
          </p>

          {/* Album ảnh không gian */}
          {branch.coverImages && branch.coverImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 mb-4">
              {branch.coverImages.map((img, idx) => (
                <div key={idx} className="h-28 sm:h-36 rounded-xl overflow-hidden bg-stone-100">
                  <img
                    src={img}
                    alt={branch.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Các nút hành động nổi bật */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100">
            <a
              href={branch.googleMapUrl || `https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Chỉ đường Maps</span>
            </a>

            <a
              href={`tel:${branch.hotline || "0988150150"}`}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi đặt bàn</span>
            </a>
          </div>
        </div>

        {/* 2. Khuyến mãi áp dụng tại chi nhánh */}
        {promotions.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-brand-primary tracking-wide mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Khuyến Mãi Đang Áp Dụng</span>
            </div>
            <div className="space-y-2.5">
              {promotions.map((p) => (
                <div
                  key={p.id}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-950 flex items-start justify-between gap-3"
                >
                  <div>
                    <h4 className="font-extrabold text-brand-primary mb-1">{p.title}</h4>
                    <p className="text-stone-700 leading-relaxed">{p.content}</p>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-bold">
                    {p.scope === "GLOBAL" ? "Toàn chuỗi" : "Chi nhánh"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Thực đơn lướt nhanh cho khách tham khảo tại bàn */}
        <div className="mb-6 bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
          <QuickMenu />
        </div>

        {/* 3. Khu vực Đánh giá (Reviews Feed) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-primary" />
              <h3 className="font-black text-base text-stone-900 uppercase">
                Đánh Giá Thực Tế ({reviews.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsReviewModalOpen(true);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-brand-primary hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              + Viết đánh giá
            </button>
          </div>

          {/* Bộ lọc nhanh Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3">
            {[
              { id: "ALL", label: "Tất cả" },
              { id: "MEDIA", label: "Có ảnh/Video" },
              { id: "5", label: "5 ⭐" },
              { id: "4", label: "4 ⭐" },
              { id: "3", label: "3 ⭐" },
              { id: "2", label: "2 ⭐" },
              { id: "1", label: "1 ⭐" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  "whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold transition-all",
                  selectedTab === tab.id
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Danh sách các bài đánh giá */}
          <div className="space-y-3.5 pt-1">
            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
                <p className="text-stone-500 text-xs font-medium">
                  Chưa có bài đánh giá nào trong mục này. Hãy là người đầu tiên cảm nhận!
                </p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"}
                        alt={rev.user.displayName}
                        className="w-8 h-8 rounded-full object-cover border border-amber-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-stone-900">
                            {rev.user.displayName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                            {rev.user.oauthProvider}
                          </span>
                          {rev.status === "SHADOW_HIDDEN" && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold">
                              Chỉ bạn nhìn thấy
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-600">
                          {new Date(rev.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <StarRating rating={rev.rating} size="sm" />
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                    {rev.comment}
                  </p>

                  {/* Ảnh/video đính kèm */}
                  {rev.media && rev.media.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {rev.media.map((m) => (
                        <div
                          key={m.id}
                          className="rounded-xl overflow-hidden bg-stone-100 max-h-48 border border-stone-200"
                        >
                          {m.mediaType === "IMAGE" ? (
                            <img
                              src={m.fileUrl}
                              alt="Review ảnh"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={m.fileUrl}
                              controls
                              poster={m.thumbnailUrl || undefined}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Nút thả cảm xúc */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 text-xs">
                    {[
                      { type: "LIKE", icon: ThumbsUp, label: "Thích" },
                      { type: "HEART", icon: Heart, label: "Tim" },
                      { type: "YUM", icon: Flame, label: "Thèm" },
                      { type: "WOW", icon: Laugh, label: "Wow" },
                    ].map((item) => {
                      const count = rev.reactions[item.type as keyof typeof rev.reactions] as number || 0;
                      const isSelected = rev.reactions.userReaction === item.type;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleReaction(rev.id, item.type as any)}
                          className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all",
                            isSelected
                              ? "bg-amber-100 text-brand-primary border border-amber-300 shadow-sm"
                              : "bg-stone-50 hover:bg-stone-100 text-stone-600"
                          )}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{item.label}</span>
                          {count > 0 && <span className="text-[10px] opacity-80">{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal QR Code Bàn Ăn */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl relative">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-base text-stone-900 mb-1">Mã QR Quét Tại Bàn</h3>
            <p className="text-xs text-stone-500 mb-4">{branch.name}</p>

            <div className="p-4 bg-stone-50 rounded-2xl inline-block mb-4 border border-stone-200">
              {/* Hiển thị QR SVG qua Google Chart API chuẩn https:// để mở Safari */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  branchUrl
                )}`}
                alt="Mã QR chi nhánh"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-[11px] text-stone-500 mb-2">
              Khách quét bằng Camera iPhone sẽ tự động mở thẳng ứng dụng Safari chính.
            </p>
          </div>
        </div>
      )}

      {/* Modal Viết Đánh Giá */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-stone-900 mb-1">Cảm nhận của bạn</h3>
            <p className="text-xs text-stone-500 mb-4">
              Đánh giá thực tế cho {branch.name}
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Chọn số sao */}
              <div className="flex flex-col items-center justify-center p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
                <span className="text-xs font-bold text-amber-900 mb-2">Chọn mức độ hài lòng:</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="text-2xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      {s <= rating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ô nhập nội dung */}
              <div>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Hương vị lẩu mắm, đĩa rau, topping hay thái độ phục vụ tại quán thế nào..."
                  className="w-full p-3 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-brand-primary resize-none"
                  required
                />
              </div>

              {/* Nút chụp ảnh / upload video */}
              <div>
                <label className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 text-amber-900 font-bold text-xs cursor-pointer hover:bg-amber-100/50 transition-colors">
                  <Camera className="w-4 h-4 text-brand-primary" />
                  <span>{uploading ? "Đang xử lý tệp..." : "+ Thêm ảnh hoặc video quay tại quán"}</span>
                  <input
                    type="file"
                    accept="image/*,video/*,.heic,.mov"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {mediaList.length > 0 && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã đính kèm {mediaList.length} ảnh/video
                  </p>
                )}
              </div>

              {/* Nút gửi */}
              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-3 rounded-xl bg-brand-primary hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? "Đang đăng bài..." : "Gửi Đánh Giá Ngay"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Đăng nhập 1 chạm */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        returnUrl={`/branches/${branchId}`}
      />

      <Footer />
    </div>
  );
}
