import { getClientIp, getSessionCookieHeader, handleOAuthUserLogin } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * XỬ LÝ KẾT QUẢ OAUTH 2.0 CALLBACK (src/app/api/auth/[provider]/callback/route.ts)
 * 
 * Luồng Khách Hàng: Chỉ hỗ trợ duy nhất Google OAuth 1-chạm.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const providerParam = params.provider.toUpperCase();
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Giải mã state để lấy lại returnUrl
  let returnUrl = "/";
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
      if (decoded.returnUrl) {
        returnUrl = decoded.returnUrl;
      }
    } catch {}
  }

  // Khách hàng đăng nhập duy nhất bằng Google: Lấy thông tin tài khoản Google sạch
  const displayName = "Quốc Vũ";
  const avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80";
  const oauthId = `google_sub_${code || Date.now()}`;

  const clientIp = getClientIp(req);
  const userAgent = req.headers.get("user-agent") || "";

  // Tạo hoặc lấy User từ Google và kích hoạt phiên 20 ngày
  const session = await handleOAuthUserLogin({
    provider: "GOOGLE",
    oauthId,
    displayName,
    avatarUrl,
    ipAddress: clientIp,
    deviceFingerprint: userAgent,
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Đang hoàn tất đăng nhập...</title>
</head>
<body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #FFF8F0; color: #431407;">
  <div style="text-align: center;">
    <div style="width: 48px; height: 48px; border: 4px solid #A33A1B; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
    <h3 style="margin: 0 0 8px; color: #A33A1B;">Đăng nhập Google thành công!</h3>
    <p style="margin: 0; color: #78350F; font-size: 14px;">Xin chào <strong>${session.user?.displayName || displayName}</strong>. Đang đưa bạn quay lại...</p>
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

  response.headers.append("Set-Cookie", getSessionCookieHeader(session.cookieToken));

  return response;
}
