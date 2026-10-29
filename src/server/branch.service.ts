import { db } from "@/lib/db";
import { BranchDTO, BranchStatus } from "./types";

/**
 * Lấy danh sách toàn bộ chi nhánh (kèm lọc theo quận/huyện, tỉnh/thành hoặc từ khóa)
 */
export async function getBranches(params?: {
  location?: string | null;
  search?: string | null;
  onlyActive?: boolean;
}): Promise<BranchDTO[]> {
  const whereClause: any = {};

  if (params?.onlyActive !== false) {
    whereClause.status = "ACTIVE";
  }

  if (params?.location && params.location.trim() !== "") {
    whereClause.district_city = {
      contains: params.location.trim(),
      mode: "insensitive",
    };
  }

  if (params?.search && params.search.trim() !== "") {
    whereClause.OR = [
      { name: { contains: params.search.trim(), mode: "insensitive" } },
      { address: { contains: params.search.trim(), mode: "insensitive" } },
      { district_city: { contains: params.search.trim(), mode: "insensitive" } },
    ];
  }

  const branches = await db.branch.findMany({
    where: whereClause,
    orderBy: [{ avg_rating: "desc" }, { total_reviews: "desc" }],
  });

  return branches.map((b) => ({
    id: b.id,
    name: b.name,
    address: b.address,
    districtCity: b.district_city,
    googleMapUrl: b.google_map_url,
    hotline: b.hotline,
    openHours: b.open_hours,
    coverImages: b.cover_images ? JSON.parse(b.cover_images) : [],
    avgRating: b.avg_rating,
    totalReviews: b.total_reviews,
    status: b.status as BranchStatus,
    createdAt: b.created_at,
  }));
}

/**
 * Lấy chi tiết 1 chi nhánh kèm khuyến mãi áp dụng (gộp GLOBAL + BRANCH của chi nhánh đó)
 */
export async function getBranchDetail(branchId: string) {
  const branch = await db.branch.findUnique({
    where: { id: branchId },
  });

  if (!branch) return null;

  // Lấy các khuyến mãi đang hiệu lực (NOW() BETWEEN start_at AND end_at)
  const now = new Date();
  const allActivePromotions = await db.promotion.findMany({
    where: {
      is_active: true,
      start_at: { lte: now },
      end_at: { gte: now },
    },
    orderBy: { created_at: "desc" },
  });

  // Lọc: scope = GLOBAL hoặc scope = BRANCH và branchIds có chứa branchId này
  const applicablePromotions = allActivePromotions.filter((p) => {
    if (p.scope === "GLOBAL") return true;
    if (p.scope === "BRANCH" && p.branch_ids) {
      try {
        const ids = JSON.parse(p.branch_ids) as string[];
        return Array.isArray(ids) && ids.includes(branchId);
      } catch {
        return false;
      }
    }
    return false;
  });

  return {
    branch: {
      id: branch.id,
      name: branch.name,
      address: branch.address,
      districtCity: branch.district_city,
      googleMapUrl: branch.google_map_url,
      hotline: branch.hotline,
      openHours: branch.open_hours,
      coverImages: branch.cover_images ? JSON.parse(branch.cover_images) : [],
      avgRating: branch.avg_rating,
      totalReviews: branch.total_reviews,
      status: branch.status as BranchStatus,
      createdAt: branch.created_at,
    },
    promotions: applicablePromotions.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      bannerUrl: p.banner_url,
      scope: p.scope,
      startAt: p.start_at,
      endAt: p.end_at,
    })),
  };
}

/**
 * TỰ ĐỘNG TÍNH LẠI ĐIỂM SAO TRUNG BÌNH & TỔNG ĐÁNH GIÁ CỦA CHI NHÁNH
 * Nghiệp vụ cốt lõi: Chỉ tính trên các bản ghi có status = 'PUBLIC'
 * Phải được kích hoạt mỗi khi:
 * 1. Khách tạo review mới
 * 2. Admin đổi trạng thái review (SHADOW_HIDDEN hoặc DELETED)
 * 3. Admin khôi phục review về PUBLIC
 */
export async function recalculateBranchRating(branchId: string): Promise<{
  avgRating: number;
  totalReviews: number;
}> {
  const publicReviews = await db.review.findMany({
    where: {
      branch_id: branchId,
      status: "PUBLIC",
    },
    select: { rating: true },
  });

  const totalReviews = publicReviews.length;
  const avgRating =
    totalReviews > 0
      ? Number(
          (
            publicReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
          ).toFixed(1)
        )
      : 5.0;

  await db.branch.update({
    where: { id: branchId },
    data: {
      avg_rating: avgRating,
      total_reviews: totalReviews,
    },
  });

  return { avgRating, totalReviews };
}

/**
 * Dành cho Admin: Tạo chi nhánh mới
 */
export async function adminCreateBranch(data: {
  name: string;
  address: string;
  districtCity?: string;
  googleMapUrl?: string;
  hotline?: string;
  openHours?: string;
  coverImages?: string[];
  status?: string;
}) {
  return await db.branch.create({
    data: {
      name: data.name,
      address: data.address,
      district_city: data.districtCity || null,
      google_map_url: data.googleMapUrl || null,
      hotline: data.hotline || null,
      open_hours: data.openHours || "10:00 - 22:00",
      cover_images: data.coverImages ? JSON.stringify(data.coverImages) : null,
      status: data.status || "ACTIVE",
    },
  });
}

/**
 * Dành cho Admin: Cập nhật chi nhánh
 */
export async function adminUpdateBranch(
  id: string,
  data: {
    name?: string;
    address?: string;
    districtCity?: string;
    googleMapUrl?: string;
    hotline?: string;
    openHours?: string;
    coverImages?: string[];
    status?: string;
  }
) {
  const updatePayload: any = {};
  if (data.name !== undefined) updatePayload.name = data.name;
  if (data.address !== undefined) updatePayload.address = data.address;
  if (data.districtCity !== undefined) updatePayload.district_city = data.districtCity;
  if (data.googleMapUrl !== undefined) updatePayload.google_map_url = data.googleMapUrl;
  if (data.hotline !== undefined) updatePayload.hotline = data.hotline;
  if (data.openHours !== undefined) updatePayload.open_hours = data.openHours;
  if (data.coverImages !== undefined) updatePayload.cover_images = JSON.stringify(data.coverImages);
  if (data.status !== undefined) updatePayload.status = data.status;

  return await db.branch.update({
    where: { id },
    data: updatePayload,
  });
}

/**
 * Dành cho Admin: Xóa hoặc chuyển trạng thái chi nhánh
 */
export async function adminDeleteBranch(id: string) {
  return await db.branch.delete({
    where: { id },
  });
}

