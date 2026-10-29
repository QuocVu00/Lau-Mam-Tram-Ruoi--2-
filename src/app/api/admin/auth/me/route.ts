import { getAdminSessionFromRequest } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAdmin = getAdminSessionFromRequest(req);

  if (!isAdmin) {
    return NextResponse.json({
      authenticated: false,
      role: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    role: "ADMIN",
    username: "admin",
    displayName: "Quản Trị Viên Hệ Thống",
  });
}

