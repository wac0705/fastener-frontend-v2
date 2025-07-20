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
    updateCompany,
    deleteCompany
} from "@/lib/api";
import { PlusCircle, X } from "lucide-react";

// --- Modal 和 Form 元件 (採用標準模式) ---
function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-16">
            <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-lg relative animate-in fade-in-0 zoom-in-95">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}><X className="h-4 w-4" /></Button>
                </div>
                {children}
            </div>
        </div>
    );
}

function CompanyForm({ company, onSave, onCancel }: { company: Partial<Company> | null, onSave: () => void, onCancel: () => void }) {
    const [name, setName] = useState('');
    const isEditing = company && company.id;

    useEffect(() => {
        if (company) {
            setName(company.name || '');
        }
    }, [company]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("公司名稱不能為空");
            return;
        }
        try {
            if (isEditing) {
                await updateCompany(company.id!, name);
                toast.success("公司資料更新成功");
            } else {
                await createCompany(name);
                toast.success("公司建立成功");
            }
            onSave();
        } catch (_error) {}
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">公司名稱</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={onCancel} className="mr-2">取消</Button>
                <Button onClick={handleSubmit}>{isEditing ? "儲存變更" : "建立公司"}</Button>
            </div>
        </div>
    );
}

// --- 主頁面元件 (採用標準模式) ---
export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{ isOpen: boolean; company: Partial<Company> | null }>({ isOpen: false, company: null });

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

  const handleOpenModal = (company: Partial<Company> | null) => {
    setModalState({ isOpen: true, company });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, company: null });
  };

  const handleSave = () => {
    handleCloseModal();
    loadCompanies();
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("確定要刪除此公司嗎？")) return;
    try {
        await deleteCompany(id);
        toast.success("公司刪除成功");
        loadCompanies();
    } catch(_error) {}
  }

  return (
    <main className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">公司資料管理</h1>
        <Button onClick={() => handleOpenModal(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            新增公司
        </Button>
      </div>

      <div className="border rounded-lg">
        <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">公司名稱</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">操作</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {isLoading ? (
                        <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">載入中...</td></tr>
                    ) : (
                        companies.map((comp) => (
                            <tr key={comp.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle font-mono">{comp.id}</td>
                                <td className="p-4 align-middle font-medium">{comp.name}</td>
                                <td className="p-4 align-middle">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(comp)}>編輯</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(comp.id)} disabled={comp.id === 1}>刪除</Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {modalState.isOpen && (
        <Modal 
            title={modalState.company?.id ? "編輯公司資料" : "新增公司"}
            onClose={handleCloseModal}
        >
            <CompanyForm 
                company={modalState.company}
                onSave={handleSave}
                onCancel={handleCloseModal}
            />
        </Modal>
      )}
    </main>
  );
}
