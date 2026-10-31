import { db } from "@/lib/db";
import { AdminOverviewDTO } from "./types";

/**
 * THỐNG KÊ TỔNG QUAN HỆ THỐNG DÀNH CHO ADMIN DASHBOARD
 */
export async function getAdminOverview(): Promise<AdminOverviewDTO & { avgRatingAllBranches: number; totalPublicReviews: number }> {
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
  const totalReviews = branches.reduce((sum, b) => sum + (b.total_reviews ?? 0), 0);

  // 4. Tính điểm sao trung bình toàn hệ thống
  const totalWeightedRating = branches.reduce(
    (sum, b) => sum + (b.avg_rating ?? 5.0) * (b.total_reviews ?? 0),
    0
  );
  const overallAvgRating =
    totalReviews > 0
      ? Number((totalWeightedRating / totalReviews).toFixed(1))
      : 4.8;

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
    totalPublicReviews: totalReviews,
    overallAvgRating,
    avgRatingAllBranches: overallAvgRating,
    activePromotionsCount,
    branches: branches.map((b) => ({
      id: b.id,
      name: b.name,
      address: b.address,
      districtCity: b.district_city,
      district_city: b.district_city,
      status: b.status,
      avgRating: b.avg_rating ?? 5.0,
      avg_rating: b.avg_rating ?? 5.0,
      totalReviews: b.total_reviews ?? 0,
      total_reviews: b.total_reviews ?? 0,
      pendingShadowCount: shadowCountMap.get(b.id) || 0,
      shadowHiddenCount: shadowCountMap.get(b.id) || 0,
    })),
  };
}
