import { getAdminOverview } from "@/server/admin.service";
import { getAdminSessionFromRequest } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!getAdminSessionFromRequest(req)) {
    return NextResponse.json(
      { error: "Truy cập bị từ chối: Bắt buộc tài khoản Quản trị viên (Admin)", success: false },
      { status: 403 }
    );
  }

  try {
    const overview = await getAdminOverview();
    return NextResponse.json({
      success: true,
      data: overview,
    });
  } catch (error: any) {
    console.error("Lỗi lấy tổng quan quản trị:", error);
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu tổng quan" },
      { status: 500 }
    );
  }
}
