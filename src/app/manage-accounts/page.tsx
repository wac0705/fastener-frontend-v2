"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Account = {
  username: string;
  role: string;
};

export default function ManageAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("sales");
  const [error, setError] = useState("");
  const router = useRouter();

  // 檢查 JWT 與角色是否為 admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/login");
      return;
    }
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      setError("讀取帳號失敗");
      return;
    }
    const data = await res.json();
    setAccounts(data);
  };

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts`, {
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
    });
    if (res.ok) {
      fetchAccounts();
      setNewUsername("");
      setNewPassword("");
      setNewRole("sales");
    } else {
      setError("新增帳號失敗");
    }
  };

  const handleDelete = async (username: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });
    if (res.ok) {
      fetchAccounts();
    } else {
      setError("刪除帳號失敗");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <h1 className="text-2xl font-bold text-center">帳號管理</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        <Input
          placeholder="帳號"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <Input
          placeholder="密碼"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          <option value="sales">Sales</option>
          <option value="engineer">Engineer</option>
          <option value="admin">Admin</option>
        </select>
        <Button onClick={handleAdd}>新增帳號</Button>
      </div>

      <hr />

      <div className="space-y-2">
        {accounts.map((account) => (
          <div
            key={account.username}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>
              {account.username} - <strong>{account.role}</strong>
            </span>
            <Button variant="destructive" onClick={() => handleDelete(account.username)}>
              刪除
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
