import { adminDeleteBranch, adminUpdateBranch, getBranchDetail } from "@/server/branch.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const detail = await getBranchDetail(params.id);
    if (!detail) {
      return NextResponse.json({ error: "Không tìm thấy chi nhánh" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: detail });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const branchId = params.id;
    const body = await req.json();

    const updated = await adminUpdateBranch(branchId, body);

    return NextResponse.json({
      success: true,
      message: "Cập nhật chi nhánh thành công",
      data: updated,
    });
  } catch (error: any) {
    console.error("Lỗi cập nhật chi nhánh:", error);
    return NextResponse.json(
      { error: error.message || "Cập nhật chi nhánh thất bại" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const branchId = params.id;
    await adminDeleteBranch(branchId);

    return NextResponse.json({
      success: true,
      message: "Xóa chi nhánh thành công",
    });
  } catch (error: any) {
    console.error("Lỗi xóa chi nhánh:", error);
    return NextResponse.json(
      { error: error.message || "Không thể xóa chi nhánh" },
      { status: 500 }
    );
  }
}

