"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "Tên đăng nhập hoặc mật khẩu không chính xác");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ xác thực admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center p-4">
      
      {/* Huy hiệu nhận diện phân hệ quản trị độc lập */}
      <div className="w-full max-w-md mb-4 flex justify-center items-center">
        <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest bg-stone-900 border border-stone-800 px-3.5 py-1.5 rounded-full shadow-sm">
          Phân Hệ Quản Trị Hệ Thống
        </span>
      </div>

      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Hiệu ứng ánh sáng nền */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Form */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-lg sm:text-xl text-white tracking-tight">
              Đăng Nhập Quản Trị Viên
            </h1>
            <p className="text-xs text-stone-400">
              Khu vực bảo mật dành riêng cho Ban Quản Lý nhà hàng
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Tài khoản Quản trị:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập admin"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Mật khẩu:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Gợi ý đăng nhập nhanh để demo */}
          <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-[11px] text-stone-400 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tài khoản thử nghiệm mặc định:</span>
            </div>
            <p>Tài khoản: <code className="text-white bg-stone-800 px-1.5 py-0.5 rounded">admin</code> | Mật khẩu: <code className="text-white bg-stone-800 px-1.5 py-0.5 rounded">admin123</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50"
          >
            <span>{loading ? "Đang xác thực..." : "Đăng Nhập Vào Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}

