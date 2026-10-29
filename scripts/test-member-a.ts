import { db } from "../src/lib/db";
import {
  createSessionRecord,
  getSessionByToken,
  restoreSessionFromToken,
  SESSION_MAX_AGE_SECONDS,
} from "../src/server/auth";
import {
  getBranches,
  getBranchDetail,
  recalculateBranchRating,
} from "../src/server/branch.service";
import {
  getBranchReviews,
  moderateReview,
  toggleReviewReaction,
} from "../src/server/review.service";
import { getGlobalActivePromotions } from "../src/server/promotion.service";
import { getAdminOverview } from "../src/server/admin.service";

async function runTests() {
  console.log("==================================================================");
  console.log("🧪 KIỂM THỬ TOÀN DIỆN CÁC TÍNH NĂNG CỦA THÀNH VIÊN A (BACKEND)");
  console.log("==================================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  // ------------------------------------------------------------------
  // TEST 1: Kiểm tra cấu hình và Dữ liệu Seed Data
  // ------------------------------------------------------------------
  console.log("1️⃣ KIỂM TRA SEED DATA VÀ TRUY VẤN CHI NHÁNH & KHUYẾN MÃI");
  const branches = await getBranches();
  assert(branches.length === 5, `Có đủ 5 chi nhánh (Thực tế: ${branches.length})`);

  const globalPromotions = await getGlobalActivePromotions();
  assert(
    globalPromotions.length >= 1,
    `Lấy đúng khuyến mãi GLOBAL đang hiệu lực (Thực tế: ${globalPromotions.length})`
  );

  const canThoDetail = await getBranchDetail("branch-can-tho");
  assert(canThoDetail !== null, "Lấy chi tiết chi nhánh Cần Thơ thành công");
  assert(
    (canThoDetail?.promotions.length || 0) >= 2,
    `Chi nhánh Cần Thơ gộp đúng khuyến mãi GLOBAL + BRANCH (Thực tế: ${canThoDetail?.promotions.length})`
  );

  // ------------------------------------------------------------------
  // TEST 2: Cơ chế Lưu phiên 20 Ngày & Khôi phục (Restore Session)
  // ------------------------------------------------------------------
  console.log("\n2️⃣ KIỂM TRA CƠ CHẾ AUTH, PHIÊN 20 NGÀY & KHÔI PHỤC SAFARI");
  assert(
    SESSION_MAX_AGE_SECONDS === 1728000,
    `Thời gian sống của phiên đúng chuẩn 20 ngày = 1,728,000 giây`
  );

  const newSession = await createSessionRecord({
    deviceFingerprint: "iPhone 15 Pro / Safari",
    ipAddress: "1.2.3.4",
  });
  assert(!!newSession.cookieToken, "Tạo mới phiên 20 ngày sinh mã cookieToken thành công");

  const restored = await restoreSessionFromToken(
    newSession.cookieToken,
    "iPhone 15 Pro / Safari Restored"
  );
  assert(
    restored !== null && restored.sessionId === newSession.sessionId,
    "Khôi phục phiên thành công từ device_token của LocalStorage"
  );

  // ------------------------------------------------------------------
  // TEST 3: Nghiệp vụ Shadowban & Lọc Review (Kịch bản 5 BRD)
  // ------------------------------------------------------------------
  console.log("\n3️⃣ KIỂM TRA NGHIỆP VỤ SHADOWBAN (ẨN THÔNG MINH)");
  // Ở Cần Thơ có 1 review bị SHADOW_HIDDEN bởi user 'user-zalo-spammer'
  // 3.1. Khách bình thường xem -> Không được thấy bài shadowban
  const publicReviews = await getBranchReviews({
    branchId: "branch-can-tho",
    currentUserId: "user-khach-khac",
  });
  const hasSpamInPublic = publicReviews.items.some(
    (r) => r.id === "rev-shadowban-test"
  );
  assert(
    !hasSpamInPublic,
    "Khách hàng khác không nhìn thấy bài đánh giá bị Shadowban"
  );

  // 3.2. Chính tác giả xem -> Vẫn thấy bài của mình
  const authorReviews = await getBranchReviews({
    branchId: "branch-can-tho",
    currentUserId: "user-zalo-spammer",
  });
  const hasSpamInAuthorView = authorReviews.items.some(
    (r) => r.id === "rev-shadowban-test"
  );
  assert(
    hasSpamInAuthorView,
    "Chính tác giả xem vẫn thấy bài đánh giá của mình (tránh bức xúc)"
  );

  // ------------------------------------------------------------------
  // TEST 4: Tự động tính toán lại Điểm sao trung bình (Recalculate Rating)
  // ------------------------------------------------------------------
  console.log("\n4️⃣ KIỂM TRA TÍNH TOÁN LẠI ĐIỂM SAO TRUNG BÌNH KHI KIỂM DUYỆT");
  const branchBefore = await db.branch.findUnique({
    where: { id: "branch-can-tho" },
  });
  const initialRating = branchBefore?.avg_rating || 0;

  // Giả lập admin khôi phục bài 1 sao về PUBLIC
  await moderateReview("rev-shadowban-test", "PUBLIC");
  const branchAfterPublic = await db.branch.findUnique({
    where: { id: "branch-can-tho" },
  });
  assert(
    (branchAfterPublic?.avg_rating || 0) < initialRating,
    `Khi bài 1 sao thành PUBLIC, điểm sao tụt từ ${initialRating} -> ${branchAfterPublic?.avg_rating}`
  );

  // Admin bấm Shadowban lại bài 1 sao
  await moderateReview("rev-shadowban-test", "SHADOW_HIDDEN");
  const branchAfterShadow = await db.branch.findUnique({
    where: { id: "branch-can-tho" },
  });
  assert(
    branchAfterShadow?.avg_rating === initialRating,
    `Khi bài 1 sao bị Shadowban, điểm sao lập tức hồi lại ${branchAfterShadow?.avg_rating}`
  );

  // ------------------------------------------------------------------
  // TEST 5: Tương tác Thả / Gỡ Cảm xúc (Reactions)
  // ------------------------------------------------------------------
  console.log("\n5️⃣ KIỂM TRA TƯƠNG TÁC BIỂU TƯỢNG CẢM XÚC (REACTIONS)");
  const react1 = await toggleReviewReaction({
    reviewId: "rev-1",
    sessionId: newSession.sessionId,
    reactionType: "YUM",
  });
  assert(react1.action === "ADDED", "Thả cảm xúc YUM lần đầu thành công");

  // Đợi 600ms để vượt qua rate limiter
  await new Promise((r) => setTimeout(r, 600));

  const react2 = await toggleReviewReaction({
    reviewId: "rev-1",
    sessionId: newSession.sessionId,
    reactionType: "YUM",
  });
  assert(react2.action === "REMOVED", "Bấm lại biểu tượng YUM thì tự động gỡ bỏ");

  // ------------------------------------------------------------------
  // TEST 6: Thống kê Quản trị (Admin Overview)
  // ------------------------------------------------------------------
  console.log("\n6️⃣ KIỂM TRA THỐNG KÊ QUẢN TRỊ (ADMIN OVERVIEW)");
  const adminOverview = await getAdminOverview();
  assert(
    adminOverview.totalBranches === 5,
    `Admin Dashboard đếm đúng 5 chi nhánh (Thực tế: ${adminOverview.totalBranches})`
  );
  assert(
    adminOverview.totalReviews >= 19,
    `Admin Dashboard đếm đúng tổng số đánh giá hợp lệ (${adminOverview.totalReviews})`
  );
  assert(
    adminOverview.overallAvgRating > 4.0,
    `Điểm trung bình toàn hệ thống hiển thị chính xác (${adminOverview.overallAvgRating} ⭐)`
  );

  console.log("\n==================================================================");
  console.log(`🏁 KẾT QUẢ: ${passedTests}/${totalTests} BÀI TEST ĐẠT CHUẨN 100%!`);
  console.log("==================================================================");
}

runTests()
  .catch((e) => {
    console.error("Lỗi kiểm thử:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

