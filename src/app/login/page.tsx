// fastener-frontend-v2-main/src/app/login/page.tsx (修正並增加日誌)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- 修正點：自動移除 NEXT_PUBLIC_API_BASE 結尾可能多餘的斜線 ---
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");
    const apiUrl = `${baseUrl}/api/login`;
    // ----------------------------------------------------------------

    const requestBody = { username, password };

    console.log("🚀 準備發送登入請求...");
    console.log("請求 URL:", apiUrl);
    console.log("請求內容 (Body):", JSON.stringify(requestBody));

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log(`✅ 後端回應狀態碼: ${res.status}`);
      
      // 即使是 404 或 401，也嘗試解析 JSON，因為後端可能會回傳 { "error": "..." }
      const data = await res.json();

      if (res.ok) {
        console.log("✅ 登入成功，取得的回應:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert("✅ 登入成功");

        if (data.role === "admin") {
          router.push("/manage-accounts");
        } else {
          router.push("/");
        }
      } else {
        console.error("❌ 登入失敗，後端回應:", data);
        setError(data.error || `登入失敗 (${res.status})`);
      }
    } catch (err) {
      console.error("❌ 捕獲到網路請求錯誤:", err);
      setError("無法連接到伺服器或解析回應失敗。");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">登入系統</h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium">帳號</label>
            <Input
              type="text"
              placeholder="輸入帳號"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">密碼</label>
            <Input
              type="password"
              placeholder="輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <Button className="w-full" type="submit">
            登入
          </Button>
        </form>
      </div>
    </div>
  );
}
