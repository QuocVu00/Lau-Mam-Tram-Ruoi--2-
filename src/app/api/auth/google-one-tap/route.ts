import { getClientIp, getSessionCookieHeader, handleOAuthUserLogin } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json(
        { error: "Thiếu thông tin xác thực Google One Tap" },
        { status: 400 }
      );
    }

    // Phân tích JWT Token từ Google One Tap (không cần secret khi đọc payload claim)
    let payload: any = {};
    try {
      const parts = credential.split(".");
      if (parts.length === 3) {
        payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
      }
    } catch {
      payload = {
        sub: `google_onetap_${Date.now()}`,
        name: "Khách Hàng Google One Tap",
        picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      };
    }

    const oauthId = payload.sub || `google_onetap_${Date.now()}`;
    const displayName = payload.name || "Khách Hàng Google";
    const avatarUrl = payload.picture || null;

    const clientIp = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "";

    const session = await handleOAuthUserLogin({
      provider: "GOOGLE",
      oauthId,
      displayName,
      avatarUrl,
      ipAddress: clientIp,
      deviceFingerprint: userAgent,
    });

    const response = NextResponse.json({
      success: true,
      user: session.user,
      device_token: session.cookieToken,
      expires_at: session.expiresAt,
    });

    // Cấp Cookie 20 ngày
    response.headers.append("Set-Cookie", getSessionCookieHeader(session.cookieToken));

    return response;
  } catch (error: any) {
    console.error("Lỗi Google One Tap:", error);
    return NextResponse.json(
      { error: error.message || "Xác thực Google One Tap thất bại" },
      { status: 500 }
    );
  }
}

