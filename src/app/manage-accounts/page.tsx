"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ManageAccountsPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      toast.error("未授權訪問，請重新登入");
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">正在驗證身分中...</p>
      </div>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">帳號管理</h1>
      {/* 接下來你可以在這裡放你現有的帳號 CRUD 表單或元件 */}
    </main>
  );
}
