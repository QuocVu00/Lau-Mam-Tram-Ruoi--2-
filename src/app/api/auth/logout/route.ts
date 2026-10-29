import { getClearSessionCookieHeader, getCurrentSession } from "@/server/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession(req);

    if (session) {
      try {
        await db.userSession.delete({ where: { id: session.sessionId } });
      } catch {
        // bỏ qua nếu đã xóa
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Đăng xuất thành công",
    });

    response.headers.append("Set-Cookie", getClearSessionCookieHeader());

    return response;
  } catch (error: any) {
    console.error("Lỗi đăng xuất:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi đăng xuất" },
      { status: 500 }
    );
  }
}

