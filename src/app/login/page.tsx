// fastener-frontend-v2-main/src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 保留您增加的 URL 修正與日誌，這非常棒
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");
    const apiUrl = `${baseUrl}/api/login`;
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
      
      const data = await res.json();

      if (res.ok) {
        console.log("✅ 登入成功，取得的回應:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        toast.success("登入成功！");

        if (data.role === "admin") {
          // 【核心修正點】將跳轉路徑更新到新的 dashboard 路徑
          router.push("/dashboard/manage-accounts");
        } else {
          // 其他角色暫時導向首頁，未來可以導向他們的儀表板
          router.push("/");
        }
      } else {
        console.error("❌ 登入失敗，後端回應:", data);
        const errorMessage = data.error || `登入失敗 (${res.status})`;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("❌ 捕獲到網路請求錯誤:", err);
      const errorMessage = "無法連接到伺服器或解析回應失敗。";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">登入系統</h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">帳號</label>
            <Input
              type="text"
              placeholder="輸入帳號"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">密碼</label>
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
