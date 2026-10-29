import { db } from "@/lib/db";
import crypto from "crypto";
import { cookies } from "next/headers";

export const COOKIE_SESSION_NAME = "lau_mam_session";
export const COOKIE_ADMIN_NAME = "lau_mam_admin_session";
export const SESSION_MAX_AGE_SECONDS = 20 * 24 * 60 * 60; // 20 ngày = 1,728,000 giây
export const ADMIN_MAX_AGE_SECONDS = 24 * 60 * 60; // Admin phiên 24h

export interface SessionResult {
  sessionId: string;
  cookieToken: string;
  deviceFingerprint?: string | null;
  ipAddress?: string | null;
  expiresAt: Date;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    oauthProvider: string;
    oauthId: string;
  } | null;
}

/**
 * Sinh chuỗi token ngẫu nhiên bảo mật cao
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Tính thời điểm hết hạn sau 20 ngày
 */
export function get20DaysExpiration(): Date {
  return new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
}

/**
 * Lấy IP từ Request (hỗ trợ reverse proxy / Cloudflare / Vercel)
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Tạo một phiên làm việc mới có hạn 20 ngày trong Database (Dành riêng cho Khách hàng)
 */
export async function createSessionRecord(params: {
  userId?: string | null;
  deviceFingerprint?: string | null;
  ipAddress?: string | null;
}): Promise<SessionResult> {
  const cookieToken = generateSecureToken();
  const expiresAt = get20DaysExpiration();

  const session = await db.userSession.create({
    data: {
      user_id: params.userId || null,
      cookie_token: cookieToken,
      device_fingerprint: params.deviceFingerprint || null,
      ip_address: params.ipAddress || null,
      expires_at: expiresAt,
    },
    include: {
      user: true,
    },
  });

  return {
    sessionId: session.id,
    cookieToken: session.cookie_token,
    deviceFingerprint: session.device_fingerprint,
    ipAddress: session.ip_address,
    expiresAt: session.expires_at,
    user: session.user
      ? {
          id: session.user.id,
          displayName: session.user.display_name,
          avatarUrl: session.user.avatar_url,
          oauthProvider: session.user.oauth_provider,
          oauthId: session.user.oauth_id,
        }
      : null,
  };
}

/**
 * Tra cứu phiên làm việc hợp lệ từ cookieToken hoặc deviceToken
 */
export async function getSessionByToken(token: string): Promise<SessionResult | null> {
  if (!token) return null;

  const session = await db.userSession.findUnique({
    where: { cookie_token: token },
    include: { user: true },
  });

  if (!session) return null;

  // Kiểm tra đã hết hạn chưa
  if (new Date() > session.expires_at) {
    try {
      await db.userSession.delete({ where: { id: session.id } });
    } catch {}
    return null;
  }

  return {
    sessionId: session.id,
    cookieToken: session.cookie_token,
    deviceFingerprint: session.device_fingerprint,
    ipAddress: session.ip_address,
    expiresAt: session.expires_at,
    user: session.user
      ? {
          id: session.user.id,
          displayName: session.user.display_name,
          avatarUrl: session.user.avatar_url,
          oauthProvider: session.user.oauth_provider,
          oauthId: session.user.oauth_id,
        }
      : null,
  };
}

/**
 * Khôi phục phiên làm việc khi Safari ITP tự xóa Cookie sau 7 ngày
 */
export async function restoreSessionFromToken(
  deviceToken: string,
  fingerprint?: string
): Promise<SessionResult | null> {
  const existing = await getSessionByToken(deviceToken);
  if (!existing) return null;

  const newExpiration = get20DaysExpiration();
  const updated = await db.userSession.update({
    where: { cookie_token: deviceToken },
    data: {
      expires_at: newExpiration,
      device_fingerprint: fingerprint || existing.deviceFingerprint,
    },
    include: { user: true },
  });

  return {
    sessionId: updated.id,
    cookieToken: updated.cookie_token,
    deviceFingerprint: updated.device_fingerprint,
    ipAddress: updated.ip_address,
    expiresAt: updated.expires_at,
    user: updated.user
      ? {
          id: updated.user.id,
          displayName: updated.user.display_name,
          avatarUrl: updated.user.avatar_url,
          oauthProvider: updated.user.oauth_provider,
          oauthId: updated.user.oauth_id,
        }
      : null,
  };
}

