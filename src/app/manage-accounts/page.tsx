"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 擴充 Account 介面
interface Account {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
}

export default function ManageAccountsPage() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("sales");

  // --- 新增 state 來管理編輯狀態 ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState("");
  const [editingIsActive, setEditingIsActive] = useState(true);

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
  }, [router]);

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
      // 在這邊進行排序，確保 admin 帳號總是在最上面
      data.sort((a: Account, b: Account) => {
        if (a.role === 'admin') return -1;
        if (b.role === 'admin') return 1;
        return a.id - b.id;
      });
      setAccounts(data || []); // 確保 data 不是 null
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "發生未知錯誤");
      setAccounts([]); // 發生錯誤時清空
    }
  };

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

  const handleDelete = async (id: number) => {
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

  // --- 新增：處理更新帳號的函式 ---
  const handleUpdate = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: editingRole,
            is_active: editingIsActive,
          }),
        }
      );

      if (res.ok) {
        toast.success("更新成功");
        setEditingId(null); // 結束編輯模式
        await fetchAccounts();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "更新失敗");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "發生未知錯誤");
    }
  };

  // --- 新增：進入編輯模式的函式 ---
  const startEditing = (account: Account) => {
    setEditingId(account.id);
    setEditingRole(account.role);
    setEditingIsActive(account.is_active);
  };

  // --- 新增：取消編輯的函式 ---
  const cancelEditing = () => {
    setEditingId(null);
  };

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

      {/* --- 修改帳號列表的渲染邏輯 --- */}
      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between border p-3 rounded-lg bg-card/50"
          >
            {editingId === account.id ? (
              // 編輯模式
              <>
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2 items-center pr-4">
                  <span className="font-semibold font-mono">{account.username}</span>
                  <select
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    value={editingRole}
                    onChange={(e) => setEditingRole(e.target.value)}
                  >
                    <option value="sales">sales</option>
                    <option value="engineer">engineer</option>
                    <option value="admin">admin</option>
                  </select>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={editingIsActive}
                      onChange={(e) => setEditingIsActive(e.target.checked)}
                    />
                    啟用
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdate(account.id)}>儲存</Button>
                  <Button size="sm" variant="outline" onClick={cancelEditing}>取消</Button>
                </div>
              </>
            ) : (
              // 一般顯示模式
              <>
                <div className="font-mono text-sm flex items-center gap-4">
                  <span className={`font-semibold ${!account.is_active && 'text-muted-foreground line-through'}`}>
                    {account.username}
                  </span>
                  <span className="text-muted-foreground">({account.role})</span>
                  {!account.is_active && <span className="text-xs text-destructive font-bold">[已停用]</span>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(account)}
                    disabled={account.id === 1} // 保護 ID 為 1 的帳號
                  >
                    編輯
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(account.id)}
                    disabled={account.id === 1} // 保護 ID 為 1 的帳號
                  >
                    刪除
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
