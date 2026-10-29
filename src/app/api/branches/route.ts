import { getBranches } from "@/server/branch.service";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const location = searchParams.get("location");
    const search = searchParams.get("search");

    const branches = await getBranches({
      location,
      search,
      onlyActive: true,
    });

    return NextResponse.json({
      success: true,
      data: branches,
      count: branches.length,
    });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách chi nhánh:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách chi nhánh" },
      { status: 500 }
    );
  }
}
