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

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form tạo khuyến mãi
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoContent, setPromoContent] = useState("");
  const [promoBanner, setPromoBanner] = useState("");
  const [promoMinutes, setPromoMinutes] = useState(5);

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

  // 4. Tạo Khuyến mãi mới
  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle || !promoContent) return;

    setActionLoading(true);
    try {
      const startAt = new Date().toISOString();
      const endAt = new Date(Date.now() + promoMinutes * 60 * 1000).toISOString();

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
              router.push("/admin/login");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất Admin</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Thống kê Tổng quan (Overview Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-bold mb-1">
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>Tổng chi nhánh</span>
            </div>
            <p className="text-2xl font-black text-white">{overview?.totalBranches ?? 5}</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-bold mb-1">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Tổng đánh giá Public</span>
            </div>
            <p className="text-2xl font-black text-white">{overview?.totalPublicReviews ?? 20}</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-bold mb-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Điểm TB Toàn Hệ Thống</span>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-2xl font-black text-amber-400">{overview?.avgRatingAllBranches?.toFixed(1) ?? "4.8"}</p>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Khuyến mãi hiệu lực</span>
            </div>
            <p className="text-2xl font-black text-white">{overview?.activePromotionsCount ?? promotions.length}</p>
          </div>
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
            <div className="bg-stone-800/60 border border-stone-700/60 rounded-2xl p-4">
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                Chọn chi nhánh để kiểm duyệt
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {overview?.branches?.map((b: any) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBranchId(b.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all",
                      selectedBranchId === b.id
                        ? "bg-stone-900 border-amber-500 shadow-sm"
                        : "bg-stone-800/40 border-stone-700/60 hover:border-stone-600"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate max-w-[200px]">{b.name}</p>
                      <span className="text-xs text-amber-400 font-extrabold flex items-center gap-1">
                        {b.avg_rating.toFixed(1)} <Star className="w-3 h-3 fill-amber-400" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                      <span>{b.total_reviews} đánh giá</span>
                      {b.shadowHiddenCount > 0 && (
                        <span className="text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/60">
                          {b.shadowHiddenCount} đang ẩn (Shadowban)
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Danh sách bài đánh giá cần kiểm duyệt */}
            <div className="bg-stone-800/60 border border-stone-700/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Kiểm Duyệt Đánh Giá</span>
                    <span className="text-xs font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded-full">
                      ({branchReviews.length})
                    </span>
                  </h2>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Chế độ Shadowban giữ cho người đăng vẫn thấy bài nhưng ẩn khỏi khách khác và không tính điểm
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => loadReviews(selectedBranchId)}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 transition-colors"
                  title="Tải lại danh sách"
                >
                  <RefreshCw className={cn("w-4 h-4", actionLoading && "animate-spin")} />
                </button>
              </div>

              {branchReviews.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Chi nhánh này hiện chưa có bài đánh giá nào.
                </div>
              ) : (
                <div className="space-y-3">
                  {branchReviews.map((rev) => (
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
                              IP: {rev.ip_address || "::1"} | {new Date(rev.created_at).toLocaleTimeString("vi-VN")}{" "}
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
          </>
        ) : (
          /* TAB QUẢN LÝ KHUYẾN MÃI */
          <div className="bg-stone-800/60 border border-stone-700/60 rounded-2xl p-4">
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
                  Tạo khuyến mãi thử nghiệm (Tự ẩn sau thời gian định sẵn)
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">URL ảnh Banner (tùy chọn):</label>
                    <input
                      type="url"
                      value={promoBanner}
                      onChange={(e) => setPromoBanner(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Hết hạn sau (phút):</label>
                    <input
                      type="number"
                      min={1}
                      max={1440}
                      value={promoMinutes}
                      onChange={(e) => setPromoMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white font-mono"
                    />
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
      </main>
    </div>
  );
}
