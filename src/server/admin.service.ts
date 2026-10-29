import { db } from "@/lib/db";
import { AdminOverviewDTO } from "./types";

/**
 * THỐNG KÊ TỔNG QUAN HỆ THỐNG DÀNH CHO ADMIN DASHBOARD
 */
export async function getAdminOverview(): Promise<AdminOverviewDTO> {
  const now = new Date();

  // 1. Lấy tất cả chi nhánh
  const branches = await db.branch.findMany({
    orderBy: { created_at: "asc" },
  });

  // 2. Lấy số lượng review đang bị Shadowban của từng chi nhánh
  const shadowbannedReviews = await db.review.groupBy({
    by: ["branch_id"],
    where: { status: "SHADOW_HIDDEN" },
    _count: { id: true },
  });

  const shadowCountMap = new Map<string, number>();
  for (const s of shadowbannedReviews) {
    shadowCountMap.set(s.branch_id, s._count.id);
  }

  // 3. Đếm tổng review PUBLIC toàn hệ thống
  const totalReviews = branches.reduce((sum, b) => sum + b.total_reviews, 0);

  // 4. Tính điểm sao trung bình toàn hệ thống
  const totalWeightedRating = branches.reduce(
    (sum, b) => sum + b.avg_rating * b.total_reviews,
    0
  );
  const overallAvgRating =
    totalReviews > 0
      ? Number((totalWeightedRating / totalReviews).toFixed(1))
      : 5.0;

  // 5. Đếm số khuyến mãi đang hoạt động
  const activePromotionsCount = await db.promotion.count({
    where: {
      is_active: true,
      start_at: { lte: now },
      end_at: { gte: now },
    },
  });

  return {
    totalBranches: branches.length,
    totalReviews,
    overallAvgRating,
    activePromotionsCount,
    branches: branches.map((b) => ({
      id: b.id,
      name: b.name,
      address: b.address,
      districtCity: b.district_city,
      status: b.status,
      avgRating: b.avg_rating,
      totalReviews: b.total_reviews,
      pendingShadowCount: shadowCountMap.get(b.id) || 0,
    })),
  };
}

