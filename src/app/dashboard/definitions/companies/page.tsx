// fastener-frontend-v2-main/src/app/dashboard/definitions/companies/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Company, getCompanies, createCompany, updateCompany, deleteCompany } from "@/lib/api";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCompanyName, setNewCompanyName] = useState("");
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      toast.error("權限不足");
      router.push("/");
      return;
    }
    loadCompanies();
  }, [router]);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch (_error) { // 【修正處】
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAdd = async () => {
    if (!newCompanyName.trim()) {
      toast.error("公司名稱不能為空");
      return;
    }
    try {
      await createCompany(newCompanyName);
      toast.success("新增成功");
      setNewCompanyName("");
      loadCompanies();
    } catch (_error) {} // 【修正處】
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) {
      toast.error("公司名稱不能為空");
      return;
    }
    try {
        await updateCompany(id, editingName);
        toast.success("更新成功");
        setEditingId(null);
        loadCompanies();
    } catch(_error) {} // 【修正處】
  }

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除這家公司嗎？相關聯的使用者將無法登入。")) return;
    try {
        await deleteCompany(id);
        toast.success("刪除成功");
        loadCompanies();
    } catch(_error) {} // 【修正處】
  }

  const startEditing = (company: Company) => {
    setEditingId(company.id);
    setEditingName(company.name);
  }

  return (
    <main className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">公司資料管理</h1>

      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">新增公司</h2>
        <div className="flex gap-4">
          <Input
            placeholder="輸入新公司名稱"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
          />
          <Button onClick={handleAdd}>新增</Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-2">公司列表</h2>
        {isLoading ? (
          <p className="text-muted-foreground">載入中...</p>
        ) : (
          companies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between border p-3 rounded-lg bg-card/50"
            >
              {editingId === company.id ? (
                <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-grow mr-4"
                />
              ) : (
                <span className="font-mono text-sm">{company.name}</span>
              )}
              
              <div className="flex gap-2">
                {editingId === company.id ? (
                    <>
                        <Button size="sm" onClick={() => handleUpdate(company.id)}>儲存</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>取消</Button>
                    </>
                ) : (
                    <>
                        <Button variant="outline" size="sm" onClick={() => startEditing(company)}>編輯</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(company.id)} disabled={company.id === 1}>刪除</Button>
                    </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
