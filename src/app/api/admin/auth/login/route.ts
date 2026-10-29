import { generateAdminToken, getAdminCookieHeader, verifyAdminCredentials } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập tên đăng nhập và mật khẩu quản trị" },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Tên đăng nhập hoặc mật khẩu quản trị viên không chính xác" },
        { status: 401 }
      );
    }

    const adminToken = generateAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "Đăng nhập quản trị viên thành công",
      user: {
        role: "ADMIN",
        username: "admin",
        displayName: "Quản Trị Viên Hệ Thống",
      },
    });

    response.headers.append("Set-Cookie", getAdminCookieHeader(adminToken));
    return response;
  } catch (error: any) {
    console.error("Lỗi đăng nhập admin:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi đăng nhập admin" },
      { status: 500 }
    );
  }
}

