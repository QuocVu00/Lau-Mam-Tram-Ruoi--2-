import { getAdminOverview } from "@/server/admin.service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
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
