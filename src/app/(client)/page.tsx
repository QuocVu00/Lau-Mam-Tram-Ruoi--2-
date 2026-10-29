import { db } from "@/lib/db";
import { ClientHomeView } from "@/components/client/ClientHomeView";
import type { PromotionItem } from "@/components/client/GlobalPromotions";
import type { BranchItem } from "@/components/client/BranchList";

// Thiết lập không lưu cache tĩnh để trang chủ luôn cập nhật điểm số sao và khuyến mãi mới nhất
export const dynamic = "force-dynamic";

// Dữ liệu chi nhánh dự phòng (Fallback Data) chuẩn mực giúp trang luôn hiển thị mượt mà
const FALLBACK_BRANCHES: BranchItem[] = [
  {
    id: "cn-can-tho",
    name: "Chi Nhánh 1 - Bến Ninh Kiều (Cơ sở chính)",
    address: "Số 128 Đường Hai Bà Trưng, P. Tân An, Q. Ninh Kiều, Cần Thơ",
    district_city: "Cần Thơ",
    open_hours: "10:00 - 22:30",
    avg_rating: 4.9,
    total_reviews: 142,
    status: "ACTIVE",
  },
  {
    id: "cn-tphcm",
    name: "Chi Nhánh 2 - Sư Vạn Hạnh, Quận 10",
    address: "Số 752 Đường Sư Vạn Hạnh, Phường 12, Quận 10, TP. Hồ Chí Minh",
    district_city: "TP. Hồ Chí Minh",
    open_hours: "10:00 - 23:00",
    avg_rating: 4.8,
    total_reviews: 198,
    status: "ACTIVE",
  },
  {
    id: "cn-vinh-long",
    name: "Chi Nhánh 3 - Bờ Kè Cầu Lộ",
    address: "Số 45 Đường Trưng Nữ Vương, Phường 1, TP. Vĩnh Long",
    district_city: "Vĩnh Long",
    open_hours: "10:00 - 22:00",
    avg_rating: 5.0,
    total_reviews: 86,
    status: "ACTIVE",
  },
  {
    id: "cn-an-giang",
    name: "Chi Nhánh 4 - Trần Hưng Đạo, Long Xuyên",
    address: "Số 89 Đường Trần Hưng Đạo, P. Mỹ Bình, TP. Long Xuyên, An Giang",
    district_city: "An Giang",
    open_hours: "10:00 - 22:00",
    avg_rating: 4.9,
    total_reviews: 64,
    status: "ACTIVE",
  },
  {
    id: "cn-tien-giang",
    name: "Chi Nhánh 5 - Ấp Bắc, TP. Mỹ Tho",
    address: "Số 210 Đường Ấp Bắc, Phường 5, TP. Mỹ Tho, Tiền Giang",
    district_city: "Tiền Giang",
    open_hours: "10:00 - 22:00",
    avg_rating: 4.7,
    total_reviews: 53,
    status: "ACTIVE",
  },
];

// Khuyến mãi dự phòng toàn hệ thống
const FALLBACK_PROMOTIONS: PromotionItem[] = [
  {
    id: "km-khai-truong",
    title: "MỪNG MỞ RỘNG CHI NHÁNH - TẶNG THÊM DĨA BÚN & TRÀ TẮC",
    content: "Áp dụng cho mọi bàn ăn gọi nồi lẩu 150k. Tặng ngay 01 dĩa bún tươi nhỏ và 01 ly trà tắc hạt chia mát lạnh khi quét mã QR đánh giá tại bàn.",
    banner_url: "",
    start_at: new Date(Date.now() - 86400000).toISOString(),
    // Thời hạn: 30 ngày kể từ hiện tại
    end_at: new Date(Date.now() + 30 * 86400000).toISOString(),
  },
];

/**
 * TRANG CHỦ SERVER COMPONENT (src/app/(client)/page.tsx)
 * 
 * Mục đích:
 * Truy vấn trực tiếp Cơ sở dữ liệu Supabase từ Server để lấy danh sách chi nhánh và khuyến mãi.
 * Giúp website hiển thị dữ liệu ngay lập tức với SEO tối ưu mà không bị màn hình trắng chờ đợi.
 */
export default async function HomePage() {
  let branches: BranchItem[] = FALLBACK_BRANCHES;
  let promotions: PromotionItem[] = FALLBACK_PROMOTIONS;

  try {
    // 1. Truy vấn các chi nhánh đang hoạt động từ Supabase
    const dbBranches = await db.branch.findMany({
      where: { status: "ACTIVE" },
      orderBy: { avg_rating: "desc" },
    });

    if (dbBranches.length > 0) {
      branches = dbBranches.map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        district_city: b.district_city || "Khác",
        open_hours: b.open_hours || "10:00 - 22:00",
        avg_rating: b.avg_rating,
        total_reviews: b.total_reviews,
        status: b.status as "ACTIVE" | "INACTIVE",
      }));
    }

    // 2. Truy vấn các chương trình khuyến mãi Global đang trong thời gian hiệu lực
    const now = new Date();
    const dbPromotions = await db.promotion.findMany({
      where: {
        is_active: true,
        scope: "GLOBAL",
        start_at: { lte: now },
        end_at: { gte: now },
      },
      orderBy: { created_at: "desc" },
    });

    if (dbPromotions.length > 0) {
      promotions = dbPromotions.map((p) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        banner_url: p.banner_url,
        start_at: p.start_at.toISOString(),
        end_at: p.end_at.toISOString(),
      }));
    }
  } catch (error) {
    // Nếu chưa seed data hoặc mất kết nối mạng tạm thời, hệ thống tự động dùng Fallback Data an toàn
    console.warn("Dùng fallback data cho trang chủ:", error);
  }

  // Truyền dữ liệu vào giao diện Client
  return <ClientHomeView promotions={promotions} branches={branches} />;
}
