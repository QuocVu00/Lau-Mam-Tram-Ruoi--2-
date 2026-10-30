import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken, COOKIE_ADMIN_NAME } from "@/server/auth";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

/**
 * TRANG ADMIN GỐC (src/app/admin/page.tsx)
 * 
 * Quy tắc:
 * BẮT BUỘC: Khi nhập http://localhost:3000/admin mà chưa có phiên Admin hợp lệ,
 * hệ thống lập tức điều hướng chạy thẳng đến trang đăng nhập (/admin/login).
 * Người dùng bắt buộc phải đăng nhập bằng tài khoản admin mới vào được trang admin.
 */
export default function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_ADMIN_NAME)?.value;

  // Nếu chưa đăng nhập Admin hoặc token không hợp lệ -> Chạy thẳng đến trang đăng nhập bắt buộc
  if (!token || !verifyAdminToken(token)) {
    redirect("/admin/login");
  }

  // Đã xác thực quyền Quản trị viên -> Cho phép vào trang Admin Dashboard
  return <AdminDashboardClient />;
}
