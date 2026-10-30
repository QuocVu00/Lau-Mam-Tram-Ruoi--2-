import { adminCreateBranch, getBranches } from "@/server/branch.service";
import { getAdminSessionFromRequest } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (!getAdminSessionFromRequest(req)) {
    return NextResponse.json(
      { error: "Truy cập bị từ chối: Bắt buộc tài khoản Quản trị viên (Admin)", success: false },
      { status: 403 }
    );
  }

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
  if (!getAdminSessionFromRequest(req)) {
    return NextResponse.json(
      { error: "Truy cập bị từ chối: Bắt buộc tài khoản Quản trị viên (Admin)", success: false },
      { status: 403 }
    );
  }

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
