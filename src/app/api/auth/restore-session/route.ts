import { getSessionCookieHeader, restoreSessionFromToken } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { device_token, device_fingerprint } = body;

    if (!device_token) {
      return NextResponse.json(
        { error: "Thiếu mã device_token để khôi phục phiên" },
        { status: 400 }
      );
    }

    const session = await restoreSessionFromToken(device_token, device_fingerprint);

    if (!session) {
      return NextResponse.json(
        { error: "Phiên làm việc đã hết hạn hoặc không tồn tại" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Khôi phục phiên thành công, đã gia hạn thêm 20 ngày",
      user: session.user,
      device_token: session.cookieToken,
      expires_at: session.expiresAt,
    });

    // Cấp lại HTTP-Only Cookie 20 ngày cho Safari
    response.headers.append("Set-Cookie", getSessionCookieHeader(session.cookieToken));

    return response;
  } catch (error: any) {
    console.error("Lỗi khôi phục phiên:", error);
    return NextResponse.json(
      { error: error.message || "Không thể khôi phục phiên" },
      { status: 500 }
    );
  }
}

