// fastener-frontend-v2-main/src/app/dashboard/definitions/product-categories/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    ProductCategory,
    getProductCategories,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory
} from "@/lib/api";
import { PlusCircle, X } from "lucide-react";

// --- Modal 和 Form 元件 (與客戶頁面類似) ---
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

function CategoryForm({ category, onSave, onCancel }: { category: Partial<ProductCategory> | null, onSave: () => void, onCancel: () => void }) {
    const [formData, setFormData] = useState({ category_code: '', name: '' });
    const isEditing = category && category.id;

    useEffect(() => {
        if (category) {
            setFormData({
                category_code: category.category_code || '',
                name: category.name || ''
            });
        }
    }, [category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.category_code || !formData.name) {
            toast.error("類別代碼和名稱為必填項");
            return;
        }
        try {
            if (isEditing) {
                await updateProductCategory(category.id!, formData);
                toast.success("產品類別更新成功");
            } else {
                await createProductCategory(formData);
                toast.success("產品類別建立成功");
            }
            onSave();
        } catch (_error) {}
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">類別代碼</label>
                <Input name="category_code" value={formData.category_code} onChange={handleChange} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">類別名稱</label>
                <Input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={onCancel} className="mr-2">取消</Button>
                <Button onClick={handleSubmit}>{isEditing ? "儲存變更" : "建立類別"}</Button>
            </div>
        </div>
    );
}

// --- 主頁面元件 ---
export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{ isOpen: boolean; category: Partial<ProductCategory> | null }>({ isOpen: false, category: null });

  const router = useRouter();

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getProductCategories();
      setCategories(data);
    } catch (_error) {} 
    finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 權限檢查
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      toast.error("權限不足");
      router.push("/");
      return;
    }
    loadCategories();
  }, [router, loadCategories]);

  const handleOpenModal = (category: Partial<ProductCategory> | null) => {
    setModalState({ isOpen: true, category });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, category: null });
  };

  const handleSave = () => {
    handleCloseModal();
    loadCategories();
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("確定要刪除此產品類別嗎？所有相關聯的資料將一併刪除。")) return;
    try {
        await deleteProductCategory(id);
        toast.success("產品類別刪除成功");
        loadCategories();
    } catch(_error) {}
  }

  return (
    <main className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">產品類別管理</h1>
        <Button onClick={() => handleOpenModal(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            新增類別
        </Button>
      </div>

      <div className="border rounded-lg">
        <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">類別代碼</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">類別名稱</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">操作</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {isLoading ? (
                        <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">載入中...</td></tr>
                    ) : (
                        categories.map((cat) => (
                            <tr key={cat.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle font-mono">{cat.category_code}</td>
                                <td className="p-4 align-middle font-medium">{cat.name}</td>
                                <td className="p-4 align-middle">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(cat)}>編輯</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(cat.id)}>刪除</Button>
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
            title={modalState.category?.id ? "編輯產品類別" : "新增產品類別"}
            onClose={handleCloseModal}
        >
            <CategoryForm 
                category={modalState.category}
                onSave={handleSave}
                onCancel={handleCloseModal}
            />
        </Modal>
      )}
    </main>
  );
}
