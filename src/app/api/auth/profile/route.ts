import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/server/auth";
import { db } from "@/lib/db";

/**
 * PATCH /api/auth/profile
 * Cho phép khách hàng cập nhật tên hiển thị tài khoản Google của mình
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession(req);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Phiên đăng nhập không tồn tại hoặc đã hết hạn" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const displayName = (body.displayName || "").trim();

    if (!displayName) {
      return NextResponse.json(
        { error: "Tên hiển thị không được để trống" },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { display_name: displayName },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        displayName: updatedUser.display_name,
        avatarUrl: updatedUser.avatar_url,
        oauthProvider: updatedUser.oauth_provider,
      },
    });
  } catch (error: any) {
    console.error("Lỗi cập nhật tên người dùng:", error);
    return NextResponse.json(
      { error: error.message || "Cập nhật hồ sơ thất bại" },
      { status: 500 }
    );
  }
}
