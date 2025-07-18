"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  // 檢查登入狀態與權限
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
  }, [router]);

  // 取得所有帳號資料
  const fetchAccounts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        throw new Error("取得帳號資料失敗");
      }
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "發生未知錯誤");
    }
  };

  // 新增帳號
  const handleAdd = async () => {
    if (!newUsername || !newPassword) {
      toast.error("帳號和密碼為必填欄位");
      return;
    }
    const token = localStorage.getItem("token");
    try {
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
        await fetchAccounts();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "新增失敗");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "發生未知錯誤");
    }
  };

  // 刪除帳號
  const handleDelete = async (id: number) => {
    // 可以在此加入一個確認對話框，避免誤刪
    // if (!confirm("確定要刪除此帳號嗎？")) {
    //   return;
    // }
    const token = localStorage.getItem("token");
    try {
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
        await fetchAccounts();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "刪除失敗");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "發生未知錯誤");
    }
  };

  // 載入中畫面
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">正在驗證身分中...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">帳號管理</h1>

      {/* 新增帳號表單 */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">新增帳號</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="新帳號"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Input
            placeholder="新密碼"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {/* 這邊暫時先用原生的 select */}
          <select
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="sales">sales</option>
            <option value="engineer">engineer</option>
            <option value="admin">admin</option>
          </select>
          <Button onClick={handleAdd}>新增帳號</Button>
        </div>
      </div>

      {/* 帳號列表 */}
      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between border p-3 rounded-lg bg-card/50"
          >
            <div className="font-mono text-sm">
              <span className="font-semibold">{account.username}</span>
              <span className="text-muted-foreground ml-2">({account.role})</span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(account.id)}
              disabled={account.role === 'admin'} // 防止 admin 被刪除
            >
              刪除
            </Button>
          </div>
        ))}
      </ul>
    </main>
  );
}
