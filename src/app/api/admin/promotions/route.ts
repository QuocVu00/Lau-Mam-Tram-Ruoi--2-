import { adminCreatePromotion, adminGetAllPromotions } from "@/server/promotion.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const promotions = await adminGetAllPromotions();
    return NextResponse.json({
      success: true,
      data: promotions,
    });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách khuyến mãi:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách khuyến mãi" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, bannerUrl, scope, branchIds, startAt, endAt, isActive } = body;

    if (!title || !content || !bannerUrl || !startAt || !endAt) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ tiêu đề, nội dung, ảnh banner và thời gian áp dụng" },
        { status: 400 }
      );
    }

    const promotion = await adminCreatePromotion({
      title,
      content,
      bannerUrl,
      scope: scope || "GLOBAL",
      branchIds,
      startAt,
      endAt,
      isActive,
    });

    return NextResponse.json({
      success: true,
      message: "Tạo chương trình khuyến mãi thành công",
      data: promotion,
    });
  } catch (error: any) {
    console.error("Lỗi tạo khuyến mãi:", error);
    return NextResponse.json(
      { error: error.message || "Không thể tạo khuyến mãi" },
      { status: 500 }
    );
  }
}

