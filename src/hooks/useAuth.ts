"use client";

import { useEffect, useState, useCallback } from "react";

export interface AuthUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  oauthProvider: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 1. Kiểm tra và khôi phục phiên làm việc (20 ngày đa tầng: Cookie + LocalStorage)
  const refreshUser = useCallback(async () => {
    try {
      // Thử đọc từ /api/auth/me trước (dựa trên HTTP-Only Cookie)
      let res = await fetch("/api/auth/me");
      let data = await res.json();

      // Nếu Cookie bị Safari ITP xóa sau 7 ngày nhưng có lưu trong LocalStorage -> Tự động khôi phục
      if (!data.authenticated) {
        const deviceToken = typeof window !== "undefined" ? localStorage.getItem("lau_mam_device_token") : null;
        if (deviceToken) {
          const restoreRes = await fetch("/api/auth/restore-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device_token: deviceToken }),
          });
          const restoreData = await restoreRes.json();
          if (restoreData.success && restoreData.user) {
            setUser(restoreData.user);
            setLoading(false);
            return;
          }
        }
      }

      if (data.authenticated && data.user) {
        setUser(data.user);
        // Đồng bộ lưu device_token nếu có
        if (data.cookieToken && typeof window !== "undefined") {
          localStorage.setItem("lau_mam_device_token", data.cookieToken);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.warn("Lỗi đồng bộ phiên người dùng:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // 2. Đăng xuất tài khoản
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (typeof window !== "undefined") {
        localStorage.removeItem("lau_mam_device_token");
        localStorage.removeItem("lau_mam_user");
      }
      setUser(null);
    } catch (e) {
      console.error("Lỗi đăng xuất:", e);
    }
  };

  return {
    user,
    isLoggedIn: !!user,
    loading,
    refreshUser,
    logout,
    isAuthModalOpen,
    setIsAuthModalOpen,
  };
}

