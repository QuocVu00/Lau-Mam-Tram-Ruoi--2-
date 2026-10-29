const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu gieo dữ liệu mẫu (Seed Data) cho Lẩu Mắm Trăm Rưỡi...");

  // 1. Dọn dẹp dữ liệu cũ (tuân thủ thứ tự khóa ngoại)
  await prisma.reviewReaction.deleteMany({});
  await prisma.reviewMedia.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.userSession.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.promotion.deleteMany({});
  await prisma.branch.deleteMany({});

  console.log("🧹 Đã làm sạch dữ liệu cũ thành công.");

  // 2. Tạo 5 Chi nhánh tiêu biểu
  const branchesData = [
    {
      id: "branch-can-tho",
      name: "Lẩu Mắm Trăm Rưỡi - Ninh Kiều, Cần Thơ",
      address: "Số 88 đường 30 Tháng 4, P. An Phú, Quận Ninh Kiều, Cần Thơ",
      district_city: "Cần Thơ",
      google_map_url: "https://maps.google.com/?q=10.0305,105.7820",
      hotline: "0901 150 001",
      open_hours: "10:00 - 22:30",
      cover_images: JSON.stringify([
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80"
      ]),
      status: "ACTIVE",
    },
    {
      id: "branch-q10-hcm",
      name: "Lẩu Mắm Trăm Rưỡi - Tô Hiến Thành, Quận 10",
      address: "245 Tô Hiến Thành, Phường 13, Quận 10, TP. Hồ Chí Minh",
      district_city: "TP. Hồ Chí Minh",
      google_map_url: "https://maps.google.com/?q=10.7765,106.6672",
      hotline: "0901 150 002",
      open_hours: "10:00 - 23:00",
      cover_images: JSON.stringify([
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
      ]),
      status: "ACTIVE",
    },
    {
      id: "branch-q1-hcm",
      name: "Lẩu Mắm Trăm Rưỡi - Nguyễn Trãi, Quận 1",
      address: "138 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
      district_city: "TP. Hồ Chí Minh",
      google_map_url: "https://maps.google.com/?q=10.7712,106.6913",
      hotline: "0901 150 003",
      open_hours: "10:30 - 23:30",
      cover_images: JSON.stringify([
        "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
      ]),
      status: "ACTIVE",
    },
    {
      id: "branch-an-giang",
      name: "Lẩu Mắm Trăm Rưỡi - Long Xuyên, An Giang",
      address: "12 Trần Hưng Đạo, P. Mỹ Bình, TP. Long Xuyên, An Giang",
      district_city: "An Giang",
      google_map_url: "https://maps.google.com/?q=10.3800,105.4333",
      hotline: "0901 150 004",
      open_hours: "10:00 - 22:00",
      cover_images: JSON.stringify([
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80"
      ]),
      status: "ACTIVE",
    },
    {
      id: "branch-tien-giang",
      name: "Lẩu Mắm Trăm Rưỡi - Mỹ Tho, Tiền Giang",
      address: "56 Ấp Bắc, Phường 5, TP. Mỹ Tho, Tiền Giang",
      district_city: "Tiền Giang",
      google_map_url: "https://maps.google.com/?q=10.3598,106.3614",
      hotline: "0901 150 005",
      open_hours: "09:30 - 22:00",
      cover_images: JSON.stringify([
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
      ]),
      status: "ACTIVE",
    },
  ];

  for (const b of branchesData) {
    await prisma.branch.create({ data: b });
  }
  console.log(`✅ Đã tạo ${branchesData.length} chi nhánh nhà hàng.`);

  // 3. Tạo Khuyến mãi mẫu (1 GLOBAL còn hạn, 1 BRANCH còn hạn, 1 hết hạn để test tự ẩn)
  const now = new Date();
  const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const future30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiredPast = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

  const promotionsData = [
    {
      id: "promo-global-1",
      title: "🎉 ĐI 4 TÍNH TIỀN 3 - ĐẠI TIỆC ĐỒNG GIÁ 150K",
      content: "Áp dụng cho toàn bộ các cơ sở trong hệ thống Lẩu Mắm Trăm Rưỡi. Tặng ngay 1 nồi lẩu hoặc 1 đĩa topping hải sản đặc biệt cho bàn từ 4 người lớn trở lên.",
      banner_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
      scope: "GLOBAL",
      branch_ids: null,
      start_at: past30,
      end_at: future30,
      is_active: true,
    },
    {
      id: "promo-branch-ct-q10",
      title: "🌿 TẶNG THÊM MẸT RAU ĐỒNG 8 LOẠI & NƯỚC MÁT MIỀN TÂY",
      content: "Đặc quyền dành riêng cho khách ghé chi nhánh Cần Thơ và Tô Hiến Thành Quận 10. Miễn phí thêm không giới hạn rau nhút, bông súng, điên điển tươi rói mỗi ngày.",
      banner_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
      scope: "BRANCH",
      branch_ids: JSON.stringify(["branch-can-tho", "branch-q10-hcm"]),
      start_at: past30,
      end_at: future30,
      is_active: true,
    },
    {
      id: "promo-expired",
      title: "⚡ FLASH SALE KHAI TRƯƠNG (ĐÃ HẾT HẠN - TỰ ẨN)",
      content: "Chương trình giảm giá 20% tuần lễ khai trương đã kết thúc.",
      banner_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
      scope: "GLOBAL",
      branch_ids: null,
      start_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      end_at: expiredPast,
      is_active: true,
    },
  ];

  for (const promo of promotionsData) {
    await prisma.promotion.create({ data: promo });
  }
  console.log(`✅ Đã tạo ${promotionsData.length} chương trình khuyến mãi mẫu.`);

  // 4. Tạo Users mẫu đại diện đăng nhập từ Google, Zalo, Facebook
  const usersData = [
    {
      id: "user-zalo-hai-lua",
      oauth_provider: "ZALO",
      oauth_id: "zalo_1001",
      display_name: "Anh Ba Miền Tây",
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
    },
    {
      id: "user-google-thao",
      oauth_provider: "GOOGLE",
      oauth_id: "google_2002",
      display_name: "Thảo Vy Foodie",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    },
    {
      id: "user-fb-minh",
      oauth_provider: "FACEBOOK",
      oauth_id: "fb_3003",
      display_name: "Minh Quân Lê",
      avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
    },
    {
      id: "user-google-huong",
      oauth_provider: "GOOGLE",
      oauth_id: "google_4004",
      display_name: "Hương Trầm Nguyễn",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    },
    {
      id: "user-zalo-spammer",
      oauth_provider: "ZALO",
      oauth_id: "zalo_9999_spammer",
      display_name: "Đối Thủ Ẩn Danh",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    },
  ];

  for (const u of usersData) {
    await prisma.user.create({ data: u });
  }
  console.log(`✅ Đã tạo ${usersData.length} khách hàng mẫu.`);

  // 5. Tạo Sessions mẫu 20 ngày
  const sessionExpires = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);
  const sessions = [
    {
      id: "session-ba-mien-tay",
      user_id: "user-zalo-hai-lua",
      cookie_token: "cookie_token_ba_mien_tay_secret_xyz123",
      device_fingerprint: "iPhone 15 Pro Max / Safari 17.4",
      ip_address: "14.161.22.45",
      expires_at: sessionExpires,
    },
    {
      id: "session-spammer",
      user_id: "user-zalo-spammer",
      cookie_token: "cookie_token_spammer_test_shadowban",
      device_fingerprint: "Samsung S23 / Chrome 120",
      ip_address: "118.69.182.10",
      expires_at: sessionExpires,
    },
  ];

  for (const s of sessions) {
    await prisma.userSession.create({ data: s });
  }
  console.log(`✅ Đã tạo phiên làm việc 20 ngày cho người dùng.`);

  // 6. Tạo 20 bài Reviews mẫu phong phú (Kèm ảnh/video, rating 1-5, shadowban)
  const reviewsData = [
    {
      id: "rev-1",
      branch_id: "branch-can-tho",
      user_id: "user-zalo-hai-lua",
      session_id: "session-ba-mien-tay",
      rating: 5,
      comment: "Nước lẩu chuẩn mắm cá linh cá sặc miền Tây đậm đà khó cưỡng! Nồi lẩu 150k mà đầy ắp tôm, cá hú, cà tím, ăn kèm đĩa bông súng điên điển tươi giòn rụm. Sẽ quay lại nhiều lần!",
      status: "PUBLIC",
      createdAtMinutesAgo: 10,
      media: [
        {
          media_type: "IMAGE",
          file_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
          thumbnail_url: null,
          process_status: "READY",
        },
        {
          media_type: "IMAGE",
          file_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
          thumbnail_url: null,
          process_status: "READY",
        },
      ],
      reactions: ["LIKE", "HEART", "YUM"],
    },
    {
      id: "rev-2",
      branch_id: "branch-can-tho",
      user_id: "user-google-thao",
      rating: 5,
      comment: "Quán rộng rãi, có máy lạnh mát rượi. Nhân viên phục vụ rất nhiệt tình, châm thêm nước lẩu liên tục không tính tiền. Rất ưng bụng!",
      status: "PUBLIC",
      createdAtMinutesAgo: 60,
      reactions: ["HEART", "LIKE"],
    },
    {
      id: "rev-3",
      branch_id: "branch-can-tho",
      user_id: "user-fb-minh",
      rating: 4,
      comment: "Vị lẩu rất ngon, rau đồng sạch sẽ. Điểm trừ nhẹ là quán đông quá nên phải chờ xếp bàn khoảng 10 phút. Bù lại đồ ăn lên siêu nhanh.",
      status: "PUBLIC",
      createdAtMinutesAgo: 180,
      reactions: ["LIKE"],
    },
    {
      id: "rev-4",
      branch_id: "branch-can-tho",
      user_id: "user-google-huong",
      rating: 5,
      comment: "Đúng chất lẩu mắm đồng bằng sông Cửu Long! Mùi mắm thơm lừng vừa miệng, không bị quá ngọt kiểu Sài Gòn hay quá mặn.",
      status: "PUBLIC",
      createdAtMinutesAgo: 300,
      media: [
        {
          media_type: "VIDEO",
          file_url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
          thumbnail_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
          process_status: "READY",
        },
      ],
      reactions: ["YUM", "HEART", "WOW"],
    },
    {
      id: "rev-shadowban-test",
      branch_id: "branch-can-tho",
      user_id: "user-zalo-spammer",
      session_id: "session-spammer",
      rating: 1,
      comment: "Quán phục vụ quá dở, đồ ăn tệ hại! (Bài đánh giá spam mẫu - Đang bị chế độ Shadowban ẩn thông minh)",
      status: "SHADOW_HIDDEN", // Đang bị shadowban
      createdAtMinutesAgo: 30,
      reactions: [],
    },
    {
      id: "rev-q10-1",
      branch_id: "branch-q10-hcm",
      user_id: "user-google-thao",
      rating: 5,
      comment: "Giữa Sài Gòn kiếm được nồi lẩu mắm đậm đà 150k cho 2 người no nê thế này quả là hiếm có. Bún tươi và đĩa rau xanh mướt.",
      status: "PUBLIC",
      createdAtMinutesAgo: 45,
      media: [
        {
          media_type: "IMAGE",
          file_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
          thumbnail_url: null,
          process_status: "READY",
        },
      ],
      reactions: ["LIKE", "YUM"],
    },
    {
      id: "rev-q10-2",
      branch_id: "branch-q10-hcm",
      user_id: "user-fb-minh",
      rating: 5,
      comment: "Nước chấm me pha ớt hiểm ăn dính cực kỳ. Topping cá béo ngậy chấm nước mắm mặn chuẩn bài.",
      status: "PUBLIC",
      createdAtMinutesAgo: 120,
      reactions: ["HEART"],
    },
    {
      id: "rev-q10-3",
      branch_id: "branch-q10-hcm",
      user_id: "user-google-huong",
      rating: 4,
      comment: "Không gian sạch sẽ, ấm cúng. Điểm hẹn cuối tuần lý tưởng cho nhóm bạn hoặc gia đình thích món lẩu truyền thống.",
      status: "PUBLIC",
      createdAtMinutesAgo: 240,
      reactions: ["LIKE"],
    },
    {
      id: "rev-q10-4",
      branch_id: "branch-q10-hcm",
      user_id: "user-zalo-hai-lua",
      rating: 5,
      comment: "Rất ngon và hợp khẩu vị. Giá 150k quá hời so với chất lượng và số lượng món ăn.",
      status: "PUBLIC",
      createdAtMinutesAgo: 400,
      reactions: ["YUM", "HEART"],
    },
    {
      id: "rev-q1-1",
      branch_id: "branch-q1-hcm",
      user_id: "user-fb-minh",
      rating: 5,
      comment: "Vị trí Quận 1 trung tâm đắc địa mà giá vẫn giữ nguyên 150k không hề tăng! Bạn bè ai ăn cũng khen nức nở.",
      status: "PUBLIC",
      createdAtMinutesAgo: 90,
      reactions: ["LIKE", "WOW"],
    },
    {
      id: "rev-q1-2",
      branch_id: "branch-q1-hcm",
      user_id: "user-google-thao",
      rating: 4,
      comment: "Nước lẩu dậy mùi mắm rất thơm, topping thịt ba chỉ và tôm tươi giòn. Gửi xe thuận tiện ngay trước quán.",
      status: "PUBLIC",
      createdAtMinutesAgo: 210,
      reactions: ["LIKE"],
    },
    {
      id: "rev-q1-3",
      branch_id: "branch-q1-hcm",
      user_id: "user-google-huong",
      rating: 5,
      comment: "Tuyệt vời! Đã ăn ở Cần Thơ nay có chi nhánh Sài Gòn đỡ phải đi xa. Hương vị giữ trọn 100%.",
      status: "PUBLIC",
      createdAtMinutesAgo: 500,
      reactions: ["HEART", "YUM"],
    },
    {
      id: "rev-ag-1",
      branch_id: "branch-an-giang",
      user_id: "user-zalo-hai-lua",
      rating: 5,
      comment: "Ăn tại xứ sở mắm Châu Đốc An Giang mà vẫn thấy quán làm đỉnh chóp! Mắm sánh quyện, rau ghém đầy ngọn.",
      status: "PUBLIC",
      createdAtMinutesAgo: 80,
      reactions: ["LIKE", "HEART"],
    },
    {
      id: "rev-ag-2",
      branch_id: "branch-an-giang",
      user_id: "user-fb-minh",
      rating: 5,
      comment: "Nhân viên dễ thương, tư vấn tận tình set lẩu cho 4 người ăn no cành hông.",
      status: "PUBLIC",
      createdAtMinutesAgo: 320,
      reactions: ["LIKE"],
    },
    {
      id: "rev-ag-3",
      branch_id: "branch-an-giang",
      user_id: "user-google-thao",
      rating: 4,
      comment: "Chất lượng ổn định, giá cả học sinh sinh viên. Chi nhánh Long Xuyên rất thoáng mát.",
      status: "PUBLIC",
      createdAtMinutesAgo: 700,
      reactions: [],
    },
    {
      id: "rev-tg-1",
      branch_id: "branch-tien-giang",
      user_id: "user-google-huong",
      rating: 5,
      comment: "Đoàn mình đi phượt ghé ăn trưa, ai nấy đều tấm tắc khen nước lẩu vừa miệng, thịt cá béo ngọt.",
      status: "PUBLIC",
      createdAtMinutesAgo: 110,
      reactions: ["YUM", "WOW"],
    },
    {
      id: "rev-tg-2",
      branch_id: "branch-tien-giang",
      user_id: "user-zalo-hai-lua",
      rating: 5,
      comment: "Quán nằm ngay mặt tiền Ấp Bắc dễ tìm. Lẩu ngon, giá tốt, dịch vụ chu đáo.",
      status: "PUBLIC",
      createdAtMinutesAgo: 260,
      reactions: ["LIKE"],
    },
    {
      id: "rev-tg-3",
      branch_id: "branch-tien-giang",
      user_id: "user-google-thao",
      rating: 4,
      comment: "Món ăn nóng hổi, thơm nức mũi. Rau tươi sạch chấm nước lẩu mắm đậm đà ăn hoài không ngán.",
      status: "PUBLIC",
      createdAtMinutesAgo: 600,
      reactions: ["HEART"],
    },
    {
      id: "rev-extra-1",
      branch_id: "branch-can-tho",
      user_id: "user-google-thao",
      rating: 5,
      comment: "Lẩu mắm trứ danh Tây Đô! Đĩa bông súng, điên điển, rau đắng non mướt ăn kèm không đâu sánh bằng.",
      status: "PUBLIC",
      createdAtMinutesAgo: 850,
      reactions: ["LIKE"],
    },
    {
      id: "rev-extra-2",
      branch_id: "branch-q10-hcm",
      user_id: "user-zalo-hai-lua",
      rating: 5,
      comment: "Quán ruột của gia đình mình mỗi dịp sum họp cuối tuần. Chúc chuỗi ngày càng phát triển!",
      status: "PUBLIC",
      createdAtMinutesAgo: 950,
      reactions: ["HEART", "YUM"],
    },
  ];

  for (const r of reviewsData) {
    const createdAt = new Date(now.getTime() - r.createdAtMinutesAgo * 60 * 1000);
    const review = await prisma.review.create({
      data: {
        id: r.id,
        branch_id: r.branch_id,
        user_id: r.user_id,
        session_id: r.session_id || null,
        rating: r.rating,
        comment: r.comment,
        status: r.status,
        created_at: createdAt,
      },
    });

    // Thêm media nếu có
    if (r.media && r.media.length > 0) {
      for (const m of r.media) {
        await prisma.reviewMedia.create({
          data: {
            review_id: review.id,
            media_type: m.media_type,
            file_url: m.file_url,
            thumbnail_url: m.thumbnail_url,
            process_status: m.process_status,
          },
        });
      }
    }

    // Thêm reactions nếu có
    if (r.reactions && r.reactions.length > 0) {
      for (const reactionType of r.reactions) {
        await prisma.reviewReaction.create({
          data: {
            review_id: review.id,
            user_id: r.user_id,
            reaction_type: reactionType,
          },
        });
      }
    }
  }

  console.log(`✅ Đã tạo ${reviewsData.length} bài đánh giá mẫu (kèm media, reaction, shadowban test).`);

  // 7. Tự động tính toán lại avg_rating và total_reviews cho từng chi nhánh
  console.log("🔄 Bắt đầu tính toán lại Điểm sao trung bình và Tổng đánh giá (chỉ tính bài PUBLIC)...");
  const allBranches = await prisma.branch.findMany();
  for (const branch of allBranches) {
    const publicReviews = await prisma.review.findMany({
      where: {
        branch_id: branch.id,
        status: "PUBLIC",
      },
      select: { rating: true },
    });

    const total = publicReviews.length;
    const avg = total > 0
      ? Number((publicReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1))
      : 5.0;

    await prisma.branch.update({
      where: { id: branch.id },
      data: {
        avg_rating: avg,
        total_reviews: total,
      },
    });

    console.log(`  ⭐ Chi nhánh [${branch.name}]: ${avg} ⭐ (${total} đánh giá hợp lệ)`);
  }

  console.log("🎉 HOÀN TẤT GIEO DỮ LIỆU SEED DATA THÀNH CÔNG!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi gieo dữ liệu seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

