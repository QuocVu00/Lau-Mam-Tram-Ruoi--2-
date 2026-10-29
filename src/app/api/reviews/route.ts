import { createSessionRecord, getClientIp, getCurrentSession, getSessionCookieHeader } from "@/server/auth";
import { createReview } from "@/server/review.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { branch_id, rating, comment, media = [] } = body;

    if (!branch_id || !rating || !comment) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ chi nhánh, số sao và nội dung nhận xét" },
        { status: 400 }
      );
    }

    // 1. Kiểm tra phiên đăng nhập
    let session = await getCurrentSession(req);

    // Nếu khách chưa có session hoặc chưa đăng nhập MXH, yêu cầu đăng nhập 1 chạm
    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: "Vui lòng chọn đăng nhập 1 chạm qua Zalo, Google hoặc Facebook để gửi đánh giá",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const review = await createReview({
      branchId: branch_id,
      userId: session.user.id,
      sessionId: session.sessionId,
      rating: Number(rating),
      comment: String(comment),
      media: media.map((m: any) => ({
        mediaType: m.media_type || m.mediaType || "IMAGE",
        fileUrl: m.file_url || m.fileUrl,
        thumbnailUrl: m.thumbnail_url || m.thumbnailUrl || null,
        processStatus: m.process_status || m.processStatus || "READY",
      })),
    });

    return NextResponse.json({
      success: true,
      message: "Đăng đánh giá thành công! Cảm ơn bạn đã đóng góp ý kiến.",
      data: review,
    });
  } catch (error: any) {
    console.error("Lỗi đăng bài đánh giá:", error);
    return NextResponse.json(
      { error: error.message || "Không thể đăng bài đánh giá" },
      { status: 500 }
    );
  }
}

