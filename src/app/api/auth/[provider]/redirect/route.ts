import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider.toLowerCase();
  const searchParams = req.nextUrl.searchParams;
  const returnUrl = searchParams.get("returnUrl") || "/";
  const name = searchParams.get("name") || "";

  // Đóng gói state lưu returnUrl, name và timestamp
  const stateData = {
    returnUrl,
    name,
    timestamp: Date.now(),
  };
  const state = Buffer.from(JSON.stringify(stateData)).toString("base64url");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Luồng OAuth 2.0 Redirect chuẩn
  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && clientId !== "mock_google_client_id") {
      const redirectUri = `${baseUrl}/api/auth/google/callback`;
      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=openid%20profile%20email&state=${state}`;
      return NextResponse.redirect(googleOAuthUrl);
    }
  } else if (provider === "zalo") {
    const appId = process.env.ZALO_APP_ID;
    if (appId && appId !== "mock_zalo_app_id") {
      const redirectUri = `${baseUrl}/api/auth/zalo/callback`;
      const zaloOAuthUrl = `https://oauth.zaloapp.com/v4/permission?app_id=${appId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${state}`;
      return NextResponse.redirect(zaloOAuthUrl);
    }
  } else if (provider === "facebook") {
    const appId = process.env.FACEBOOK_APP_ID;
    if (appId && appId !== "mock_facebook_app_id") {
      const redirectUri = `${baseUrl}/api/auth/facebook/callback`;
      const fbOAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${state}&scope=public_profile`;
      return NextResponse.redirect(fbOAuthUrl);
    }
  }

  // Chế độ tự động / Môi trường phát triển:
  const callbackUrl = `${baseUrl}/api/auth/${provider}/callback?code=mock_oauth_code_${Date.now()}&state=${state}`;
  return NextResponse.redirect(callbackUrl);
}
