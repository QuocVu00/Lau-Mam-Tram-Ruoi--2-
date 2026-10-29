import { getBranchDetail } from "@/server/branch.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const branchId = params.id;
    const detail = await getBranchDetail(branchId);

    if (!detail) {
      return NextResponse.json(
        { error: "Không tìm thấy chi nhánh yêu cầu" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: detail,
    });
  } catch (error: any) {
    console.error("Lỗi lấy chi tiết chi nhánh:", error);
    return NextResponse.json(
      { error: "Không thể lấy thông tin chi nhánh" },
      { status: 500 }
    );
  }
}

