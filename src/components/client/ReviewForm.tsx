"use client";

import React, { useState, useRef } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Camera, X, Send, AlertCircle } from "lucide-react";

interface ReviewFormProps {
  branchId: string;
  isLoggedIn?: boolean;
  onRequireLogin?: () => void;
  // Callback khi đăng bài thành công để thêm bài mới vào đầu danh sách
  onReviewSubmitted?: (newReview: unknown) => void;
}

/**
 * COMPONENT REVIEW FORM (src/components/client/ReviewForm.tsx)
 * 
 * Mục đích:
 * Biểu mẫu để khách tại bàn gửi bài đánh giá:
 * 1. Chạm chọn từ 1 đến 5 sao.
 * 2. Nhập nhận xét cảm nhận món ăn.
 * 3. Đính kèm ảnh/video chụp trực tiếp từ Camera iPhone hoặc chọn từ Thư viện máy.
 * 
 * Kỹ thuật cốt lõi (iOS Camera Compatibility):
 * Thẻ input cấu hình chuẩn: accept="image/*,video/*"
 * Giúp Safari trên iPhone tự động kích hoạt menu hệ thống:
 * [Chụp ảnh hoặc Quay video] / [Thư viện ảnh].
 */
export function ReviewForm({
  branchId,
  isLoggedIn = false,
  onRequireLogin,
  onReviewSubmitted,
}: ReviewFormProps) {
  // Trạng thái Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tham chiếu tới thẻ input file ẩn
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý khi khách chọn file từ Camera hoặc Thư viện
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    // Giới hạn tối đa 5 file đính kèm mỗi bài đánh giá
    const newFiles = [...selectedFiles, ...files].slice(0, 5);
    setSelectedFiles(newFiles);

    // Tạo URL xem trước (preview) cục bộ trên trình duyệt
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);
  };

  // Xóa một file đã chọn
  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(updatedPreviews);
  };

  // Xử lý gửi bài đánh giá
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Kiểm tra đăng nhập
    if (!isLoggedIn) {
      if (onRequireLogin) onRequireLogin();
      return;
    }

    // 2. Kiểm tra nội dung bắt buộc
    if (!comment.trim()) {
      setErrorMsg("Vui lòng viết vài lời nhận xét về món ăn bạn nhé!");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 3. Chuẩn bị FormData để tải cả chữ và tệp media lên Server
      const formData = new FormData();
      formData.append("branch_id", branchId);
      formData.append("rating", rating.toString());
      formData.append("comment", comment);

      selectedFiles.forEach((file) => {
        formData.append("media_files", file);
      });

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Không thể gửi đánh giá, vui lòng thử lại!");
      }

      const data = await res.json();

      // Reset form sau khi đăng thành công
      setComment("");
      setRating(5);
      setSelectedFiles([]);
      setPreviewUrls([]);

      if (onReviewSubmitted) {
        onReviewSubmitted(data.review);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-mobile mb-6">
      
      {/* Tiêu đề Form */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight">
            Đánh giá trải nghiệm tại bàn
          </h3>
          <p className="text-[11px] text-stone-600">
            Ý kiến của bạn giúp Lẩu Mắm Trăm Rưỡi nâng cao chất lượng phục vụ
          </p>
        </div>

        {/* Chạm chọn số sao (interactive = true) */}
        <div className="flex flex-col items-end">
          <StarRating
            rating={rating}
            interactive={true}
            onRatingChange={(newScore) => setRating(newScore)}
            size="md"
          />
          <span className="text-[11px] font-bold text-amber-700 mt-0.5">
            {rating} sao ({rating === 5 ? "Tuyệt vời" : rating === 4 ? "Rất ngon" : rating === 3 ? "Bình thường" : "Cần cải thiện"})
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        
        {/* Ô nhập cảm nhận món ăn */}
        <div className="relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            // Nếu chưa đăng nhập, bấm vào ô textarea là tự kích hoạt mở Popup
            onFocus={() => {
              if (!isLoggedIn && onRequireLogin) onRequireLogin();
            }}
            placeholder="Nước lẩu thế nào? Rau đồng có tươi không? Bạn thích nhất món gì tại quán..."
            rows={3}
            className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-xs sm:text-sm text-stone-900 placeholder:text-stone-600 outline-none resize-none transition-all"
          />
        </div>

        {/* Danh sách ảnh/video xem trước (Preview) */}
        {previewUrls.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Thông báo lỗi nếu có */}
        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Nút đính kèm ảnh và nút Đăng */}
        <div className="flex items-center justify-between pt-1">
          
          {/* Thẻ input ẩn hỗ trợ mở Camera chuẩn iPhone */}
          <input
            ref={fileInputRef}
            type="file"
            // Chuẩn iOS: Mở camera chụp/quay trực tiếp hoặc chọn từ thư viện
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => {
              if (!isLoggedIn && onRequireLogin) {
                onRequireLogin();
                return;
              }
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all active:scale-95"
          >
            <Camera className="w-4 h-4 text-brand-secondary" />
            <span>Chụp ảnh / Thêm video</span>
            {selectedFiles.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-primary text-white text-[10px] flex items-center justify-center">
                {selectedFiles.length}
              </span>
            )}
          </button>

          {/* Nút gửi bài */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 disabled:opacity-50 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Đang gửi..." : "Đăng đánh giá"}</span>
          </button>

        </div>

      </form>

    </div>
  );
}

