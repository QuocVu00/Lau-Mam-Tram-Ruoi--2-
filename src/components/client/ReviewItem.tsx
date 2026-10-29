"use client";

import React, { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewReactions } from "@/components/client/ReviewReactions";
import { Play, Loader2 } from "lucide-react";

/**
 * ĐỊNH NGHĨA DỮ LIỆU CỦA MỘT TỆP ẢNH/VIDEO ĐÍNH KÈM
 */
export interface MediaItem {
  id: string;
  media_type: "IMAGE" | "VIDEO";
  file_url: string;
  thumbnail_url?: string | null;
  process_status: "PROCESSING" | "READY" | "FAILED";
}

/**
 * ĐỊNH NGHĨA DỮ LIỆU CỦA MỘT BÀI ĐÁNH GIÁ (REVIEW)
 */
export interface ReviewData {
  id: string;
  user_name: string;
  user_avatar?: string | null;
  oauth_provider?: string;
  rating: number;
  comment: string;
  created_at: string | Date;
  media?: MediaItem[];
  likes_count?: number;
  hearts_count?: number;
  yums_count?: number;
}

interface ReviewItemProps {
  review: ReviewData;
  isLoggedIn?: boolean;
  onRequireLogin?: () => void;
}

/**
 * COMPONENT REVIEW ITEM (src/components/client/ReviewItem.tsx)
 * 
 * Mục đích:
 * Hiển thị 1 bài đánh giá của khách hàng:
 * - Tên + Avatar MXH (Google/Zalo/FB).
 * - Số sao từ 1 đến 5.
 * - Nội dung nhận xét.
 * - Lưới ảnh WebP hoặc video MP4 (kèm trạng thái xử lý ngầm).
 * - Khối thả cảm xúc (ReviewReactions).
 */
export function ReviewItem({
  review,
  isLoggedIn = false,
  onRequireLogin,
}: ReviewItemProps) {
  // Trạng thái mở xem video trực tiếp
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Định dạng thời gian đăng thân thiện (VD: "2 ngày trước" hoặc "15:30 29/10/2026")
  const formattedDate = new Date(review.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
      
      {/* 1. Phần đầu: Avatar, Tên người dùng và Ngày đăng */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          {review.user_avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.user_avatar}
              alt={review.user_name}
              className="w-9 h-9 rounded-full object-cover border border-amber-200 shadow-xs"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary font-black text-sm flex items-center justify-center">
              {review.user_name ? review.user_name.charAt(0).toUpperCase() : "K"}
            </div>
          )}

          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 leading-tight">
              {review.user_name}
            </h4>
            <span className="text-[10px] text-stone-600 font-medium">
              Đăng ngày {formattedDate}
            </span>
          </div>
        </div>

        {/* Số sao đánh giá */}
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* 2. Nội dung nhận xét của khách */}
      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3 whitespace-pre-line">
        {review.comment}
      </p>

      {/* 3. Lưới hiển thị Ảnh & Video đính kèm */}
      {review.media && review.media.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
          {review.media.map((item) => {
            // Trường hợp là ẢNH (.webp)
            if (item.media_type === "IMAGE") {
              return (
                <div
                  key={item.id}
                  className="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200/70"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.file_url}
                    alt="Ảnh đánh giá"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
              );
            }

            // Trường hợp là VIDEO
            const isProcessing = item.process_status === "PROCESSING";

            return (
              <div
                key={item.id}
                className="aspect-square rounded-xl overflow-hidden bg-stone-900 relative group cursor-pointer"
              >
                {/* Nếu video đang trong tiến trình nén ngầm tại Server */}
                {isProcessing ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-amber-200 text-center p-2">
                    <Loader2 className="w-5 h-5 animate-spin mb-1" />
                    <span className="text-[9px] font-bold">Đang nén video</span>
                  </div>
                ) : playingVideoId === item.id ? (
                  // Đang phát video trực tiếp
                  <video
                    src={item.file_url}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Hiển thị ảnh bìa (Thumbnail) kèm nút Play
                  <div
                    onClick={() => setPlayingVideoId(item.id)}
                    className="w-full h-full relative"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail_url || item.file_url}
                      alt="Thumbnail video"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Khối nút thả biểu tượng cảm xúc (👍 ❤️ 🤤) */}
      <ReviewReactions
        reviewId={review.id}
        initialLikes={review.likes_count || 0}
        initialHearts={review.hearts_count || 0}
        initialYums={review.yums_count || 0}
        isLoggedIn={isLoggedIn}
        onRequireLogin={onRequireLogin}
      />

    </div>
  );
}

