import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * HÀM TIỆN ÍCH KẾT HỢP CLASS CSS (src/lib/utils.ts)
 * 
 * Mục đích:
 * 1. Cho phép truyền các điều kiện class linh hoạt (nhờ clsx).
 *    Ví dụ: cn("p-4", isActive && "bg-brand-primary text-white")
 * 2. Tự động giải quyết xung đột class của Tailwind (nhờ tailwind-merge).
 *    Ví dụ: Nếu truyền "p-4" và sau đó truyền "p-2", hàm sẽ tự động lấy "p-2" mà không bị chồng lấn.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

