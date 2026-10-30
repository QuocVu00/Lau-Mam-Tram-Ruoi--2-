"use client";

import React, { useState } from "react";
import { Utensils, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU CỦA MÓN ĂN (MenuItem)
 */
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: "lau" | "cuon" | "an_choi";
  image: string;
  tag?: string;
  description: string;
}

/**
 * 2. DANH SÁCH MÓN ĂN CHUẨN XÁC TỪ THỰC ĐƠN THẬT CỦA QUÁN
 */
const MENU_DISHES: MenuItem[] = [
  // ==================== NHÓM 1: LẨU 150K (3 MÓN ĐỒNG GIÁ 150K) ====================
  {
    id: "lau-mam",
    name: "Lẩu Mắm Trăm Rưỡi",
    price: 150000,
    category: "lau",
    image: "/images/menu/monchinh/laumam.jpg",
    tag: "Bán chạy nhất",
    description: "Nước cốt mắm cá linh & cá sặc thơm nồng, tôm, cá ba sa, thịt ba rọi và mâm rau đồng tươi rói.",
  },
  {
    id: "bo-nhung-giam",
    name: "Bò Nhúng Giấm",
    price: 150000,
    category: "lau",
    image: "/images/menu/monchinh/bonhunggiam.jpg",
    tag: "Đậm vị miền Tây",
    description: "Nước giấm thanh tao ngọt dịu, thịt bắp bò tươi thái mỏng nhúng tái cuốn bánh tráng rau rừng.",
  },
  {
    id: "bo-nhung-mam-ruoc",
    name: "Bò Nhúng Mắm Ruốc",
    price: 150000,
    category: "lau",
    image: "/images/menu/monchinh/laumamruoc.jpg",
    tag: "Hương vị độc đáo",
    description: "Sả ớt phi vàng thơm lừng cùng mắm ruốc thượng hạng, đậm đà chuẩn phong vị Nam Bộ.",
  },

  // ==================== NHÓM 2: THỊT CUỐN BÁNH TRÁNG (3 MỨC GIÁ) ====================
  {
    id: "thit-heo-cuon",
    name: "Thịt Heo Cuốn Bánh Tráng",
    price: 109000,
    category: "cuon",
    image: "/images/menu/monchinh/thitheocuon.jpg",
    tag: "Giá 109k",
    description: "Thịt ba chỉ heo luộc mềm ngọt, cuộn tròn cùng bánh tráng dẻo, rau sống và mắm nêm đậm vị.",
  },
  {
    id: "bap-heo-cuon",
    name: "Bắp Heo Cuốn Bánh Tráng",
    price: 150000,
    category: "cuon",
    image: "/images/menu/monchinh/bapheocuon.jpg",
    tag: "Giá 150k",
    description: "Thịt bắp giò heo luộc giòn sần sật cuốn rau đồng thanh mát chấm sốt đặc trưng của quán.",
  },
  {
    id: "bap-bo-cuon",
    name: "Bắp Bò Cuốn Bánh Tráng",
    price: 169000,
    category: "cuon",
    image: "/images/menu/monchinh/bapbocuon.jpg",
    tag: "Giá 169k",
    description: "Bắp bò hoa hảo hạng thái mỏng giòn thơm, ngọt thịt đậm đà cuộn bánh tráng và bún tươi.",
  },

  // ==================== NHÓM 3: MÓN ĂN CHƠI (GIÁ THEO ẢNH MENU THỰC TẾ) ====================
  {
    id: "khoai-mon-bo-me",
    name: "Khoai Môn Bơ Mè",
    price: 39000,
    category: "an_choi",
    image: "/images/menu/monanchoi/khoaimonbome.jpg",
    description: "Khoai môn chiên giòn rụm bên ngoài bùi dẻo bên trong, áo lớp bơ béo ngậy và mè rang thơm.",
  },
  {
    id: "khoai-mon-lac-mam",
    name: "Khoai Môn Lắc Mắm",
    price: 39000,
    category: "an_choi",
    image: "/images/menu/monanchoi/khoaimonlacmam.jpg",
    description: "Lát khoai môn mỏng giòn tan lắc đều sốt nước mắm kẹo mặn ngọt cay the hấp dẫn.",
  },
  {
    id: "bi-cuon",
    name: "Bì Cuốn",
    price: 39000,
    category: "an_choi",
    image: "/images/menu/monanchoi/bicuon.jpg",
    description: "Bì heo trộn thính gạo rang vàng cuộn bánh tráng và rau sống, chấm nước mắm tỏi ớt.",
  },
  {
    id: "goi-cuon-tom-thit",
    name: "Gỏi Cuốn Tôm Thịt",
    price: 49000,
    category: "an_choi",
    image: "/images/menu/monanchoi/goicuontomthit.jpg",
    description: "Tôm tươi chắc thịt cùng lát thịt ba chỉ thái mỏng, cuộn rau thơm bún tươi chấm tương ngọt.",
  },
  {
    id: "bo-vien-mam-toi",
    name: "Bò Viên Mắm Tỏi",
    price: 49000,
    category: "an_choi",
    image: "/images/menu/monanchoi/bovienmamtoi.jpg",
    description: "Bò viên giòn dai phủ nước sốt mắm tỏi ớt cô đặc bóng bẩy, thơm lừng khó cưỡng.",
  },
  {
    id: "hoanh-thanh-tom",
    name: "Hoành Thánh Tôm",
    price: 59000,
    category: "an_choi",
    image: "/images/menu/monanchoi/hoanhthanhtom.jpg",
    description: "Vỏ hoành thánh chiên phồng giòn rụm bọc nhân tôm tươi chấm kèm sốt kem mayonnaise.",
  },
  {
    id: "goi-du-du-kho-bo",
    name: "Gỏi Đu Đủ Khô Bò",
    price: 59000,
    category: "an_choi",
    image: "/images/menu/monanchoi/goikhobo.jpg",
    description: "Đu đủ bào giòn mát trộn cùng khô bò đen, đậu phộng rang giòn và nước giấm đường đậm vị.",
  },
  {
    id: "goi-du-du-ba-khia",
    name: "Gỏi Đu Đủ Ba Khía",
    price: 59000,
    category: "an_choi",
    image: "/images/menu/monanchoi/goibakhia.jpg",
    description: "Đặc sản miền sông nước: Ba khía muối trộn đu đủ giã tay đượm vị cay nồng chua ngọt.",
  },
  {
    id: "tom-chien-sot-kem",
    name: "Tôm Chiên Sốt Kem Thơm",
    price: 79000,
    category: "an_choi",
    image: "/images/menu/monanchoi/Tomchiensotkem.jpg",
    description: "Tôm sú tươi tẩm bột chiên vàng giòn rụm phủ lớp sốt kem béo chua ngọt hảo hạng.",
  },
];

