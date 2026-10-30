import { NextRequest, NextResponse } from "next/server";

/**
 * XỬ LÝ CHUYỂN HƯỚNG OAUTH 2.0 (src/app/api/auth/[provider]/redirect/route.ts)
 * 
 * Luồng Khách Hàng: Chỉ hỗ trợ duy nhất Google OAuth 1-chạm.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider.toLowerCase();
  const searchParams = req.nextUrl.searchParams;
  const returnUrl = searchParams.get("returnUrl") || "/";

  // Đóng gói state lưu returnUrl và timestamp
  const stateData = {
    returnUrl,
    timestamp: Date.now(),
  };
  const state = Buffer.from(JSON.stringify(stateData)).toString("base64url");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Chỉ chấp nhận duy nhất nhà cung cấp Google
  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && clientId !== "mock_google_client_id") {
      const redirectUri = `${baseUrl}/api/auth/google/callback`;
      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=openid%20profile%20email&state=${state}`;
      return NextResponse.redirect(googleOAuthUrl);
    }
  }

  // Môi trường phát triển / Giả lập Google đăng nhập tự động
  const callbackUrl = `${baseUrl}/api/auth/google/callback?code=mock_google_code_${Date.now()}&state=${state}`;
  return NextResponse.redirect(callbackUrl);
}
