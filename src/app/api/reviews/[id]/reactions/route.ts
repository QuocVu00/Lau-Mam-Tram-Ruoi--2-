import { createSessionRecord, getClientIp, getCurrentSession, getSessionCookieHeader } from "@/server/auth";
import { toggleReviewReaction } from "@/server/review.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;
    const body = await req.json();
    const { reaction_type } = body;

    const validReactions = ["LIKE", "HEART", "YUM", "WOW"];
    if (!validReactions.includes(reaction_type)) {
      return NextResponse.json(
        { error: "Loại biểu tượng cảm xúc không hợp lệ" },
        { status: 400 }
      );
    }

    // Lấy phiên làm việc hiện tại
    let session = await getCurrentSession(req);
    let newCookieHeader: string | null = null;

    // Nếu khách vãng lai chưa có session, tự động cấp 1 session vãng lai để họ vẫn thả được cảm xúc
    if (!session) {
      const clientIp = getClientIp(req);
      const userAgent = req.headers.get("user-agent") || "";
      session = await createSessionRecord({
        ipAddress: clientIp,
        deviceFingerprint: userAgent,
      });
      newCookieHeader = getSessionCookieHeader(session.cookieToken);
    }

    const result = await toggleReviewReaction({
      reviewId,
      userId: session.user ? session.user.id : null,
      sessionId: session.sessionId,
      reactionType: reaction_type,
    });

    const response = NextResponse.json({
      success: true,
      data: result,
    });

    if (newCookieHeader) {
      response.headers.append("Set-Cookie", newCookieHeader);
    }

    return response;
  } catch (error: any) {
    console.error("Lỗi thả cảm xúc:", error);
    return NextResponse.json(
      { error: error.message || "Không thể thực hiện tương tác" },
      { status: 400 }
    );
  }
}