/**
 * 3. DANH SÁCH 2 ẢNH MENU GỐC (MẶT TRƯỚC VÀ MẶT SAU)
 */
const MENU_PAGES = [
  {
    id: "front",
    title: "Menu Mặt Trước",
    image: "/images/menu/menumattruoc.jpg",
  },
  {
    id: "back",
    title: "Menu Mặt Sau",
    image: "/images/menu/menu-matsau.jpg",
  },
];

/**
 * 4. COMPONENT CHÍNH QUICK MENU (src/components/client/QuickMenu.tsx)
 */
export function QuickMenu() {
  // Trạng thái tab đang chọn: "menu" | "lau" | "cuon" | "an_choi"
  const [activeTab, setActiveTab] = useState<string>("menu");

  // Trạng thái mở rộng danh sách món: false = chỉ hiện 4 món đầu, true = hiện toàn bộ
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Danh sách các tab phân loại
  const tabs = [
    { key: "menu", label: "📖 Menu" },
    { key: "lau", label: "🍲 Lẩu 150k" },
    { key: "cuon", label: "🥢 Thịt cuốn bánh tráng" },
    { key: "an_choi", label: "🍢 Món ăn chơi" },
  ];

  // Hàm chuyển đổi Tab: Khi chọn tab mới, tự động đưa trạng thái mở rộng về mặc định (chỉ hiện 4 món)
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setIsExpanded(false);
  };

  // 1. Lọc tất cả các món thuộc danh mục đang chọn
  const currentDishes = MENU_DISHES.filter((dish) => dish.category === activeTab);

  // 2. Logic giới hạn 4 món: Nếu chưa bấm "Xem thêm", chỉ cắt lấy 4 món đầu tiên (slice 0 -> 4)
  const visibleDishes = isExpanded ? currentDishes : currentDishes.slice(0, 4);

  // 3. Kiểm tra xem danh mục có nhiều hơn 4 món hay không để quyết định hiển thị nút Xem thêm / Thu gọn
  const hasMoreThan4 = currentDishes.length > 4;

  return (
    <section id="quick-menu-section" className="py-5 px-3 sm:px-4 max-w-4xl mx-auto w-full">
      
      {/* Tiêu đề mục Thực đơn */}
      <div className="flex items-center gap-1.5 text-xs font-black uppercase text-brand-primary tracking-wide mb-3">
        <Utensils className="w-3.5 h-3.5 text-brand-secondary" />
        <span>Thực Đơn Lướt Nhanh</span>
      </div>

      {/* 1. Thanh phân loại Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              "whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0",
              activeTab === tab.key
                ? "bg-brand-primary text-white shadow-sm"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. NỘI DUNG TAB 1: HIỂN THỊ TRỰC TIẾP 2 ẢNH MENU (Giữ nguyên không bị giới hạn 4 món) */}
      {activeTab === "menu" && (
        <div className="space-y-4">
          {MENU_PAGES.map((page) => (
            <div
              key={page.id}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <img
                src={page.image}
                alt={page.title}
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* 3. NỘI DUNG CÁC TAB MÓN ĂN: LẨU 150K, THỊT CUỐN BÁNH TRÁNG, MÓN ĂN CHƠI */}
      {activeTab !== "menu" && (
        <div className="space-y-4">
          {/* Lưới hiển thị các món ăn: Chỉ hiện tối đa 4 món khi chưa bấm Xem thêm */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {visibleDishes.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Khung ảnh món ăn trực tiếp */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Huy hiệu tag (nếu có, ví dụ "Bán chạy nhất" hoặc "Giá 109k") */}
                    {item.tag && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black bg-amber-500/90 text-white shadow-sm backdrop-blur-sm">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Thông tin món ăn: Tên và mô tả */}
                  <div className="p-2.5 sm:p-3">
                    <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 leading-snug mb-1 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-500 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Chân thẻ: Giá tiền niêm yết rõ ràng */}
                <div className="px-2.5 sm:px-3 py-2 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold text-stone-500">Giá:</span>
                  <span className="text-xs sm:text-sm font-black text-brand-primary">
                    {item.price.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* NÚT XEM THÊM / THU GỌN VỚI MŨI TÊN (^) LÊN XUỐNG KHI CÓ TRÊN 4 MÓN */}
          {hasMoreThan4 && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-stone-300 hover:border-brand-primary text-stone-700 hover:text-brand-primary text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                <span>
                  {/* Nhãn nút tinh giản: Chỉ hiển thị "Xem thêm" hoặc "Thu gọn" theo yêu cầu */}
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
                </span>
                {/* Mũi tên hướng lên (^) khi đã mở rộng, mũi tên hướng xuống (v) khi đang thu gọn */}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-brand-primary" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brand-primary" />
                )}
              </button>
            </div>
          )}
        </div>
      )}

    </section>
  );
}
