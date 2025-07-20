// fastener-frontend-v2-main/src/app/dashboard/definitions/companies/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Company,
    getCompanies,
    createCompany,
    // updateCompany, // 更新功能將在下一步驟中升級
    // deleteCompany
} from "@/lib/api";
import { PlusCircle, CornerDownRight, X } from "lucide-react";

// --- 遞迴節點元件 ---
// 這個元件會負責渲染一個公司節點，以及它的所有子公司
function CompanyNode({ company, level }: { company: Company, level: number }) {
    return (
        <div>
            <div 
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                style={{ paddingLeft: `${level * 24}px` }} // 根據層級縮排
            >
                <div className="flex items-center gap-2">
                    {level > 0 && <CornerDownRight className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-medium">{company.name}</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">編輯</Button>
                    <Button variant="destructive" size="sm" disabled={company.id === 1}>刪除</Button>
                </div>
            </div>
            {/* 遞迴渲染子公司 */}
            {company.children && company.children.length > 0 && (
                <div>
                    {company.children.map(child => (
                        <CompanyNode key={child.id} company={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Modal 和 Form 元件 (升級版) ---
function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
    // Modal 保持不變...
    return ( <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-16">...</div> );
}

function CompanyForm({ allCompanies, onSave, onCancel }: { allCompanies: Company[], onSave: () => void, onCancel: () => void }) {
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState<number | null>(null);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("公司名稱不能為空");
            return;
        }
        try {
            await createCompany({ name, parent_id: parentId });
            toast.success("公司建立成功");
            onSave();
        } catch (_error) {}
    };

    // 將扁平的公司列表轉換為可用於 select 的選項
    const companyOptions = allCompanies.flatMap(c => [{ id: c.id, name: c.name }, ...(c.children || [])]).flat();

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">公司名稱</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">上層公司 (可選)</label>
                <select
                    value={parentId === null ? "" : String(parentId)}
                    onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="">-- 無 (設為根層級) --</option>
                    {companyOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                </select>
            </div>
            <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={onCancel} className="mr-2">取消</Button>
                <Button onClick={handleSubmit}>建立公司</Button>
            </div>
        </div>
    );
}


// --- 主頁面元件 (升級版) ---
export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const loadCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch (_error) {} 
    finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      toast.error("權限不足");
      router.push("/");
      return;
    }
    loadCompanies();
  }, [router, loadCompanies]);

  const handleSave = () => {
    setIsModalOpen(false);
    loadCompanies(); // 重新載入以顯示最新的樹狀結構
  };

  return (
    <main className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">公司組織結構</h1>
        <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            新增公司
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-card">
        {isLoading ? (
            <p className="text-muted-foreground">載入中...</p>
        ) : (
            companies.map(company => (
                <CompanyNode key={company.id} company={company} level={0} />
            ))
        )}
      </div>

      {isModalOpen && (
        <Modal 
            title="新增公司"
            onClose={() => setIsModalOpen(false)}
        >
            <CompanyForm 
                allCompanies={companies}
                onSave={handleSave}
                onCancel={() => setIsModalOpen(false)}
            />
        </Modal>
      )}
    </main>
  );
}
