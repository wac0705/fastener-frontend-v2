"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Account {
  id: number;
  username: string;
  role: string;
  company_id: number;
  company_name?: string;
  is_active: boolean;
}

interface Company {
  id: number;
  name: string;
  parent_id: number | null;
}

interface CompanyWithChildren extends Company {
  children?: CompanyWithChildren[];
}

function flattenCompanies(tree: CompanyWithChildren[]): Company[] {
  const result: Company[] = [];
  function traverse(node: CompanyWithChildren) {
    result.push({
      id: node.id,
      name: node.name,
      parent_id: node.parent_id,
    });
    if (Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  }
  tree.forEach(traverse);
  return result;
}

export default function ManageAccountsPage() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("sales");
  const [newCompanyId, setNewCompanyId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState("");
  const [editingIsActive, setEditingIsActive] = useState(true);
  const [role, setRole] = useState("");
  const [myCompanyId, setMyCompanyId] = useState<number | null>(null);

  // 新增: 密碼重設相關 state
  const [resetId, setResetId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);

  const router = useRouter();

  // 只允許 superadmin、company_admin 進入管理頁
  useEffect(() => {
    const localRole = localStorage.getItem("role") || "";
    if (localRole !== "superadmin" && localRole !== "company_admin") {
      toast.error("你沒有權限進入帳號管理頁面");
      router.replace("/");
      return;
    }
    setRole(localRole);
    setMyCompanyId(Number(localStorage.getItem("company_id") || "0"));
    setLoading(true);
    fetchData();
    // eslint-disable-next-line
  }, [router]);

  // 展平公司工具：遞迴取得所有下層公司 id
  function getDescendantCompanyIds(companies: Company[], rootId: number): number[] {
    const result: number[] = [];
    function traverse(id: number) {
      result.push(id);
      companies.filter(c => c.parent_id === id).forEach(child => traverse(child.id));
    }
    traverse(rootId);
    return result;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("company_id");
    toast.success("您已成功登出");
    router.push("/login");
  };

  // 取得公司與帳號資料
  const fetchData = async () => {
    try {
      const companyId = Number(localStorage.getItem("company_id") || "0");
      // 公司
      const resCompany = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/definitions/companies`
      );
      if (resCompany.ok) {
        const data: CompanyWithChildren[] = await resCompany.json();
        const flat = flattenCompanies(data);
        setCompanies(flat);
        setNewCompanyId(companyId);
      } else {
        toast.error("取得公司清單失敗");
      }
      // 帳號
      await fetchAccounts();
    } catch {
      toast.error("取得公司清單失敗");
    }
    setLoading(false);
  };

  // 根據權限分流可選公司
  const selectableCompanyIds =
    role === "superadmin"
      ? companies.map(c => c.id)
      : myCompanyId
        ? getDescendantCompanyIds(companies, myCompanyId)
        : [];
  const selectableCompanies = companies.filter(c => selectableCompanyIds.includes(c.id));

  // 取得帳號清單
  const fetchAccounts = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts`
      );
      if (!res.ok) throw new Error("取得帳號資料失敗");
      const data = await res.json();
      data.sort((a: Account, b: Account) => {
        if (a.role === 'superadmin' || a.role === 'company_admin') return -1;
        if (b.role === 'superadmin' || b.role === 'company_admin') return 1;
        return a.id - b.id;
      });
      setAccounts(data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "發生未知錯誤");
      setAccounts([]);
    }
  };

  const handleAdd = async () => {
    if (!newUsername || !newPassword || !newCompanyId) {
      toast.error("帳號、密碼、公司為必填欄位");
      return;
    }
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts`,
        {
          method: "POST",
          body: JSON.stringify({
            username: newUsername,
            password: newPassword,
            role: newRole,
            company_id: newCompanyId,
          }),
        }
      );
      if (res.ok) {
        toast.success("新增成功");
        setNewUsername("");
        setNewPassword("");
        setNewRole("sales");
        setNewCompanyId(myCompanyId);
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
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts/${id}`,
        { method: "DELETE" }
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

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            role: editingRole,
            is_active: editingIsActive,
          }),
        }
      );
      if (res.ok) {
        toast.success("更新成功");
        setEditingId(null);
        await fetchAccounts();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "更新失敗");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "發生未知錯誤");
    }
  };

  // 新增：密碼重設
  const handleResetPassword = async () => {
    if (!resetId || !resetPassword) {
      toast.error("請輸入新密碼");
      return;
    }
    setIsResetLoading(true);
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/manage-accounts/${resetId}/reset-password`,
        {
          method: "PUT",
          body: JSON.stringify({ password: resetPassword }),
        }
      );
      if (res.ok) {
        toast.success("密碼已更新");
        setResetId(null);
        setResetPassword("");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "修改密碼失敗");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "發生未知錯誤");
    }
    setIsResetLoading(false);
  };

  const startEditing = (account: Account) => {
    setEditingId(account.id);
    setEditingRole(account.role);
    setEditingIsActive(account.is_active);
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">帳號管理</h1>
        <Button variant="outline" onClick={handleLogout}>
          登出
        </Button>
      </div>

      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">新增帳號</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <option value="company_admin">company_admin</option>
            <option value="superadmin">superadmin</option>
          </select>
          <select
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            value={newCompanyId ?? ""}
            onChange={e => setNewCompanyId(Number(e.target.value))}
            disabled={role !== "superadmin" && selectableCompanies.length === 1}
          >
            <option value="">選擇公司</option>
            {selectableCompanies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Button onClick={handleAdd}>新增帳號</Button>
        </div>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between border p-3 rounded-lg bg-card/50"
          >
            {editingId === account.id ? (
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
                    <option value="company_admin">company_admin</option>
                    <option value="superadmin">superadmin</option>
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
              <>
                <div className="font-mono text-sm flex items-center gap-4">
                  <span className={`font-semibold ${!account.is_active && 'text-muted-foreground line-through'}`}>
                    {account.username}
                  </span>
                  <span className="text-muted-foreground">({account.role})</span>
                  {account.company_name && <span className="ml-2 text-xs">{account.company_name}</span>}
                  {!account.is_active && <span className="text-xs text-destructive font-bold">[已停用]</span>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(account)}
                    disabled={account.id === 1}
                  >
                    編輯
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(account.id)}
                    disabled={account.id === 1}
                  >
                    刪除
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResetId(account.id)}
                  >
                    修改密碼
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 新增：密碼重設 Dialog */}
      <Dialog open={!!resetId} onOpenChange={open => {
        if (!open) {
          setResetId(null);
          setResetPassword("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改密碼</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            placeholder="請輸入新密碼"
            value={resetPassword}
            onChange={e => setResetPassword(e.target.value)}
          />
          <Button
            className="mt-4 w-full"
            onClick={handleResetPassword}
            disabled={isResetLoading}
          >
            {isResetLoading ? "儲存中..." : "儲存新密碼"}
          </Button>
        </DialogContent>
      </Dialog>
    </main>
  );
}