/**
 * Xử lý thông tin trả về từ OAuth Khách hàng (Google / Zalo / Facebook)
 */
export async function handleOAuthUserLogin(params: {
  provider: "GOOGLE" | "FACEBOOK" | "ZALO";
  oauthId: string;
  displayName: string;
  avatarUrl?: string | null;
  ipAddress?: string | null;
  deviceFingerprint?: string | null;
}): Promise<SessionResult> {
  const user = await db.user.upsert({
    where: {
      oauth_provider_oauth_id: {
        oauth_provider: params.provider,
        oauth_id: params.oauthId,
      },
    },
    update: {
      display_name: params.displayName,
      avatar_url: params.avatarUrl || null,
    },
    create: {
      oauth_provider: params.provider,
      oauth_id: params.oauthId,
      display_name: params.displayName,
      avatar_url: params.avatarUrl || null,
    },
  });

  return await createSessionRecord({
    userId: user.id,
    deviceFingerprint: params.deviceFingerprint,
    ipAddress: params.ipAddress,
  });
}

/**
 * Trích xuất phiên khách hàng hiện tại từ Request
 */
export async function getCurrentSession(req: Request): Promise<SessionResult | null> {
  let token: string | null = null;
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_SESSION_NAME}=([^;]*)`));
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      token = req.headers.get("x-device-token");
    }
  }

  if (!token) return null;

  return await getSessionByToken(token);
}

/**
 * Cấu hình HTTP-Only Cookie 20 ngày cho Khách hàng
 */
export function getSessionCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${COOKIE_SESSION_NAME}=${encodeURIComponent(
    token
  )}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${
    isProd ? "; Secure" : ""
  }`;
}

/**
 * Cấu hình xóa Cookie Khách hàng
 */
export function getClearSessionCookieHeader(): string {
  return `${COOKIE_SESSION_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

// ==============================================================================
// PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN AUTHENTICATION) - TÁCH BIỆT HOÀN TOÀN
// ==============================================================================

const ADMIN_SECRET = process.env.SESSION_SECRET || "lau_mam_admin_secret_key_2026";
const ADMIN_DEFAULT_USER = "admin";
const ADMIN_DEFAULT_PASS = "admin123";

/**
 * Kiểm tra tài khoản Quản trị viên
 */
export function verifyAdminCredentials(username: string, pass: string): boolean {
  const validUser = process.env.ADMIN_USERNAME || ADMIN_DEFAULT_USER;
  const validPass = process.env.ADMIN_PASSWORD || ADMIN_DEFAULT_PASS;
  return username.trim() === validUser && pass === validPass;
}

/**
 * Tạo token phiên đăng nhập Quản trị viên
 */
export function generateAdminToken(): string {
  const data = `admin_${Date.now()}_${Math.random().toString(36)}`;
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(data).digest("hex");
  return `${Buffer.from(data).toString("base64url")}.${signature}`;
}

/**
 * Xác thực token phiên Quản trị viên
 */
export function verifyAdminToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [dataBase64, providedSignature] = parts;
  try {
    const data = Buffer.from(dataBase64, "base64url").toString("utf-8");
    const expectedSignature = crypto.createHmac("sha256", ADMIN_SECRET).update(data).digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(providedSignature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Trích xuất phiên Admin từ Request
 */
export function getAdminSessionFromRequest(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return false;

  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_ADMIN_NAME}=([^;]*)`));
  if (!match) return false;

  const token = decodeURIComponent(match[1]);
  return verifyAdminToken(token);
}

/**
 * Cookie Quản trị viên (Thời hạn 24 giờ)
 */
export function getAdminCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${COOKIE_ADMIN_NAME}=${encodeURIComponent(
    token
  )}; Path=/; Max-Age=${ADMIN_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${
    isProd ? "; Secure" : ""
  }`;
}

/**
 * Xóa Cookie Quản trị viên
 */
export function getClearAdminCookieHeader(): string {
  return `${COOKIE_ADMIN_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}
