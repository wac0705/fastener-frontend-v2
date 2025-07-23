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

    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");
    const apiUrl = `${baseUrl}/api/login`;
    const requestBody = { username, password };

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ 關鍵！同步存下 company_id、role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("company_id", String(data.company_id));
        toast.success("登入成功！");

        // 根據角色權限分流導頁
        if (data.role === "superadmin" || data.role === "company_admin") {
          router.push("/dashboard/manage-accounts");
        } else {
          router.push("/");
        }
      } else {
        const errorMessage = data.error || `登入失敗 (${res.status})`;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
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
