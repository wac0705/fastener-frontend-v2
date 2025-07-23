// app/dashboard/page.tsx

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_DASHBOARD_MAP, DashboardItem } from "@/lib/roleDashboardMap";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardHome() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">載入中...</div>
      </main>
    );
  }

  // 若沒登入，顯示登入按鈕
  if (!role) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-10 max-w-lg flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">歡迎來到緊固件集團報價系統</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg">
            請先登入才能使用本系統功能。
          </p>
          <Button className="mt-4 w-full" onClick={() => router.push("/login")}>
            登入系統
          </Button>
        </div>
      </main>
    );
  }

  // 取得此角色所有可見功能
  const dashboardItems: DashboardItem[] = ROLE_DASHBOARD_MAP[role] || [];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-10 max-w-2xl flex flex-col items-center space-y-6 w-full">
        <h1 className="text-2xl font-bold mb-4">我的儀表板</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {dashboardItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className="rounded-xl bg-primary/10 p-6 flex flex-col items-start shadow hover:bg-primary/20 transition"
            >
              {/* 未來可加上 icon */}
              <span className="text-lg font-semibold">{item.name}</span>
              {item.description && (
                <span className="text-xs text-muted-foreground mt-2">{item.description}</span>
              )}
            </Link>
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-8">
          {`© ${new Date().getFullYear()} Fastener Group. All rights reserved.`}
        </div>
      </div>
    </main>
  );
}
