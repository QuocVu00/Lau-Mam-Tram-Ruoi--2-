import { db } from "@/lib/db";
import { recalculateBranchRating } from "./branch.service";
import { MediaType, ReactionType, ReviewDTO, ReviewStatus } from "./types";

interface GetReviewsOptions {
  branchId: string;
  tab?: "ALL" | "MEDIA" | "5" | "4" | "3" | "2" | "1" | string;
  page?: number;
  limit?: number;
  currentUserId?: string | null;
  currentSessionId?: string | null;
}

/**
 * LẤY DANH SÁCH ĐÁNH GIÁ CỦA CHI NHÁNH
 * Nghiệp vụ cốt lõi:
 * 1. Logic Shadowban: Chỉ hiển thị bài PUBLIC cho tất cả khách;
 *    bài SHADOW_HIDDEN chỉ hiển thị cho CHÍNH người đăng (theo user_id hoặc session_id).
 *    Bài DELETED không hiển thị cho ai cả.
 * 2. Ưu tiên bài mới nhất lên đầu (created_at DESC).
 * 3. Hỗ trợ lọc theo tab: Tất cả | Có hình ảnh/video | 5 sao | 4 sao | 3 sao | 2 sao | 1 sao.
 */
export async function getBranchReviews(options: GetReviewsOptions) {
  const {
    branchId,
    tab = "ALL",
    page = 1,
    limit = 10,
    currentUserId,
    currentSessionId,
  } = options;

  const skip = (Math.max(1, page) - 1) * limit;

  // Xây dựng điều kiện lọc Shadowban
  const visibilityCondition: any = {
    OR: [
      { status: "PUBLIC" },
      ...(currentUserId || currentSessionId
        ? [
            {
              status: "SHADOW_HIDDEN",
              OR: [
                ...(currentUserId ? [{ user_id: currentUserId }] : []),
                ...(currentSessionId ? [{ session_id: currentSessionId }] : []),
              ],
            },
          ]
        : []),
    ],
  };

  const whereClause: any = {
    branch_id: branchId,
    ...visibilityCondition,
  };

  // Áp dụng bộ lọc Tab
  if (tab === "MEDIA") {
    whereClause.media = {
      some: {},
    };
  } else if (["1", "2", "3", "4", "5"].includes(tab)) {
    whereClause.rating = parseInt(tab, 10);
  }

  // Đếm tổng số bài phù hợp với bộ lọc và điều kiện Shadowban
  const totalCount = await db.review.count({
    where: whereClause,
  });

  // Lấy danh sách bài đánh giá (sắp xếp Mới nhất lên đầu)
  const reviews = await db.review.findMany({
    where: whereClause,
    orderBy: { created_at: "desc" },
    skip,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          display_name: true,
          avatar_url: true,
          oauth_provider: true,
        },
      },
      media: {
        select: {
          id: true,
          media_type: true,
          file_url: true,
          thumbnail_url: true,
          process_status: true,
        },
      },
      reactions: {
        select: {
          id: true,
          reaction_type: true,
          user_id: true,
          session_id: true,
        },
      },
    },
  });

  const formattedReviews: ReviewDTO[] = reviews.map((r) => {
    // Đếm tổng số reactions của bài
    const counts = { LIKE: 0, HEART: 0, YUM: 0, WOW: 0 };
    let userReaction: ReactionType | null = null;

    for (const react of r.reactions) {
      if (react.reaction_type in counts) {
        counts[react.reaction_type as ReactionType]++;
      }
      if (
        (currentUserId && react.user_id === currentUserId) ||
        (currentSessionId && react.session_id === currentSessionId)
      ) {
        userReaction = react.reaction_type as ReactionType;
      }
    }

    return {
      id: r.id,
      branchId: r.branch_id,
      rating: r.rating,
      comment: r.comment,
      status: r.status as ReviewStatus,
      createdAt: r.created_at,
      user: {
        id: r.user.id,
        displayName: r.user.display_name,
        avatarUrl: r.user.avatar_url,
        oauthProvider: r.user.oauth_provider,
      },
      media: r.media.map((m) => ({
        id: m.id,
        mediaType: m.media_type as MediaType,
        fileUrl: m.file_url,
        thumbnailUrl: m.thumbnail_url,
        processStatus: m.process_status as any,
      })),
      reactions: {
        ...counts,
        userReaction,
      },
    };
  });

  return {
    items: formattedReviews,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

/**
 * ĐĂNG BÀI ĐÁNH GIÁ MỚI
 * - Tạo bài review trong DB
 * - Đính kèm các ảnh/video
 * - TỰ ĐỘNG TÍNH LẠI Điểm sao trung bình và Tổng đánh giá của chi nhánh ngay lập tức
 */
export async function createReview(params: {
  branchId: string;
  userId: string;
  sessionId?: string | null;
  rating: number;
  comment: string;
  media?: Array<{
    mediaType: "IMAGE" | "VIDEO";
    fileUrl: string;
    thumbnailUrl?: string | null;
    processStatus?: "PROCESSING" | "READY";
  }>;
}) {
  const { branchId, userId, sessionId, rating, comment, media = [] } = params;

  if (rating < 1 || rating > 5) {
    throw new Error("Số sao đánh giá phải từ 1 đến 5");
  }

  const review = await db.review.create({
    data: {
      branch_id: branchId,
      user_id: userId,
      session_id: sessionId || null,
      rating,
      comment: comment.trim(),
      status: "PUBLIC",
      media: {
        create: media.map((m) => ({
          media_type: m.mediaType,
          file_url: m.fileUrl,
          thumbnail_url: m.thumbnailUrl || null,
          process_status: m.processStatus || "READY",
        })),
      },
    },
    include: {
      user: true,
      media: true,
    },
  });

  // Tự động tính lại điểm sao chi nhánh
  await recalculateBranchRating(branchId);

  return review;
}

/**
 * THẢ / GỠ BIỂU TƯỢNG CẢM XÚC (REACTIONS)
 * Hỗ trợ LIKE, HEART, YUM, WOW
 * Chống spam rate limiting dựa trên tổ hợp user_id / session_id
 */
const reactionRateLimitMap = new Map<string, number>();

export async function toggleReviewReaction(params: {
  reviewId: string;
  userId?: string | null;
  sessionId?: string | null;
  reactionType: ReactionType;
}) {
  const { reviewId, userId, sessionId, reactionType } = params;

  if (!userId && !sessionId) {
    throw new Error("Cần định danh người dùng hoặc phiên để thả cảm xúc");
  }

  // Rate Limiting: 1 hành động mỗi 500ms cho cùng một user/session
  const identityKey = `${userId || sessionId}_react_${reviewId}`;
  const now = Date.now();
  const lastAction = reactionRateLimitMap.get(identityKey) || 0;
  if (now - lastAction < 500) {
    throw new Error("Bạn đang thao tác quá nhanh, vui lòng chờ giây lát");
  }
  reactionRateLimitMap.set(identityKey, now);

  // Tìm reaction hiện tại của người này trên bài này
  const existing = await db.reviewReaction.findFirst({
    where: {
      review_id: reviewId,
      OR: [
        ...(userId ? [{ user_id: userId }] : []),
        ...(sessionId ? [{ session_id: sessionId }] : []),
      ],
    },
  });

  if (existing) {
    if (existing.reaction_type === reactionType) {
      // Bấm lại đúng loại cũ -> Gỡ bỏ cảm xúc
      await db.reviewReaction.delete({ where: { id: existing.id } });
      return { action: "REMOVED", reactionType: null };
    } else {
      // Đổi sang loại cảm xúc khác
      await db.reviewReaction.update({
        where: { id: existing.id },
        data: { reaction_type: reactionType },
      });
      return { action: "CHANGED", reactionType };
    }
  } else {
    // Thả mới
    await db.reviewReaction.create({
      data: {
        review_id: reviewId,
        user_id: userId || null,
        session_id: sessionId || null,
        reaction_type: reactionType,
      },
    });
    return { action: "ADDED", reactionType };
  }
}

/**
 * DÀNH CHO ADMIN: KIỂM DUYỆT ĐÁNH GIÁ (SILENT DELETE & SHADOWBAN)
 * 1. Chuyển trạng thái sang PUBLIC | SHADOW_HIDDEN | DELETED
 * 2. Tự động tính lại Điểm sao trung bình chi nhánh tức thì
 * 3. Hoàn toàn âm thầm, không gửi thông báo
 */
export async function moderateReview(
  reviewId: string,
  newStatus: ReviewStatus
) {
  const review = await db.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Không tìm thấy bài đánh giá");
  }

  if (newStatus === "DELETED") {
    // Chế độ Silent Delete: Xóa vĩnh viễn khỏi Database
    await db.review.delete({
      where: { id: reviewId },
    });
  } else {
    // Cập nhật trạng thái (PUBLIC hoặc SHADOW_HIDDEN)
    await db.review.update({
      where: { id: reviewId },
      data: { status: newStatus },
    });
  }

  // Tự động tính lại điểm sao cho chi nhánh ngay lập tức
  const updatedRating = await recalculateBranchRating(review.branch_id);

  return {
    reviewId,
    status: newStatus,
    branchRating: updatedRating,
  };
}

/**
 * DÀNH CHO ADMIN: XEM TOÀN BỘ REVIEW CỦA CHI NHÁNH
 * (Hiển thị cả bài PUBLIC, SHADOW_HIDDEN, DELETED, kèm IP và thông tin phiên)
 */
export async function adminGetBranchReviews(branchId: string) {
  return await db.review.findMany({
    where: { branch_id: branchId },
    orderBy: { created_at: "desc" },
    include: {
      user: true,
      session: {
        select: {
          id: true,
          ip_address: true,
          device_fingerprint: true,
          created_at: true,
        },
      },
      media: true,
      reactions: true,
    },
  });
}

