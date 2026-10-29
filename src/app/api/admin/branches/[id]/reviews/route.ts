import { adminGetBranchReviews } from "@/server/review.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const branchId = params.id;
    const reviews = await adminGetBranchReviews(branchId);

    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách đánh giá quản trị:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách đánh giá chi tiết" },
      { status: 500 }
    );
  }
}

