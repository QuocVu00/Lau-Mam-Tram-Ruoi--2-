import { PrismaClient } from "@prisma/client";

/**
 * KHỞI TẠO PRISMA CLIENT (src/lib/db.ts)
 * 
 * Vấn đề trong môi trường phát triển (Development):
 * Next.js có tính năng Hot Reload (tự động tải lại mã khi có chỉnh sửa). Nếu mỗi lần tải lại 
 * ta lại gọi new PrismaClient(), hệ thống sẽ mở hàng chục kết nối tới database và gây cạn kiệt bộ nhớ.
 * 
 * Giải pháp (Singleton Pattern):
 * Lưu đối tượng PrismaClient vào biến toàn cục toàn trình duyệt/server `globalThis`.
 * Nếu đã có sẵn đối tượng thì dùng lại, nếu chưa có mới khởi tạo mới.
 */

// 1. Khai báo biến toàn cục prisma trong globalThis để TypeScript không báo lỗi
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 2. Tái sử dụng đối tượng có sẵn hoặc tạo một phiên bản kết nối mới
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Ghi nhật ký các câu lệnh SQL trong console để dễ dàng học tập và debug
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 3. Trong môi trường dev, gán vào globalThis để không bị tạo mới khi Hot Reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

