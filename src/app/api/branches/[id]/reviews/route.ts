import { getCurrentSession } from "@/server/auth";
import { getBranchReviews } from "@/server/review.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const branchId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const tab = searchParams.get("tab") || "ALL";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Lấy phiên đăng nhập hiện tại để phục vụ cơ chế Shadowban:
    // Nếu là chính người đăng bài bị SHADOW_HIDDEN, họ vẫn nhìn thấy bài của mình!
    const session = await getCurrentSession(req);

    const result = await getBranchReviews({
      branchId,
      tab,
      page,
      limit,
      currentUserId: session?.user?.id || null,
      currentSessionId: session?.sessionId || null,
    });

    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách đánh giá:", error);
    return NextResponse.json(
      { error: error.message || "Không thể tải danh sách đánh giá" },
      { status: 500 }
    );
  }
}

