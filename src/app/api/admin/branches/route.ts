import { adminCreateBranch, getBranches } from "@/server/branch.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const branches = await getBranches({ onlyActive: false });
    return NextResponse.json({
      success: true,
      data: branches,
    });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách chi nhánh admin:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách chi nhánh" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, districtCity, googleMapUrl, hotline, openHours, coverImages, status } =
      body;

    if (!name || !address) {
      return NextResponse.json(
        { error: "Tên chi nhánh và địa chỉ không được để trống" },
        { status: 400 }
      );
    }

    const branch = await adminCreateBranch({
      name,
      address,
      districtCity,
      googleMapUrl,
      hotline,
      openHours,
      coverImages,
      status,
    });

    return NextResponse.json({
      success: true,
      message: "Tạo chi nhánh mới thành công",
      data: branch,
    });
  } catch (error: any) {
    console.error("Lỗi tạo chi nhánh:", error);
    return NextResponse.json(
      { error: error.message || "Không thể tạo chi nhánh" },
      { status: 500 }
    );
  }
}

