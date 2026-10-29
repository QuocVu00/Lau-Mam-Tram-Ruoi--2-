import { getGlobalActivePromotions } from "@/server/promotion.service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const promotions = await getGlobalActivePromotions();
    return NextResponse.json({
      success: true,
      data: promotions,
    });
  } catch (error: any) {
    console.error("Lỗi lấy khuyến mãi toàn hệ thống:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách khuyến mãi" },
      { status: 500 }
    );
  }
}
