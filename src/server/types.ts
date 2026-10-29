/**
 * HỢP ĐỒNG DỮ LIỆU & KIỂU DỮ LIỆU BACKEND (src/server/types.ts)
 * Thành viên A - Hệ thống Lẩu Mắm Trăm Rưỡi
 */

export type OAuthProvider = "GOOGLE" | "FACEBOOK" | "ZALO";

export type ReviewStatus = "PUBLIC" | "SHADOW_HIDDEN" | "DELETED";

export type ReactionType = "LIKE" | "HEART" | "YUM" | "WOW";

export type MediaType = "IMAGE" | "VIDEO";

export type MediaProcessStatus = "PROCESSING" | "READY" | "FAILED";

export type PromotionScope = "GLOBAL" | "BRANCH";

export type BranchStatus = "ACTIVE" | "INACTIVE";

export interface UserSessionData {
  userId?: string;
  sessionId: string;
  cookieToken: string;
  deviceFingerprint?: string;
  ipAddress?: string;
  expiresAt: Date;
  user?: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    oauthProvider: string;
  } | null;
}

export interface BranchDTO {
  id: string;
  name: string;
  address: string;
  districtCity: string | null;
  googleMapUrl: string | null;
  hotline: string | null;
  openHours: string | null;
  coverImages: string[];
  avgRating: number;
  totalReviews: number;
  status: BranchStatus;
  createdAt: Date;
}

export interface ReviewMediaDTO {
  id: string;
  mediaType: MediaType;
  fileUrl: string;
  thumbnailUrl: string | null;
  processStatus: MediaProcessStatus;
}

export interface ReviewReactionSummary {
  LIKE: number;
  HEART: number;
  YUM: number;
  WOW: number;
  userReaction?: ReactionType | null;
}

export interface ReviewDTO {
  id: string;
  branchId: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: Date;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    oauthProvider: string;
  };
  media: ReviewMediaDTO[];
  reactions: ReviewReactionSummary;
}

export interface PromotionDTO {
  id: string;
  title: string;
  content: string;
  bannerUrl: string;
  scope: PromotionScope;
  branchIds: string[];
  startAt: Date;
  endAt: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface AdminOverviewDTO {
  totalBranches: number;
  totalReviews: number;
  overallAvgRating: number;
  activePromotionsCount: number;
  branches: {
    id: string;
    name: string;
    address: string;
    districtCity: string | null;
    status: string;
    avgRating: number;
    totalReviews: number;
    pendingShadowCount?: number;
  }[];
}

