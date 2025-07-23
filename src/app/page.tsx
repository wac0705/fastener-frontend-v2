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

    // superadmin 或 company_admin → 帳號管理
    if (role === "superadmin" || role === "company_admin") {
      router.push("/dashboard/manage-accounts");
    } else {
      // 其他角色導首頁或你有的 dashboard 頁
      router.push("/dashboard"); // 或 "/"
    }
  }, [router]);

  return (
    <main className="flex h-screen items-center justify-center">
      <p className="text-gray-500 text-lg">Redirecting...</p>
    </main>
  );
}
