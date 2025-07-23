"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type Account = {
  id: string;
  username: string;
  role: string;
  // 其他欄位視你的 API 結構而定
};

export default function ManageAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
        const res = await fetchWithAuth(`${apiBase}/api/manage-accounts`);
        if (!res.ok) throw new Error("查詢失敗");
        const data = await res.json();
        setAccounts(data);
      } catch (err: any) {
        setError(err.message || "帳號查詢失敗");
        // fetchWithAuth 會自動導回登入，不需要再額外處理 401
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-gray-500 text-lg">載入帳號資料中...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">帳號管理</h1>
      {accounts.length === 0 ? (
        <p className="text-gray-500">目前沒有帳號。</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">帳號</th>
              <th className="border p-2">角色</th>
              {/* 之後可加「編輯」「刪除」欄位 */}
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id}>
                <td className="border p-2">{acc.username}</td>
                <td className="border p-2">{acc.role}</td>
                {/* 這裡可加按鈕：編輯、刪除 */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
