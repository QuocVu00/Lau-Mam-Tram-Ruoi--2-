import { getClearAdminCookieHeader } from "@/server/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Đăng xuất quản trị viên thành công",
  });
  response.headers.append("Set-Cookie", getClearAdminCookieHeader());
  return response;
}

