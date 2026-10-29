import { getCurrentSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession(req);

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        sessionId: null,
      });
    }

    return NextResponse.json({
      authenticated: !!session.user,
      sessionId: session.sessionId,
      cookieToken: session.cookieToken,
      expiresAt: session.expiresAt,
      user: session.user,
    });
  } catch (error: any) {
    console.error("Lỗi lấy thông tin session:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi kiểm tra phiên" },
      { status: 500 }
    );
  }
}
