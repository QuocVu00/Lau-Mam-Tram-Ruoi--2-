import { db } from "@/lib/db";
import { PromotionDTO, PromotionScope } from "./types";

/**
 * Lấy danh sách Khuyến mãi Toàn hệ thống (Global Promotions) đang có hiệu lực
 * Tự động ẩn nếu không có khuyến mãi nào đang chạy hoặc đã hết hạn
 */
export async function getGlobalActivePromotions(): Promise<PromotionDTO[]> {
  const now = new Date();

  const promotions = await db.promotion.findMany({
    where: {
      scope: "GLOBAL",
      is_active: true,
      start_at: { lte: now },
      end_at: { gte: now },
    },
    orderBy: { created_at: "desc" },
  });

  return promotions.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    bannerUrl: p.banner_url,
    scope: p.scope as PromotionScope,
    branchIds: p.branch_ids ? JSON.parse(p.branch_ids) : [],
    startAt: p.start_at,
    endAt: p.end_at,
    isActive: p.is_active,
    createdAt: p.created_at,
  }));
}

/**
 * Dành cho Admin: Lấy toàn bộ khuyến mãi (kể cả đã hết hạn)
 */
export async function adminGetAllPromotions() {
  const promotions = await db.promotion.findMany({
    orderBy: { created_at: "desc" },
  });

  return promotions.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    bannerUrl: p.banner_url,
    scope: p.scope,
    branchIds: p.branch_ids ? JSON.parse(p.branch_ids) : [],
    startAt: p.start_at,
    endAt: p.end_at,
    isActive: p.is_active,
    createdAt: p.created_at,
  }));
}

/**
 * Dành cho Admin: Tạo chương trình khuyến mãi
 */
export async function adminCreatePromotion(data: {
  title: string;
  content: string;
  bannerUrl: string;
  scope: "GLOBAL" | "BRANCH";
  branchIds?: string[];
  startAt: Date | string;
  endAt: Date | string;
  isActive?: boolean;
}) {
  return await db.promotion.create({
    data: {
      title: data.title,
      content: data.content,
      banner_url: data.bannerUrl,
      scope: data.scope,
      branch_ids: data.branchIds ? JSON.stringify(data.branchIds) : null,
      start_at: new Date(data.startAt),
      end_at: new Date(data.endAt),
      is_active: data.isActive !== undefined ? data.isActive : true,
    },
  });
}

/**
 * Dành cho Admin: Cập nhật khuyến mãi
 */
export async function adminUpdatePromotion(
  id: string,
  data: {
    title?: string;
    content?: string;
    bannerUrl?: string;
    scope?: "GLOBAL" | "BRANCH";
    branchIds?: string[];
    startAt?: Date | string;
    endAt?: Date | string;
    isActive?: boolean;
  }
) {
  const updatePayload: any = {};
  if (data.title !== undefined) updatePayload.title = data.title;
  if (data.content !== undefined) updatePayload.content = data.content;
  if (data.bannerUrl !== undefined) updatePayload.banner_url = data.bannerUrl;
  if (data.scope !== undefined) updatePayload.scope = data.scope;
  if (data.branchIds !== undefined)
    updatePayload.branch_ids = JSON.stringify(data.branchIds);
  if (data.startAt !== undefined) updatePayload.start_at = new Date(data.startAt);
  if (data.endAt !== undefined) updatePayload.end_at = new Date(data.endAt);
  if (data.isActive !== undefined) updatePayload.is_active = data.isActive;

  return await db.promotion.update({
    where: { id },
    data: updatePayload,
  });
}

/**
 * Dành cho Admin: Xóa khuyến mãi
 */
export async function adminDeletePromotion(id: string) {
  return await db.promotion.delete({
    where: { id },
  });
}

