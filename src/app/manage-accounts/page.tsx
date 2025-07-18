"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Account {
  id: number;
  username: string;
  role: string;
}

export default function ManageAccountsPage() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("sales");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      toast.error("未授權訪問，請重新登入");
      router.push("/login");
    } else {
      fetchAccounts();
      setLoading(false);
    }
  }, []);

  const fetchAccounts = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setAccounts(data);
  };

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole,
        }),
      }
    );
    if (res.ok) {
      toast.success("新增成功");
      setNewUsername("");
      setNewPassword("");
      setNewRole("sales");
      fetchAccounts();
    } else {
      toast.error("新增失敗");
    }
  };

  const handleDelete = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (res.ok) {
    toast.success("刪除成功");
    fetchAccounts();
  } else {
    toast.error("刪除失敗");
  }
};


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

      {/* 新增帳號表單 */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="帳號"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="密碼"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          <option value="sales">sales</option>
          <option value="engineer">engineer</option>
          <option value="admin">admin</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          新增帳號
        </button>
      </div>

      {/* 帳號列表 */}
      <ul className="space-y-2">
        {accounts.map((account) => (
          <li
            key={account.id}
            className="flex items-center justify-between border p-2 rounded"
          >
            <span>
              {account.username} ({account.role})
            </span>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => handleDelete(account.id)}
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
