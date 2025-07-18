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
      router.push("/manage-accounts");
    } else {
      router.push("/quote-overview"); // 你可以換成你要的主頁
    }
  }, []);

  return (
    <main className="flex h-screen items-center justify-center">
      <p className="text-gray-500 text-lg">Redirecting...</p>
    </main>
  );
}
