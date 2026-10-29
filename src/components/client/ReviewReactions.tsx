"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * THUỘC TÍNH (PROPS) CHO KHỐI THẢ BIỂU TƯỢNG CẢM XÚC
 */
interface ReviewReactionsProps {
  reviewId: string;
  // Số lượng cảm xúc ban đầu
  initialLikes?: number;
  initialHearts?: number;
  initialYums?: number;
  // Loại cảm xúc mà người dùng hiện tại đã thả (nếu có): "LIKE" | "HEART" | "YUM" | null
  userReaction?: "LIKE" | "HEART" | "YUM" | null;
  // Kiểm tra đăng nhập
  isLoggedIn?: boolean;
  onRequireLogin?: () => void;
}

/**
 * COMPONENT REVIEW REACTIONS (src/components/client/ReviewReactions.tsx)
 * 
 * Mục đích:
 * Thanh tương tác cảm xúc dưới mỗi bài đánh giá:
 * - 👍 Thích (LIKE)
 * - ❤️ Thả tim (HEART)
 * - 🤤 Thèm chảy nước miếng (YUM) - biểu tượng đặc trưng của quán lẩu
 */
export function ReviewReactions({
  reviewId,
  initialLikes = 0,
  initialHearts = 0,
  initialYums = 0,
  userReaction = null,
  isLoggedIn = false,
  onRequireLogin,
}: ReviewReactionsProps) {
  // Trạng thái lưu trữ cảm xúc người dùng đã chọn
  const [currentReaction, setCurrentReaction] = useState<string | null>(userReaction);
  // Số lượng đếm của từng loại cảm xúc
  const [counts, setCounts] = useState({
    LIKE: initialLikes,
    HEART: initialHearts,
    YUM: initialYums,
  });

  // Hàm xử lý khi khách hàng bấm vào một biểu tượng cảm xúc
  const handleToggleReaction = async (type: "LIKE" | "HEART" | "YUM") => {
    // 1. Nếu khách chưa đăng nhập -> Mở Popup Đăng nhập 1 chạm
    if (!isLoggedIn) {
      if (onRequireLogin) onRequireLogin();
      return;
    }

    // 2. Logic cập nhật giao diện lạc quan (Optimistic Update)
    if (currentReaction === type) {
      // Nếu bấm lại vào cảm xúc đang chọn -> Hủy chọn (giảm 1)
      setCurrentReaction(null);
      setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
    } else {
      // Nếu chọn cảm xúc mới -> Giảm cảm xúc cũ (nếu có) và tăng cảm xúc mới
      setCounts((prev) => {
        const next = { ...prev };
        if (currentReaction && currentReaction in next) {
          next[currentReaction as "LIKE" | "HEART" | "YUM"] = Math.max(
            0,
            next[currentReaction as "LIKE" | "HEART" | "YUM"] - 1
          );
        }
        next[type] = next[type] + 1;
        return next;
      });
      setCurrentReaction(type);
    }

    // 3. Gửi yêu cầu cập nhật ngầm lên máy chủ (REST API)
    try {
      await fetch(`/api/reviews/${reviewId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction_type: type }),
      });
    } catch {
      // Bỏ qua lỗi hoặc khôi phục nếu cần
    }
  };

  const reactionButtons = [
    { type: "LIKE" as const, emoji: "👍", label: "Thích", count: counts.LIKE },
    { type: "HEART" as const, emoji: "❤️", label: "Thả tim", count: counts.HEART },
    { type: "YUM" as const, emoji: "🤤", label: "Thèm quá", count: counts.YUM },
  ];

  return (
    <div className="flex items-center gap-2 pt-2 border-t border-stone-100 mt-3">
      {reactionButtons.map((btn) => {
        const isSelected = currentReaction === btn.type;

        return (
          <button
            key={btn.type}
            type="button"
            onClick={() => handleToggleReaction(btn.type)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all active:scale-95",
              isSelected
                ? "bg-amber-100 text-brand-primary border border-amber-300 shadow-xs"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60"
            )}
            title={btn.label}
          >
            <span className="text-sm">{btn.emoji}</span>
            <span>{btn.count > 0 ? btn.count : btn.label}</span>
          </button>
        );
      })}
    </div>
  );
}

