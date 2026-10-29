import { adminDeletePromotion, adminUpdatePromotion } from "@/server/promotion.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const promotionId = params.id;
    const body = await req.json();

    const updated = await adminUpdatePromotion(promotionId, body);

    return NextResponse.json({
      success: true,
      message: "Cập nhật khuyến mãi thành công",
      data: updated,
    });
  } catch (error: any) {
    console.error("Lỗi cập nhật khuyến mãi:", error);
    return NextResponse.json(
      { error: error.message || "Cập nhật khuyến mãi thất bại" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const promotionId = params.id;
    await adminDeletePromotion(promotionId);

    return NextResponse.json({
      success: true,
      message: "Xóa khuyến mãi thành công",
    });
  } catch (error: any) {
    console.error("Lỗi xóa khuyến mãi:", error);
    return NextResponse.json(
      { error: error.message || "Không thể xóa khuyến mãi" },
      { status: 500 }
    );
  }
}

