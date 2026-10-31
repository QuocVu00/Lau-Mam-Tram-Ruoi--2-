"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Building2,
  Star,
  MessageSquare,
  Sparkles,
  EyeOff,
  Trash2,
  CheckCircle,
  RefreshCw,
  Plus,
  Calendar,
  LogOut,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  ChevronRight,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboardClient() {
  const router = useRouter();

  // Dữ liệu quản trị
  const [overview, setOverview] = useState<any>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [branchReviews, setBranchReviews] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"REVIEWS" | "PROMOTIONS">("REVIEWS");
  const [reviewStatusFilter, setReviewStatusFilter] = useState<"ALL" | "PUBLIC" | "SHADOW_HIDDEN">("ALL");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReviewsSection, setShowReviewsSection] = useState(false);
  const [highlightSection, setHighlightSection] = useState<"BRANCHES" | "REVIEWS" | "PROMOTIONS" | null>(null);

  // Điều hướng đúng vai trò khi nhấp vào từng thẻ tổng quan:
  const handleCardClickBranches = () => {
    setActiveTab("REVIEWS");
    setHighlightSection("BRANCHES");
    setTimeout(() => {
      document.getElementById("branch-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    setTimeout(() => setHighlightSection(null), 2500);
  };

  const handleCardClickReviews = () => {
    setActiveTab("REVIEWS");
    setReviewStatusFilter("PUBLIC");
    setShowReviewsSection(true);
    setHighlightSection("REVIEWS");
    setTimeout(() => {
      document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    setTimeout(() => setHighlightSection(null), 2500);
  };

  const handleCardClickRatings = () => {
    setShowRatingModal(true);
  };

  const handleCardClickPromotions = () => {
    setActiveTab("PROMOTIONS");
    setHighlightSection("PROMOTIONS");
    setTimeout(() => {
      document.getElementById("promotions-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    setTimeout(() => setHighlightSection(null), 2500);
  };

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form tạo khuyến mãi
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoContent, setPromoContent] = useState("");
  const [promoBanner, setPromoBanner] = useState("");
  const [promoDays, setPromoDays] = useState(7);
  const [promoEndDate, setPromoEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [bannerUploading, setBannerUploading] = useState(false);
  const [customUrlMode, setCustomUrlMode] = useState(false);

  // Xử lý chọn số ngày hoặc ngày kết thúc cụ thể
  const handleSetPromoDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setPromoDays(days);
    setPromoEndDate(d.toISOString().split("T")[0]);
  };

  const handleDateChange = (dateStr: string) => {
    setPromoEndDate(dateStr);
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    setPromoDays(diffDays);
  };

  // Thư viện ảnh quán có sẵn & ảnh mới tải lên
  const [libraryImages, setLibraryImages] = useState<
    Array<{ id: string; url: string; title: string; isCustom?: boolean }>
  >([
    {
      id: "lau-mam-1",
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
      title: "Lẩu mắm 150k trứ danh",
    },
    {
      id: "hai-san-2",
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
      title: "Mâm topping hải sản",
    },
    {
      id: "rau-dong-3",
      url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
      title: "Đĩa rau đồng miệt vườn",
    },
    {
      id: "khong-gian-4",
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
      title: "Không gian quán ấm cúng",
    },
    {
      id: "sum-hop-5",
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
      title: "Mâm tiệc sum họp",
    },
    {
      id: "logo-brand",
      url: "/images/logo.jpg",
      title: "Logo Quán Trăm Rưỡi",
    },
  ]);

  // 1. Tải Overview & Khuyến mãi
  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/overview");
      const json = await res.json();
      if (json.success && json.data) {
        setOverview(json.data);
        if (!selectedBranchId && json.data.branches?.length > 0) {
          setSelectedBranchId(json.data.branches[0].id);
        }
      }
    } catch (e) {
      console.error("Lỗi tải admin overview:", e);
    } finally {
      setLoading(false);
    }
  }, [selectedBranchId]);

  const loadPromotions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/promotions");
      const json = await res.json();
      if (json.success && json.data) {
        setPromotions(json.data);
      }
    } catch (e) {
      console.error("Lỗi tải promotions admin:", e);
    }
  }, []);

  useEffect(() => {
    loadOverview();
    loadPromotions();
  }, [loadOverview, loadPromotions]);

  // 2. Tải reviews của branch đang chọn
  const loadReviews = useCallback(async (branchId: string) => {
    if (!branchId) return;
    try {
      const res = await fetch(`/api/admin/branches/${branchId}/reviews`);
      const json = await res.json();
      if (json.success && json.data) {
        setBranchReviews(json.data);
      }
    } catch (e) {
      console.error("Lỗi tải reviews quản trị:", e);
    }
  }, []);

  useEffect(() => {
    if (selectedBranchId) {
      loadReviews(selectedBranchId);
    }
  }, [selectedBranchId, loadReviews]);

  // 3. Xử lý Kiểm duyệt (Shadowban hoặc Silent Delete)
  const handleModeration = async (reviewId: string, status: "PUBLIC" | "SHADOW_HIDDEN" | "DELETED") => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/moderation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        await loadOverview();
        await loadReviews(selectedBranchId);
      } else {
        alert(json.error || "Thao tác thất bại");
      }
    } catch (e) {
      console.error("Lỗi kiểm duyệt:", e);
    } finally {
      setActionLoading(false);
    }
  };

  // Tải ảnh từ thiết bị lên server và thêm ngay vào thư viện
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data?.file_url) {
        const uploadedUrl = json.data.file_url;
        setPromoBanner(uploadedUrl);
        // Thêm vào đầu danh sách thư viện ảnh
        const newImgItem = {
          id: `upload_${Date.now()}`,
          url: uploadedUrl,
          title: file.name.length > 20 ? file.name.substring(0, 18) + "..." : file.name,
          isCustom: true,
        };
        setLibraryImages((prev) => [newImgItem, ...prev]);
      } else {
        alert(json.error || "Tải ảnh lên thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi tải ảnh banner:", err);
      alert("Đã xảy ra lỗi khi tải ảnh. Vui lòng thử lại!");
    } finally {
      setBannerUploading(false);
      e.target.value = "";
    }
  };

  // 4. Tạo Khuyến mãi mới
  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle || !promoContent) return;

    setActionLoading(true);
    try {
      const startAt = new Date().toISOString();
      // Kết thúc vào 23:59:59 của ngày đã chọn
      const [year, month, day] = promoEndDate.split("-").map(Number);
      const end = new Date(year, month - 1, day, 23, 59, 59, 999);
      const endAt = end.toISOString();

      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: promoTitle,
          content: promoContent,
          bannerUrl: promoBanner || "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
          scope: "GLOBAL",
          startAt,
          endAt,
          isActive: true,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setPromoTitle("");
        setPromoContent("");
        setPromoBanner("");
        handleSetPromoDays(7);
        setShowPromoForm(false);
        await loadPromotions();
        await loadOverview();
      } else {
        alert(json.error || "Tạo khuyến mãi thất bại");
      }
    } catch (err) {
      console.error("Lỗi tạo KM:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Xóa khuyến mãi
  const handleDeletePromo = async (id: string) => {
    if (!confirm("Xóa chương trình khuyến mãi này?")) return;
    try {
      await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
      await loadPromotions();
      await loadOverview();
    } catch (e) {
      console.error("Lỗi xóa KM:", e);
    }
  };

  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-stone-400 uppercase tracking-widest">
            Đang tải dữ liệu Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col">
      {/* Header Admin */}
      <header className="bg-stone-950 border-b border-stone-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
              ADMIN DASHBOARD - LẨU MẮM TRĂM RƯỠI
            </h1>
            <p className="text-[11px] text-stone-400">
              Kiểm duyệt đánh giá thông minh (Shadowban) & Quản lý khuyến mãi tự động
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 rounded-lg text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-300 font-bold">Admin: <span className="text-amber-400">admin</span></span>
          </div>

          <button
            type="button"
            onClick={async () => {
              await fetch("/api/admin/auth/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất Admin</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Thống kê Tổng quan (Overview Cards - Nhấp vào để thực hiện đúng vai trò) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Tổng chi nhánh -> Chuyển đến chọn chi nhánh */}
          <button
            type="button"
            onClick={handleCardClickBranches}
            className="text-left bg-stone-800/80 border border-stone-700/80 hover:border-amber-500/80 hover:bg-stone-800 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs font-bold mb-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-500" />
                  <span>Tổng chi nhánh</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-2xl font-black text-white">{overview?.totalBranches ?? 5}</p>
            </div>
            <p className="text-[10px] text-amber-400 font-medium mt-2 flex items-center gap-1">
              <span>Xem & chọn chi nhánh</span>
              <span>→</span>
            </p>
          </button>

          {/* Card 2: Tổng đánh giá Public -> Chuyển đến kiểm duyệt đánh giá và lọc Public */}
          <button
            type="button"
            onClick={handleCardClickReviews}
            className="text-left bg-stone-800/80 border border-stone-700/80 hover:border-emerald-500/80 hover:bg-stone-800 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs font-bold mb-1">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span>Tổng đánh giá Public</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-2xl font-black text-white">{overview?.totalPublicReviews ?? 20}</p>
            </div>
            <p className="text-[10px] text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <span>Xem đánh giá Public</span>
              <span>→</span>
            </p>
          </button>

          {/* Card 3: Điểm TB Toàn Hệ Thống -> Mở bảng xếp hạng và chi tiết điểm từng chi nhánh */}
          <button
            type="button"
            onClick={handleCardClickRatings}
            className="text-left bg-stone-800/80 border border-stone-700/80 hover:border-amber-400/80 hover:bg-stone-800 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs font-bold mb-1">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Điểm TB Toàn Hệ Thống</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-2xl font-black text-amber-400">
                  {(overview?.overallAvgRating ?? overview?.avgRatingAllBranches ?? 4.8).toFixed(1)}
                </p>
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
            </div>
            <p className="text-[10px] text-amber-400 font-medium mt-2 flex items-center gap-1">
              <span>Bảng xếp hạng 5 chi nhánh</span>
              <span>→</span>
            </p>
          </button>

          {/* Card 4: Khuyến mãi hiệu lực -> Chuyển sang tab quản lý khuyến mãi */}
          <button
            type="button"
            onClick={handleCardClickPromotions}
            className="text-left bg-stone-800/80 border border-stone-700/80 hover:border-purple-400/80 hover:bg-stone-800 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs font-bold mb-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Khuyến mãi hiệu lực</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-2xl font-black text-white">{overview?.activePromotionsCount ?? promotions.length}</p>
            </div>
            <p className="text-[10px] text-purple-400 font-medium mt-2 flex items-center gap-1">
              <span>Quản lý khuyến mãi</span>
              <span>→</span>
            </p>
          </button>
        </div>

        {/* Tab chuyển đổi: Kiểm duyệt Review vs Quản lý Khuyến Mãi */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("REVIEWS")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all",
              activeTab === "REVIEWS"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-400 hover:text-white hover:bg-stone-800"
            )}
          >
            Kiểm duyệt Review & Shadowban
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PROMOTIONS")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all",
              activeTab === "PROMOTIONS"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-400 hover:text-white hover:bg-stone-800"
            )}
          >
            Quản lý Khuyến Mãi ({promotions.length})
          </button>
        </div>

        {activeTab === "REVIEWS" ? (
          <>
            {/* Thanh chọn chi nhánh */}
            <div
              id="branch-section"
              className={cn(
                "bg-stone-800/60 border rounded-2xl p-4 transition-all duration-300",
                highlightSection === "BRANCHES"
                  ? "border-amber-400 ring-2 ring-amber-400/50 shadow-xl bg-stone-800/90"
                  : "border-stone-700/60"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Chọn chi nhánh để kiểm duyệt</span>
                </h2>
                <span className="text-[11px] text-stone-400 font-mono">
                  {overview?.branches?.length || 5} chi nhánh hoạt động
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {overview?.branches?.map((b: any) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedBranchId(b.id);
                      setShowReviewsSection(true);
                      setTimeout(() => {
                        document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 100);
                    }}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all group",
                      selectedBranchId === b.id && showReviewsSection
                        ? "bg-stone-900 border-amber-500 shadow-md ring-1 ring-amber-500/40"
                        : "bg-stone-800/40 border-stone-700/60 hover:border-amber-500/60 hover:bg-stone-800"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate max-w-[200px]">{b.name}</p>
                      <span className="text-xs text-amber-400 font-extrabold flex items-center gap-1">
                        {(b.avgRating ?? b.avg_rating ?? 5.0).toFixed(1)} <Star className="w-3 h-3 fill-amber-400" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                      <span>{b.totalReviews ?? b.total_reviews ?? 0} đánh giá</span>
                      {(b.pendingShadowCount ?? b.shadowHiddenCount ?? 0) > 0 && (
                        <span className="text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/60">
                          {b.pendingShadowCount ?? b.shadowHiddenCount} đang ẩn (Shadowban)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-500 group-hover:text-amber-400 mt-2 pt-1.5 border-t border-stone-800/60 font-medium">
                      <span>
                        {selectedBranchId === b.id && showReviewsSection ? "Đang mở kiểm duyệt đánh giá" : "Nhấp mở kiểm duyệt đánh giá"}
                      </span>
                      <span>{selectedBranchId === b.id && showReviewsSection ? "▼" : "→"}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Danh sách bài đánh giá cần kiểm duyệt (Chỉ hiện lên khi nhấp vào) */}
            {showReviewsSection && (
              <div
                id="reviews-section"
                className={cn(
                  "bg-stone-800/60 border rounded-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-3",
                  highlightSection === "REVIEWS"
                    ? "border-emerald-400 ring-2 ring-emerald-400/50 shadow-xl bg-stone-800/90"
                    : "border-stone-700/60"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>
                        Kiểm Duyệt Đánh Giá - {overview?.branches?.find((b: any) => b.id === selectedBranchId)?.name || "Chi nhánh"}
                      </span>
                      <span className="text-xs font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded-full">
                        ({branchReviews.filter((r) => reviewStatusFilter === "ALL" ? true : r.status === reviewStatusFilter).length} / {branchReviews.length})
                      </span>
                    </h2>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Chế độ Shadowban giữ cho người đăng vẫn thấy bài nhưng ẩn khỏi khách khác và không tính điểm
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewsSection(false)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-all shadow-sm"
                      title="Thu gọn danh sách đánh giá"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Đóng / Thu gọn</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadReviews(selectedBranchId)}
                      className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 transition-colors"
                      title="Tải lại danh sách"
                    >
                      <RefreshCw className={cn("w-4 h-4", actionLoading && "animate-spin")} />
                    </button>
                  </div>
                </div>

              {/* Bộ lọc trạng thái đánh giá */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-800 flex-wrap">
                <span className="text-[11px] text-stone-400 font-medium mr-1">Bộ lọc hiển thị:</span>
                <button
                  type="button"
                  onClick={() => setReviewStatusFilter("ALL")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition border",
                    reviewStatusFilter === "ALL"
                      ? "bg-amber-500 text-stone-950 border-amber-400 shadow-sm"
                      : "bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800"
                  )}
                >
                  Tất cả ({branchReviews.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewStatusFilter("PUBLIC")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition border",
                    reviewStatusFilter === "PUBLIC"
                      ? "bg-emerald-500 text-stone-950 border-emerald-400 shadow-sm"
                      : "bg-stone-900 hover:bg-stone-800 text-emerald-400 border-stone-800"
                  )}
                >
                  Công khai Public ({branchReviews.filter((r) => r.status === "PUBLIC").length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewStatusFilter("SHADOW_HIDDEN")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition border",
                    reviewStatusFilter === "SHADOW_HIDDEN"
                      ? "bg-amber-500 text-stone-950 border-amber-400 shadow-sm"
                      : "bg-stone-900 hover:bg-stone-800 text-amber-400 border-stone-800"
                  )}
                >
                  Đang ẩn Shadowban ({branchReviews.filter((r) => r.status === "SHADOW_HIDDEN").length})
                </button>
              </div>

              {branchReviews.filter((r) => reviewStatusFilter === "ALL" ? true : r.status === reviewStatusFilter).length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  {reviewStatusFilter === "PUBLIC"
                    ? "Chi nhánh này không có bài đánh giá Public nào."
                    : reviewStatusFilter === "SHADOW_HIDDEN"
                    ? "Chi nhánh này hiện không có bài nào đang bị ẩn Shadowban."
                    : "Chi nhánh này hiện chưa có bài đánh giá nào."}
                </div>
              ) : (
                <div className="space-y-3">
                  {branchReviews
                    .filter((r) => reviewStatusFilter === "ALL" ? true : r.status === reviewStatusFilter)
                    .map((rev) => (
                    <div
                      key={rev.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        rev.status === "SHADOW_HIDDEN"
                          ? "bg-amber-950/20 border-amber-700/50"
                          : rev.status === "DELETED"
                          ? "bg-rose-950/20 border-rose-800/50 opacity-60"
                          : "bg-stone-900 border-stone-800"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          {rev.user?.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={rev.user.avatar_url}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-stone-700"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                              {rev.user?.display_name?.charAt(0) || "U"}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{rev.user?.display_name}</span>
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-stone-800 text-stone-400">
                                {rev.user?.oauth_provider}
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-500 font-mono">
                              IP: {rev.session?.ip_address || rev.ip_address || "::1"} | {new Date(rev.created_at).toLocaleTimeString("vi-VN")}{" "}
                              {new Date(rev.created_at).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border",
                              rev.status === "PUBLIC"
                                ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                : rev.status === "SHADOW_HIDDEN"
                                ? "bg-amber-950 text-amber-400 border-amber-800"
                                : "bg-rose-950 text-rose-400 border-rose-800"
                            )}
                          >
                            {rev.status === "PUBLIC"
                              ? "CÔNG KHAI"
                              : rev.status === "SHADOW_HIDDEN"
                              ? "SHADOWBAN (ẨN)"
                              : "ĐÃ XÓA"}
                          </span>
                          <span className="text-amber-400 font-black text-xs flex items-center gap-0.5">
                            {rev.rating} <Star className="w-3 h-3 fill-amber-400" />
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-300 mt-2.5 leading-relaxed bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/80">
                        {rev.comment}
                      </p>

                      {/* Nút hành động kiểm duyệt */}
                      <div className="mt-3 flex items-center justify-end gap-2">
                        {rev.status !== "PUBLIC" && (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleModeration(rev.id, "PUBLIC")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Khôi phục Công khai</span>
                          </button>
                        )}

                        {rev.status !== "SHADOW_HIDDEN" && (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleModeration(rev.id, "SHADOW_HIDDEN")}
                            className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <EyeOff className="w-3 h-3" />
                            <span>Ẩn thông minh (Shadowban)</span>
                          </button>
                        )}

                        {rev.status !== "DELETED" && (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleModeration(rev.id, "DELETED")}
                            className="px-2.5 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Xóa vĩnh viễn</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}
          </>
        ) : (
          /* TAB QUẢN LÝ KHUYẾN MÃI */
          <div
            id="promotions-section"
            className={cn(
              "bg-stone-800/60 border rounded-2xl p-4 transition-all duration-300",
              highlightSection === "PROMOTIONS"
                ? "border-purple-400 ring-2 ring-purple-400/50 shadow-xl bg-stone-800/90"
                : "border-stone-700/60"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white">Chương Trình Khuyến Mãi</h2>
                <p className="text-[11px] text-stone-400">
                  Tự động hiển thị và biến mất khi hết hạn mà không cần tải lại trang
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPromoForm(!showPromoForm)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showPromoForm ? "Đóng form" : "Tạo khuyến mãi mới"}</span>
              </button>
            </div>

            {/* Form tạo KM */}
            {showPromoForm && (
              <form onSubmit={handleCreatePromo} className="mb-6 bg-stone-900 p-4 rounded-xl border border-stone-700/80 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  Tạo chương trình khuyến mãi (Tự động kết thúc theo ngày)
                </h3>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Tiêu đề khuyến mãi:</label>
                  <input
                    type="text"
                    value={promoTitle}
                    onChange={(e) => setPromoTitle(e.target.value)}
                    placeholder="VD: Flash Sale Giờ Vàng Giảm 20%"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Nội dung chi tiết:</label>
                  <textarea
                    value={promoContent}
                    onChange={(e) => setPromoContent(e.target.value)}
                    placeholder="Áp dụng cho bàn đặt trước qua hotline..."
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white"
                    rows={2}
                    required
                  />
                </div>

                {/* THỜI GIAN HIỆU LỰC THEO NGÀY */}
                <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Thời hạn chương trình (Hết hạn theo ngày):</span>
                    </label>
                    <span className="text-[11px] text-amber-400 font-mono font-medium">
                      Hết hạn vào 23:59 ngày {promoEndDate.split("-").reverse().join("/")} ({promoDays} ngày)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[1, 3, 7, 14, 30].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => handleSetPromoDays(days)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-semibold transition border",
                            promoDays === days
                              ? "bg-amber-500 text-stone-950 border-amber-400 shadow-sm"
                              : "bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800 hover:border-stone-700"
                          )}
                        >
                          {days === 1
                            ? "1 ngày"
                            : days === 7
                            ? "7 ngày (1 tuần)"
                            : days === 14
                            ? "14 ngày (2 tuần)"
                            : days === 30
                            ? "30 ngày (1 tháng)"
                            : `${days} ngày`}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-[11px] text-stone-400">Hoặc chọn ngày cụ thể:</span>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={promoEndDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="px-2.5 py-1 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white font-mono focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* THƯ VIỆN ẢNH VÀ TẢI LÊN BANNER */}
                <div className="pt-2 border-t border-stone-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ảnh Banner Khuyến Mãi:</span>
                    </label>
                    {promoBanner && (
                      <button
                        type="button"
                        onClick={() => setPromoBanner("")}
                        className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Gỡ ảnh đã chọn</span>
                      </button>
                    )}
                  </div>

                  {/* Nút nhấp vào để thêm ảnh từ thiết bị vào thư viện */}
                  <label
                    htmlFor="promo-file-input"
                    className={cn(
                      "flex flex-col sm:flex-row items-center justify-center gap-3 p-3.5 border-2 border-dashed rounded-xl transition cursor-pointer text-center sm:text-left",
                      bannerUploading
                        ? "border-amber-400/60 bg-amber-500/5 cursor-wait"
                        : "border-stone-700 hover:border-amber-500/80 bg-stone-950/70 hover:bg-stone-950"
                    )}
                  >
                    <input
                      id="promo-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      disabled={bannerUploading}
                      className="hidden"
                    />
                    {bannerUploading ? (
                      <div className="flex items-center gap-2 text-amber-400 text-xs py-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="font-medium">Đang tải và tối ưu ảnh lên thư viện...</span>
                      </div>
                    ) : (
                      <>
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                            <span>Nhấp vào để thêm ảnh trong thư viện</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-normal">
                              Từ máy / thiết bị
                            </span>
                          </p>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            Ảnh tải lên sẽ được tự động thêm vào thư viện ảnh bên dưới để bạn sử dụng ngay lập tức
                          </p>
                        </div>
                      </>
                    )}
                  </label>

                  {/* Thư viện ảnh trong hệ thống */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium text-stone-400">
                        Thư viện ảnh quán có sẵn (Nhấp chọn ảnh để áp dụng):
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {libraryImages.length} ảnh trong thư viện
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {libraryImages.map((img) => {
                        const isSelected = promoBanner === img.url;
                        return (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => setPromoBanner(img.url)}
                            className={cn(
                              "relative group rounded-lg overflow-hidden border text-left transition flex flex-col bg-stone-950",
                              isSelected
                                ? "border-amber-400 ring-2 ring-amber-400/60"
                                : "border-stone-800 hover:border-stone-600"
                            )}
                          >
                            <div className="aspect-[4/3] w-full overflow-hidden relative bg-stone-900">
                              <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-amber-500/25 backdrop-blur-[1px] flex items-center justify-center">
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center gap-1 shadow">
                                    <Check className="w-3 h-3 stroke-[3]" /> Đang chọn
                                  </span>
                                </div>
                              )}
                              {img.isCustom && (
                                <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-blue-600 text-white text-[9px] font-semibold shadow">
                                  Mới tải
                                </span>
                              )}
                            </div>
                            <div className="p-1.5 bg-stone-950">
                              <p className="text-[10px] text-stone-300 truncate font-medium">{img.title}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Banner Preview khi đã chọn ảnh */}
                  {promoBanner && (
                    <div className="p-2.5 rounded-xl bg-stone-950 border border-amber-500/30 flex items-center gap-3">
                      <div className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-stone-900 border border-stone-800 relative">
                        <img src={promoBanner} alt="Banner Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ✓ Đã chọn ảnh làm banner
                          </span>
                          <span className="text-[11px] text-stone-300 truncate font-medium">
                            {libraryImages.find((i) => i.url === promoBanner)?.title || "Ảnh Banner Khuyến Mãi"}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 truncate mt-0.5 font-mono">{promoBanner}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPromoBanner("")}
                        className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-red-400 transition"
                        title="Gỡ ảnh"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Tùy chọn nhập URL thủ công nếu cần */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setCustomUrlMode(!customUrlMode)}
                      className="text-[10px] text-stone-400 hover:text-stone-300 underline"
                    >
                      {customUrlMode ? "Ẩn tùy chọn nhập link URL" : "Hoặc dán link ảnh trực tiếp (URL ngoài)"}
                    </button>
                    {customUrlMode && (
                      <input
                        type="url"
                        value={promoBanner}
                        onChange={(e) => setPromoBanner(e.target.value)}
                        placeholder="https://..."
                        className="mt-1.5 w-full px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white font-mono"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPromoForm(false)}
                    className="px-3 py-1.5 rounded-lg text-stone-400 hover:text-white text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                  >
                    {actionLoading ? "Đang tạo..." : "Xác nhận tạo KM"}
                  </button>
                </div>
              </form>
            )}

            {/* Danh sách các khuyến mãi */}
            <div className="space-y-2.5">
              {promotions.map((p) => {
                const isExpired = new Date(p.end_at) < new Date();
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "p-3 rounded-xl border flex items-center justify-between gap-3",
                      isExpired
                        ? "bg-stone-900/40 border-stone-800 opacity-50"
                        : "bg-stone-900 border-stone-800"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{p.title}</span>
                        <span
                          className={cn(
                            "text-[9px] uppercase px-1.5 py-0.5 rounded-full font-bold",
                            isExpired
                              ? "bg-rose-950 text-rose-400"
                              : "bg-emerald-950 text-emerald-400"
                          )}
                        >
                          {isExpired ? "ĐÃ HẾT HẠN" : "ĐANG CHẠY"}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">{p.content}</p>
                      <span className="text-[10px] text-stone-500 font-mono flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        Hạn dùng: {new Date(p.end_at).toLocaleString("vi-VN")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePromo(p.id)}
                      className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-950 text-rose-400 border border-rose-900/60 transition-colors"
                      title="Xóa khuyến mãi này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL BẢNG XẾP HẠNG & THỐNG KÊ ĐIỂM HỆ THỐNG */}
        {showRatingModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Xếp Hạng & Điểm Đánh Giá Hệ Thống</h3>
                    <p className="text-[11px] text-stone-400">Thống kê điểm trung bình của toàn bộ 5 chi nhánh</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Điểm tổng quan */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-stone-950 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Điểm Trung Bình Toàn Chuỗi
                  </span>
                  <p className="text-3xl font-black text-amber-400 flex items-center gap-1.5 mt-0.5">
                    {(overview?.overallAvgRating ?? 4.8).toFixed(1)}
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400 inline" />
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-stone-300">Tổng đánh giá Public</span>
                  <p className="text-xl font-black text-white">{overview?.totalPublicReviews ?? 20} bài</p>
                </div>
              </div>

              {/* Danh sách 5 chi nhánh xếp theo điểm số */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Bảng xếp hạng 5 chi nhánh (Điểm cao nhất xếp trên):
                </p>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {([...(overview?.branches || [])])
                    .sort((a, b) => (b.avgRating ?? b.avg_rating ?? 0) - (a.avgRating ?? a.avg_rating ?? 0))
                    .map((b, idx) => (
                      <div
                        key={b.id}
                        className={cn(
                          "p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors",
                          selectedBranchId === b.id
                            ? "bg-amber-500/10 border-amber-500/60"
                            : "bg-stone-950 border-stone-800 hover:border-stone-700"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0",
                              idx === 0
                                ? "bg-amber-400 text-stone-950 shadow"
                                : idx === 1
                                ? "bg-stone-300 text-stone-950"
                                : idx === 2
                                ? "bg-amber-700 text-white"
                                : "bg-stone-800 text-stone-400"
                            )}
                          >
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{b.name}</p>
                            <p className="text-[10px] text-stone-400 truncate">{b.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-xs font-extrabold text-amber-400 flex items-center gap-1 justify-end">
                              {(b.avgRating ?? b.avg_rating ?? 5.0).toFixed(1)}
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            </p>
                            <p className="text-[10px] text-stone-400">
                              {b.totalReviews ?? b.total_reviews ?? 0} đánh giá
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBranchId(b.id);
                              setShowRatingModal(false);
                              setActiveTab("REVIEWS");
                              setHighlightSection("REVIEWS");
                              setTimeout(() => {
                                document.getElementById("reviews-section")?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              }, 100);
                              setTimeout(() => setHighlightSection(null), 2500);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 text-xs font-bold transition border border-amber-500/30"
                          >
                            Xem review
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

