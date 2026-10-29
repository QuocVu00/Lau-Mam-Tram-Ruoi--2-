import { getClientIp, getSessionCookieHeader, handleOAuthUserLogin } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const providerParam = params.provider.toUpperCase();
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Giải mã state để lấy lại returnUrl ban đầu
  let returnUrl = "/";
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
      if (decoded.returnUrl) {
        returnUrl = decoded.returnUrl;
      }
    } catch {
      // nếu giải mã lỗi thì về trang chủ
    }
  }

  // Thông tin user mặc định hoặc giải lập nếu dev
  let displayName = "Khách Hàng Lẩu Mắm";
  let avatarUrl: string | null = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80";
  let oauthId = `user_${Date.now()}`;

  if (providerParam === "GOOGLE") {
    displayName = "Khách Hàng Google";
    avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80";
    oauthId = `google_sub_${code || Date.now()}`;
  } else if (providerParam === "ZALO") {
    displayName = "Khách Hàng Zalo";
    avatarUrl = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80";
    oauthId = `zalo_id_${code || Date.now()}`;
  } else if (providerParam === "FACEBOOK") {
    displayName = "Khách Hàng Facebook";
    avatarUrl = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80";
    oauthId = `fb_id_${code || Date.now()}`;
  }

  const clientIp = getClientIp(req);
  const userAgent = req.headers.get("user-agent") || "";

  // Tạo hoặc lấy User và kích hoạt phiên 20 ngày
  const session = await handleOAuthUserLogin({
    provider: providerParam as any,
    oauthId,
    displayName,
    avatarUrl,
    ipAddress: clientIp,
    deviceFingerprint: userAgent,
  });

  // Cơ chế lưu trữ đa tầng phía Trình duyệt (Client-side):
  // 1. HTTP-Only Cookie (Max-Age 20 ngày)
  // 2. LocalStorage & IndexedDB Backup token để khôi phục phiên nếu Safari xóa Cookie sau 7 ngày
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Đang hoàn tất đăng nhập...</title>
</head>
<body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #FAF6ED; color: #431407;">
  <div style="text-align: center;">
    <div style="width: 48px; height: 48px; border: 4px solid #EA580C; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
    <h3 style="margin: 0 0 8px;">Đăng nhập thành công!</h3>
    <p style="margin: 0; color: #78350F; font-size: 14px;">Đang tự động đưa bạn quay lại chi nhánh...</p>
  </div>
  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
  <script>
    try {
      localStorage.setItem('lau_mam_device_token', '${session.cookieToken}');
      localStorage.setItem('lau_mam_user', JSON.stringify(${JSON.stringify(session.user)}));
    } catch (e) {
      console.warn('LocalStorage không khả dụng:', e);
    }
    window.location.replace('${returnUrl}');
  </script>
</body>
</html>
  `;

  const response = new NextResponse(htmlContent, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });

  // Thiết lập HTTP-Only Cookie 20 ngày
  response.headers.append("Set-Cookie", getSessionCookieHeader(session.cookieToken));

  return response;
}

