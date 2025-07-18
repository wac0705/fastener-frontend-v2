"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Account = {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
};

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("sales");
  const [error, setError] = useState("");

  const fetchAccounts = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      setAccounts(data);
    } else {
      setError("無法取得帳號資料");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      window.location.href = "/login";
      return;
    }
    fetchAccounts();
  }, []);

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
      setNewUsername("");
      setNewPassword("");
      setNewRole("sales");
      fetchAccounts();
    } else {
      setError("新增帳號失敗");
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
      fetchAccounts();
    } else {
      setError("刪除帳號失敗");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 space-y-6">
      <h1 className="text-2xl font-bold">帳號管理</h1>
      <div className="space-y-2">
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
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="sales">Sales</option>
          <option value="engineer">Engineer</option>
          <option value="admin">Admin</option>
        </select>
        <Button className="w-full" onClick={handleAdd}>
          新增帳號
        </Button>
      </div>
      {accounts.map((acc) => (
        <div
          key={acc.id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <span>
            {acc.username} - <strong>{acc.role}</strong>{" "}
            {acc.is_active ? "" : "(停用)"}
          </span>
          <Button variant="destructive" onClick={() => handleDelete(acc.id)}>
            刪除
          </Button>
        </div>
      ))}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
