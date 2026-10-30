"use client";

import React, { useEffect, useState } from "react";
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAdminAuth, setIsAdminAuth] = useState(false);
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

  // 0. BẮT BUỘC ĐĂNG NHẬP ADMIN - Kiểm tra quyền Quản trị viên
  useEffect(() => {
    async function checkAdminAuth() {
      try {
        const res = await fetch("/api/admin/auth/me");
        const json = await res.json();
        if (!json.authenticated) {
          router.replace("/admin/login");
          return;
        }
        setIsAdminAuth(true);
      } catch {
        router.replace("/admin/login");
      }
    }
    checkAdminAuth();
  }, [router]);

  // 1. Tải Overview & Khuyến mãi
  const loadOverview = async () => {
    try {
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
  };

  const loadPromotions = async () => {
    try {
      const res = await fetch("/api/admin/promotions");
      const json = await res.json();
      if (json.success && json.data) {
        setPromotions(json.data);
      }
    } catch (e) {
      console.error("Lỗi tải promotions admin:", e);
    }
  };

  useEffect(() => {
    loadOverview();
    loadPromotions();
  }, []);

  // 2. Tải reviews của branch đang chọn
  const loadReviews = async (branchId: string) => {
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
  };

  useEffect(() => {
    if (selectedBranchId) {
      loadReviews(selectedBranchId);
    }
  }, [selectedBranchId]);

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

  // 4. Tạo Khuyến mãi mới (để test tự động ẩn)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-400">Đang tải Admin Dashboard...</p>
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
            <p className="text-2xl font-black text-white">{overview?.totalBranches || 0}</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-bold mb-1">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Tổng đánh giá Public</span>
            </div>
            <p className="text-2xl font-black text-white">{overview?.totalReviews || 0}</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-bold mb-1">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Điểm TB Toàn Hệ Thống</span>
            </div>
            <p className="text-2xl font-black text-amber-400">{overview?.overallAvgRating || 5.0} ⭐</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Khuyến mãi hiệu lực</span>
            </div>
            <p className="text-2xl font-black text-white">{overview?.activePromotionsCount || 0}</p>
          </div>
        </div>

        {/* Chuyển đổi Tab Chức năng */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("REVIEWS")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase transition-all",
              activeTab === "REVIEWS"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "bg-stone-800 text-stone-400 hover:text-white"
            )}
          >
            Kiểm Duyệt Review & Shadowban
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PROMOTIONS")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase transition-all",
              activeTab === "PROMOTIONS"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "bg-stone-800 text-stone-400 hover:text-white"
            )}
          >
            Quản Lý Khuyến Mãi ({promotions.length})
          </button>
        </div>

        {activeTab === "REVIEWS" ? (
          <>
            {/* Danh sách Chi nhánh */}
            <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 sm:p-5">
              <h2 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider mb-3">
                Chọn Chi Nhánh Để Kiểm Duyệt
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
                        ? "bg-amber-500/10 border-amber-500 text-white shadow-sm"
                        : "bg-stone-900/60 border-stone-700/60 text-stone-300 hover:bg-stone-900"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate max-w-[200px]">{b.name}</span>
                      <span className="text-xs font-black text-amber-400">{b.avgRating.toFixed(1)} ⭐</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>{b.totalReviews} đánh giá</span>
                      {b.pendingShadowCount > 0 && (
                        <span className="text-purple-400 font-bold">
                          {b.pendingShadowCount} đang ẩn (Shadowban)
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bảng Danh sách Đánh giá của Chi nhánh */}
            <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-black text-base text-white">
                    Kiểm Duyệt Đánh Giá ({branchReviews.length})
                  </h2>
                  <p className="text-xs text-stone-400">
                    Chế độ Shadowban giữ cho người đăng vẫn thấy bài nhưng ẩn khỏi khách khác và không tính điểm
                  </p>
                </div>
                <button
                  onClick={() => {
                    loadOverview();
                    loadReviews(selectedBranchId);
                  }}
                  className="p-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-300"
                >
                  <RefreshCw className={cn("w-4 h-4", actionLoading && "animate-spin")} />
                </button>
              </div>

              <div className="space-y-3">
                {branchReviews.length === 0 ? (
                  <p className="text-center text-xs text-stone-500 py-6">
                    Chưa có bài đánh giá nào cho chi nhánh này.
                  </p>
                ) : (
                  branchReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        rev.status === "SHADOW_HIDDEN"
                          ? "bg-purple-950/20 border-purple-800/60"
                          : "bg-stone-900/60 border-stone-700/60"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"}
                            alt={rev.user.display_name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">{rev.user.display_name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 uppercase font-mono">
                                {rev.user.oauth_provider}
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-500">
                              IP: {rev.session?.ip_address || "N/A"} | {new Date(rev.created_at).toLocaleString("vi-VN")}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                              rev.status === "PUBLIC"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : rev.status === "SHADOW_HIDDEN"
                                  ? "bg-purple-950 text-purple-400 border border-purple-800"
                                  : "bg-rose-950 text-rose-400 border border-rose-800"
                            )}
                          >
                            {rev.status === "PUBLIC"
                              ? "Công Khai"
                              : rev.status === "SHADOW_HIDDEN"
                                ? "Shadowban (Ẩn ngầm)"
                                : "Đã Xóa"}
                          </span>
                          <span className="text-xs font-black text-amber-400">{rev.rating} ⭐</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-200 leading-relaxed mb-3">{rev.comment}</p>

                      {/* Hành động kiểm duyệt */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800 text-xs">
                        {rev.status !== "PUBLIC" && (
                          <button
                            type="button"
                            onClick={() => handleModeration(rev.id, "PUBLIC")}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 font-bold transition-colors text-[11px]"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Khôi phục Công Khai</span>
                          </button>
                        )}

                        {rev.status !== "SHADOW_HIDDEN" && (
                          <button
                            type="button"
                            onClick={() => handleModeration(rev.id, "SHADOW_HIDDEN")}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-300 font-bold transition-colors text-[11px]"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Ẩn thông minh (Shadowban)</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bài này?")) {
                              handleModeration(rev.id, "DELETED");
                            }
                          }}
                          disabled={actionLoading}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-300 font-bold transition-colors text-[11px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa vĩnh viễn</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          /* Tab Quản lý Khuyến Mãi */
          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-base text-white">Quản Lý Chương Trình Khuyến Mãi</h2>
                <p className="text-xs text-stone-400">
                  Tự động hiển thị và tự động ẩn khi đến hạn (Kịch bản kiểm thử 7)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPromoForm(!showPromoForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Khuyến Mãi Mới</span>
              </button>
            </div>

            {/* Form tạo mới khuyến mãi */}
            {showPromoForm && (
              <form onSubmit={handleCreatePromo} className="p-4 bg-stone-900 rounded-xl border border-stone-700 space-y-3">
                <h3 className="font-bold text-xs text-amber-400 uppercase">Tạo Chương Trình Khuyến Mãi Nhanh</h3>
                <input
                  type="text"
                  placeholder="Tiêu đề khuyến mãi (VD: Tặng Mẹt Rau Đồng)"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-xs text-white"
                  required
                />
                <textarea
                  rows={2}
                  placeholder="Nội dung chi tiết chương trình..."
                  value={promoContent}
                  onChange={(e) => setPromoContent(e.target.value)}
                  className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-xs text-white resize-none"
                  required
                />
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-stone-400 block mb-1">Thời lượng hiệu lực:</label>
                    <select
                      value={promoMinutes}
                      onChange={(e) => setPromoMinutes(Number(e.target.value))}
                      className="w-full p-2 bg-stone-800 border border-stone-700 rounded-lg text-xs text-white"
                    >
                      <option value={1}>1 phút (Test tự ẩn nhanh)</option>
                      <option value={5}>5 phút (Theo Kịch bản 7 BRD)</option>
                      <option value={60}>1 giờ</option>
                      <option value={1440}>1 ngày</option>
                      <option value={43200}>30 ngày</option>
                    </select>
                  </div>
                  <div className="pt-5">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm"
                    >
                      Xác nhận tạo
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Danh sách Khuyến mãi */}
            <div className="space-y-3 pt-2">
              {promotions.map((p) => {
                const now = new Date();
                const isExpired = new Date(p.endAt) < now;

                return (
                  <div
                    key={p.id}
                    className={cn(
                      "p-4 rounded-xl border flex items-center justify-between gap-4",
                      isExpired ? "bg-stone-900/40 border-stone-800 opacity-60" : "bg-stone-900/80 border-stone-700"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-white">{p.title}</span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            isExpired ? "bg-rose-950 text-rose-400 border border-rose-800" : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          )}
                        >
                          {isExpired ? "Đã Hết Hạn (Tự ẩn)" : "Đang Hiệu Lực"}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 font-mono">
                          {p.scope}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">{p.content}</p>
                      <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Hết hạn lúc: {new Date(p.endAt).toLocaleString("vi-VN")}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePromo(p.id)}
                      className="p-2 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300"
                      title="Xóa khuyến mãi"
                    >
                      <Trash2 className="w-4 h-4" />
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
