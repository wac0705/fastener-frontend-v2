// src/app/dashboard/page.tsx 或 src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const router = useRouter();

  // 可選：根據權限導向管理頁
  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-10 max-w-lg flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">歡迎來到緊固件集團報價系統</h1>
        <p className="text-gray-600 dark:text-gray-300 text-center text-lg">
          您好，請由左側選單或上方選單進行操作。
          <br />
          <span className="font-semibold text-primary">本系統僅限授權人員使用</span>
        </p>
        <Button className="mt-4 w-full" onClick={goToLogin}>
          登入系統
        </Button>
        <div className="text-xs text-gray-400 mt-6">
          {`© ${new Date().getFullYear()} Fastener Group. All rights reserved.`}
        </div>
      </div>
    </main>
  );
}
