# TÀI LIỆU HƯỚNG DẪN: THIẾT KẾ KIẾN TRÚC, CẤU TRÚC THƯ MỤC & CẤU HÌNH NỀN TẢNG
## HỆ THỐNG WEBSITE "LẨU MẮM TRĂM RƯỠI"

Tài liệu này tổng hợp toàn bộ tư duy thiết kế, cấu trúc mã nguồn và các thiết lập cấu hình nền tảng đã được triển khai, phục vụ mục đích học tập và làm kim chỉ nam phát triển dự án.

---

## MỤC LỤC
1. [Tóm tắt Trọng tâm Nghiệp vụ & Kỹ thuật](#1-tóm-tắt-trọng-tâm-nghiệp-vụ--kỹ-thuật)
2. [Cấu trúc Thư mục Chuẩn (Folder Ownership)](#2-cấu-trúc-thư-mục-chuẩn-folder-ownership)
3. [Chi tiết Các Tệp Cấu hình & Tư duy Logic](#3-chi-tiết-các-tệp-cấu-hình--tư-duy-logic)
   * [3.1. Quản lý Thư viện (package.json)](#31-quản-lý-thư-viện-packagejson)
   * [3.2. Cấu hình TypeScript (tsconfig.json)](#32-cấu-hình-typescript-tsconfigjson)
   * [3.3. Bảng màu Miền Tây & Mobile-First (tailwind.config.ts)](#33-bảng-màu-miền-tây--mobile-first-tailwindconfigts)
   * [3.4. Thiết kế 7 Bảng CSDL & Đánh Index (prisma/schema.prisma)](#34-thiết-kế-7-bảng-csdl--đánh-index-prismaschemaprisma)
   * [3.5. Mẫu thiết kế Singleton cho Database (src/lib/db.ts)](#35-mẫu-thiết-kế-singleton-cho-database-srclibdbts)
   * [3.6. Hàm Tiện ích Ghép Lớp CSS (src/lib/utils.ts)](#36-hàm-tiện-ích-ghép-lớp-css-srclibutilsts)
   * [3.7. Tối ưu Giao diện Mobile trên iOS (src/app/layout.tsx)](#37-tối-ưu-giao-diện-mobile-trên-ios-srcapplayouttsx)
   * [3.8. Quản lý Biến Môi trường (.env.example & .env)](#38-quản-lý-biến-môi-trường-envexample--env)
4. [Kết quả Kiểm thử Nền tảng (Verification)](#4-kết-quả-kiểm-thử-nền-tảng-verification)
5. [Kế hoạch Tiếp theo (Sprint 1)](#5-kế-hoạch-tiếp-theo-sprint-1)

---

## 1. TÓM TẮT TRỌNG TÂM NGHIỆP VỤ & KỸ THUẬT

Sau khi phân tích kỹ 2 tài liệu đặc tả, hệ thống tập trung giải quyết 3 bài toán then chốt:

### 1.1. Trải nghiệm Khách hàng tại Bàn ăn (Mobile-First 85%+)
* **Quét QR trên Camera mặc định của iPhone:**
  * Bắt buộc mở thẳng bằng ứng dụng **Safari chính** thông qua giao thức chuẩn `https://` (tránh trình duyệt tạm Captive Portal làm mất phiên).
  * Sử dụng luồng **OAuth 2.0 Redirect** hoặc Universal Link chuyển sang Zalo/Facebook (không dùng Popup vì Safari mặc định chặn cửa sổ bật lên).
* **Đăng nhập 1 chạm (Zero-Input Auth):**
  * Không bắt khách gõ tài khoản/mật khẩu; lấy tên hiển thị và ảnh đại diện trực tiếp từ Zalo, Google hoặc Facebook.
* **Lưu phiên 20 ngày:**
  * Kết hợp đa tầng: `HTTP-Only Cookie` + dự phòng qua `LocalStorage` / `IndexedDB` (phòng trường hợp cơ chế Safari ITP tự xóa Cookie sau 7 ngày).
  * Chống spam dựa trên tổ hợp **Tài khoản MXH + Cookie thiết bị**, không chặn cứng theo IP vì khách ngồi cùng bàn bắt chung Wifi quán sẽ trùng IP.

### 1.2. Kiểm duyệt Đánh giá Thông minh (Admin Dashboard)
* **Chế độ 1 - Ẩn thông minh (Shadowban):** Bài đánh giá 1-2 sao bị ẩn khỏi tất cả khách hàng khác và không tính vào điểm sao trung bình của quán. Tuy nhiên, chính máy của người đăng khi tải lại trang vẫn thấy bài của mình (tránh gây xung đột, bức xúc cho khách).
* **Chế độ 2 - Xóa vĩnh viễn (Silent Delete):** Xóa hoàn toàn khỏi cơ sở dữ liệu.
* *Cả hai chế độ đều thực hiện âm thầm, không gửi thông báo và tự động tính lại điểm sao chi nhánh ngay lập tức.*

### 1.3. Nguyên tắc Phân chia Nhiệm vụ (Folder Ownership)
* **Thành viên A (Backend & Logic):** Chịu trách nhiệm `/prisma`, `/src/server`, `/src/app/api`, `/src/workers`.
* **Thành viên B (Frontend & Client UX):** Chịu trách nhiệm `/src/components`, `/src/app/(client)`, `/src/hooks`, `/src/utils/client-media`.
* **Khu vực Admin (`/src/app/admin`):** Thành viên B dựng giao diện UI tĩnh trước, sau đó Thành viên A vào ghép API để tránh xung đột mã nguồn (Merge Conflict).

---

## 2. CẤU TRÚC THƯ MỤC CHUẨN (FOLDER OWNERSHIP)

```text
Lau-Mam-Tram-Ruoi--2-/
├── prisma/                    # [Backend] Thiết kế 7 bảng dữ liệu và script Seed Data
│   ├── dev.db                 # Database SQLite cục bộ dùng để lập trình nhanh
│   └── schema.prisma          # Định nghĩa cấu trúc các bảng và chỉ mục Index
├── public/                    # Thư mục chứa tài nguyên tĩnh công khai
│   ├── icons/                 # Logo, favicon, icon ứng dụng
│   └── images/                # Ảnh không gian chi nhánh, món ăn
├── src/
│   ├── app/
│   │   ├── (client)/          # [Frontend] Phân hệ Khách hàng (Trang chủ, Chi nhánh, Đánh giá)
│   │   ├── admin/             # [Admin] Phân hệ Quản trị viên (Dashboard, Kiểm duyệt)
│   │   ├── api/               # [Backend] Endpoint REST API (Auth, Branches, Reviews, Moderation)
│   │   ├── globals.css        # Khai báo CSS toàn cục và thiết lập phong cách cuộn trang
│   │   └── layout.tsx         # Root Layout, cấu hình thẻ meta và Viewport điện thoại
│   ├── components/            # Các khối giao diện tái sử dụng
│   │   ├── client/            # Component cho khách (Header, Hero, StarRating, ReviewCard...)
│   │   ├── admin/             # Component cho quản trị (ReviewTable, BranchForm, StatCard...)
│   │   └── ui/                # Component cơ bản (Button, Modal, Input, Badge...)
│   ├── hooks/                 # Custom React Hooks (useAuth, useLocalStorage, useCamera...)
│   ├── lib/                   # Thư viện tiện ích dùng chung (db.ts, utils.ts...)
│   ├── server/                # [Backend] Logic xử lý dữ liệu và nghiệp vụ máy chủ (Services)
│   ├── utils/
│   │   └── client-media/      # [Frontend] Nén ảnh sơ bộ và kiểm tra thời lượng video trên trình duyệt
│   └── workers/               # [Backend] Tiến trình ngầm chuyển đổi ảnh WebP và video MP4
├── .env.example               # Mẫu hướng dẫn các biến môi trường bảo mật
├── .env                       # Biến môi trường thực tế trên máy lập trình
├── .gitignore                 # Bỏ qua node_modules, .next, và các file bảo mật
├── package.json               # Quản lý phiên bản các thư viện và lệnh chạy dự án
├── postcss.config.mjs         # Cấu hình tiền xử lý CSS cho Tailwind và Autoprefixer
├── tailwind.config.ts         # Thiết lập hệ thống màu sắc thương hiệu Lẩu Mắm Trăm Rưỡi
└── tsconfig.json              # Cấu hình trình biên dịch TypeScript và đường dẫn rút gọn @/*
```

---

## 3. CHI TIẾT CÁC TỆP CẤU HÌNH & TƯ DUY LOGIC

### 3.1. Quản lý Thư viện (package.json)

```json
{
  "name": "lau-mam-tram-ruoi",
  "version": "1.0.0",
  "private": true,
  "description": "Hệ thống website chuỗi nhà hàng Lẩu Mắm Trăm Rưỡi - Mobile First, Auth 1 chạm, Quản trị review thông minh",
  "scripts": {
    "dev": "next dev",          // Chạy máy chủ lập trình tại cổng 3000
    "build": "next build",      // Đóng gói sản phẩm tối ưu hiệu năng
    "start": "next start",      // Khởi động server production sau khi build
    "db:push": "prisma db push" // Đồng bộ schema.prisma vào database
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",// Thư viện truy vấn CSDL chuẩn Type-safe
    "clsx": "^2.1.1",           // Nối class CSS có điều kiện
    "lucide-react": "^0.460.0", // Bộ icon chuẩn SVG (ngôi sao, định vị, trái tim...)
    "next": "^14.2.18",         // Framework React Fullstack hiện đại
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.4"  // Tự động gỡ xung đột các class CSS trùng lặp
  },
  "devDependencies": {
    "@types/node": "^20.17.6",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "autoprefixer": "^10.4.20", // Tự động thêm tiền tố trình duyệt (-webkit-, -moz-)
    "postcss": "^8.4.49",
    "prisma": "^5.22.0",        // Công cụ dòng lệnh quản lý Database
    "tailwindcss": "^3.4.15",   // Framework CSS tiện ích
    "typescript": "^5.6.3"      // Trình biên dịch TypeScript
  }
}
```

> **Tư duy đằng sau:**
> * Chọn **Next.js 14 App Router** kết hợp **TypeScript** giúp dự án có cấu trúc rõ ràng, hỗ trợ Server Components giúp tải trang cực nhanh trên mạng di động 3G/4G.
> * Bộ đôi `clsx` và `tailwind-merge` là tiêu chuẩn ngành để xây dựng các UI component linh hoạt (ví dụ: đổi màu sao khi khách bấm đánh giá).

---

### 3.2. Cấu hình TypeScript (tsconfig.json)

* Đường dẫn viết tắt **Path Aliases** `@/*` trỏ thẳng vào `./src/*`:
  * *Thay vì viết:* `import { db } from "../../../lib/db";`
  * *Chỉ cần viết:* `import { db } from "@/lib/db";`
* Chế độ **Strict Mode (`"strict": true`)** bắt buộc khai báo kiểu dữ liệu rõ ràng, hạn chế tối đa lỗi `undefined` hoặc `null` trong quá trình chạy.

---

### 3.3. Bảng màu Miền Tây & Mobile-First (tailwind.config.ts)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Màu nâu đỏ sẫm đặc trưng của nước cốt mắm cá linh, cá sặc miền Tây
          primary: "#A33A1B",
          // Màu cam đất biểu tượng cho ngọn lửa nồi lẩu sôi sục
          secondary: "#D96B27",
          // Màu vàng kem ấm cúng của ánh đèn bàn ăn gia đình
          accent: "#F4A261",
          // Màu nền ấm của trang web (tránh dùng màu trắng tinh gây lóa mắt)
          light: "#FFF8F0",
          // Màu xanh đồng quê của các loại rau ghém: bông súng, điên điển, kèo nèo
          herb: "#3A7D44",
          // Màu nền tối cho phân hệ quản trị Admin
          dark: "#2A1810",
        },
      },
      screens: {
        // Tối ưu riêng cho các dòng iPhone cỡ nhỏ (iPhone SE, mini: 375px)
        xs: "375px",
      },
      boxShadow: {
        // Đổ bóng ấm áp cho các thẻ Card món ăn và chi nhánh
        mobile: "0 4px 16px -2px rgba(163, 58, 27, 0.15)",
        // Đổ bóng nổi bật cho Nút hành động nổi (Gọi đặt bàn / Chỉ đường Maps)
        floating: "0 8px 24px -4px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
```

> **Tư duy đằng sau:**
> Giao diện ẩm thực cần kích thích vị giác và mang đậm bản sắc vùng miền. Bộ màu `brand` tạo cảm giác ấm cúng, gần gũi như đang ngồi tại quán lẩu mắm truyền thống.

---

### 3.4. Thiết kế 7 Bảng CSDL & Đánh Index (prisma/schema.prisma)

Cơ sở dữ liệu được xây dựng chuẩn mực với 7 thực thể liên kết chặt chẽ:

1. **`User` (Khách hàng):** Lưu định danh từ Zalo, Google hoặc Facebook; ràng buộc duy nhất `@@unique([oauth_provider, oauth_id])`.
2. **`UserSession` (Phiên làm việc 20 ngày):** Lưu `cookie_token`, `device_fingerprint`, `ip_address` và thời điểm hết hạn `expires_at = created_at + 20 ngày`.
3. **`Branch` (Chi nhánh nhà hàng):** Lưu tên, địa chỉ, hotline, link Google Maps, điểm sao `avg_rating`, tổng đánh giá `total_reviews`.
4. **`Promotion` (Khuyến mãi):** Hỗ trợ phạm vi `GLOBAL` (toàn hệ thống) hoặc `BRANCH` (chi nhánh cụ thể), có ngày bắt đầu và kết thúc để tự động ẩn khi hết hạn.
5. **`Review` (Đánh giá thực tế tại quán):** Lưu số sao (1-5), nội dung và 3 trạng thái kiểm duyệt (`PUBLIC`, `SHADOW_HIDDEN`, `DELETED`).
6. **`ReviewMedia` (Ảnh & Video đính kèm):** Phân loại ảnh (`.webp`) hoặc video (`.mp4`), kèm ảnh bìa `thumbnail_url`.
7. **`ReviewReaction` (Thả cảm xúc):** Lưu các tương tác `LIKE`, `HEART`, `YUM` (thèm chảy nước miếng), `WOW`.

#### Cơ chế Đánh Index Tối ưu Hiệu năng:
```prisma
model Review {
  id         String   @id @default(cuid())
  branch_id  String
  user_id    String
  session_id String?
  rating     Int
  comment    String
  status     String   @default("PUBLIC")
  created_at DateTime @default(now())

  // Đánh Index kép để lấy danh sách bài đánh giá hợp lệ theo chi nhánh trong tích tắc
  @@index([branch_id, status])
  // Đánh Index thời gian để sắp xếp bài mới nhất lên đầu không tốn tài nguyên CPU
  @@index([created_at])
  @@map("reviews")
}
```

> **Tư duy đằng sau:**
> Khi cơ sở dữ liệu phình to lên hàng chục ngàn bài đánh giá, việc đánh Index sẽ giúp máy chủ tìm kiếm dữ liệu tức thì thay vì phải quét toàn bộ ổ đĩa, đảm bảo khách lướt xem đánh giá trên điện thoại luôn mượt mà.

---

### 3.5. Mẫu thiết kế Singleton cho Database (src/lib/db.ts)

```typescript
import { PrismaClient } from "@prisma/client";

// Khai báo biến toàn cục trên globalThis để TypeScript nhận diện
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Tái sử dụng đối tượng có sẵn hoặc tạo một kết nối mới duy nhất
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Chỉ in log câu lệnh SQL ra terminal khi đang ở môi trường phát triển (development)
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Lưu vào globalThis trong môi trường dev để ngăn chặn Hot Reload tạo kết nối rác
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

> **Tư duy đằng sau:**
> Trong Next.js, mỗi khi bạn chỉnh sửa file code và bấm Lưu, cơ chế Fast Refresh sẽ chạy lại module đó. Nếu không áp dụng Singleton Pattern để lưu vào `globalThis`, mỗi lần lưu sẽ tạo ra một kết nối mới tới SQLite/PostgreSQL, nhanh chóng làm cạn kiệt tài nguyên máy tính.

---

### 3.6. Hàm Tiện ích Ghép Lớp CSS (src/lib/utils.ts)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Hàm cn() kết hợp clsx và tailwind-merge:
 * 1. clsx: Cho phép truyền điều kiện logic (vd: isActive && "bg-brand-primary")
 * 2. twMerge: Tự động xóa bỏ các class Tailwind bị xung đột (vd: "p-4" và "p-2" sẽ giữ lại "p-2")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### 3.7. Tối ưu Giao diện Mobile trên iOS (src/app/layout.tsx)

```typescript
import type { Metadata, Viewport } from "next";
import "./globals.css";

// 1. Cấu hình thẻ meta SEO
export const metadata: Metadata = {
  title: "Lẩu Mắm Trăm Rưỡi - Hương Vị Miền Tây Nam Bộ",
  description: "Chuỗi nhà hàng Lẩu Mắm Trăm Rưỡi - Đồng giá 150k chuẩn vị miền Tây, tươi ngon, đậm đà tình quê hương.",
};

// 2. Cấu hình Viewport chuyên biệt cho thiết bị di động
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Khóa tính năng tự động phóng to của Safari trên iPhone khi khách chạm vào ô nhập dữ liệu
  maximumScale: 1,
  // Tô màu thanh trạng thái (Status Bar) trên điện thoại cùng màu thương hiệu
  themeColor: "#A33A1B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-brand-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
```

---

### 3.8. Quản lý Biến Môi trường (.env.example & .env)

Tệp `.env.example` hướng dẫn các thông số cần thiết:
* `DATABASE_URL`: Đường dẫn CSDL (mặc định dùng SQLite cục bộ: `"file:./dev.db"`).
* `SESSION_SECRET`: Chuỗi khóa ngẫu nhiên dài từ 32 ký tự để mã hóa cookie 20 ngày.
* `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Khóa tích hợp đăng nhập Google & Google One Tap.
* `ZALO_APP_ID` / `ZALO_APP_SECRET`: Khóa tích hợp đăng nhập Zalo.
* `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET`: Khóa tích hợp đăng nhập Facebook.
* `NEXT_PUBLIC_APP_URL`: Địa chỉ gốc của web (`http://localhost:3000`).

---

## 4. KẾT QUẢ KIỂM THỬ NỀN TẢNG (VERIFICATION)

Các bước khởi tạo đã được tự động kiểm thử nghiêm ngặt:
* ✅ **Lệnh `npm install`:** Cài đặt đầy đủ 124 thư viện thành công trong 1 phút.
* ✅ **Lệnh `npx prisma db push`:** Tạo thành công tệp cơ sở dữ liệu `prisma/dev.db` và đồng bộ hoàn chỉnh 7 bảng.
* ✅ **Lệnh `npm run build`:** Đóng gói ứng dụng thành công, vượt qua toàn bộ quy trình kiểm tra kiểu dữ liệu TypeScript và định tuyến tĩnh.

---

## 5. KẾ HOẠCH TIẾP THEO (SPRINT 1)

Hai công việc tiếp theo có thể bắt tay vào làm ngay:

1. **Khởi tạo Dữ liệu Mẫu (Seed Data):**
   * Viết script nạp sẵn vào Database: 5 chi nhánh (Cần Thơ, Vĩnh Long, An Giang, TP.HCM...), thực đơn lẩu 150k và món ăn kèm, 2 chương trình khuyến mãi và 15 bài đánh giá mẫu để kiểm thử giao diện.
2. **Xây dựng Các Khối Giao diện Dùng Chung (Client UI Components):**
   * `Header`: Thanh tiêu đề thương hiệu kèm hotline.
   * `StarRating`: Thành phần hiển thị và chọn số sao (1 đến 5 sao) có hiệu ứng mượt.
   * `FloatingActionButton`: Nút nổi "Chỉ đường Google Maps" & "Gọi đặt bàn".
   * `AuthModal`: Khung popup đăng nhập 1 chạm chuẩn UX Mobile.

*(Tài liệu được lưu trữ trực tiếp tại `TaiLieu/huong_dan_khoi_tao_cau_truc_va_cau_hinh.md` để dễ dàng tra cứu).*

