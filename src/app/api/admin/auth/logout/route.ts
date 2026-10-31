import { getClearAdminCookieHeader } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Đăng xuất quản trị viên thành công",
  });
  response.headers.append("Set-Cookie", getClearAdminCookieHeader());
  return response;
}

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", req.url));
  response.headers.append("Set-Cookie", getClearAdminCookieHeader());
  return response;
}
