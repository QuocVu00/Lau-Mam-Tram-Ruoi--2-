import { moderateReview } from "@/server/review.service";
import { ReviewStatus } from "@/server/types";
import { getAdminSessionFromRequest } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAdminSessionFromRequest(req)) {
    return NextResponse.json(
      { error: "Truy cập bị từ chối: Bắt buộc tài khoản Quản trị viên (Admin)", success: false },
      { status: 403 }
    );
  }

  try {
    const reviewId = params.id;
    const body = await req.json();
    const { status } = body;

    const validStatuses: ReviewStatus[] = ["PUBLIC", "SHADOW_HIDDEN", "DELETED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Trạng thái kiểm duyệt không hợp lệ. Chỉ chấp nhận PUBLIC, SHADOW_HIDDEN hoặc DELETED" },
        { status: 400 }
      );
    }

    // Thực hiện kiểm duyệt âm thầm và tính lại điểm sao tức thì
    const result = await moderateReview(reviewId, status);

    return NextResponse.json({
      success: true,
      message:
        status === "SHADOW_HIDDEN"
          ? "Đã áp dụng chế độ Ẩn thông minh (Shadowban) thành công"
          : status === "DELETED"
          ? "Đã xóa vĩnh viễn bài đánh giá thành công"
          : "Đã khôi phục bài đánh giá về công khai thành công",
      data: result,
    });
  } catch (error: any) {
    console.error("Lỗi kiểm duyệt bài đánh giá:", error);
    return NextResponse.json(
      { error: error.message || "Kiểm duyệt bài đánh giá thất bại" },
      { status: 500 }
    );
  }
}
