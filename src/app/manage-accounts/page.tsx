// fastener-frontend-v2-main/src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      router.push("/login");
      return;
    }

    if (role === "admin") {
      // 【修正處】更新導向路徑
      router.push("/dashboard/manage-accounts");
    } else {
      // 假設未來非 admin 的主頁也在 dashboard 內
      router.push("/dashboard/quote-overview"); 
    }
  }, [router]);

  return (
    <main className="flex h-screen items-center justify-center">
      <p className="text-gray-500 text-lg">Redirecting...</p>
    </main>
  );
}
