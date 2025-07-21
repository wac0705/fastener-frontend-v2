"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ProductCategory,
  getProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "@/lib/api";
import { PlusCircle, X } from "lucide-react";

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-16">
      <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-lg relative animate-in fade-in-0 zoom-in-95">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProductCategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category: Partial<ProductCategory> | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [categoryCode, setCategoryCode] = useState(category?.category_code || "");
  const [name, setName] = useState(category?.name || "");
  const isEditing = category && category.id;

  const handleSubmit = async () => {
    if (!categoryCode.trim() || !name.trim()) {
      toast.error("分類代碼與名稱皆不可為空");
      return;
    }
    try {
      if (isEditing) {
        await updateProductCategory(category.id!, {
          category_code: categoryCode,
          name,
        });
        toast.success("分類更新成功");
      } else {
        await createProductCategory({
          category_code: categoryCode,
          name,
        });
        toast.success("分類建立成功");
      }
      onSave();
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">分類代碼</label>
        <Input
          value={categoryCode}
          onChange={(e) => setCategoryCode(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">分類名稱</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="mr-2">
          取消
        </Button>
        <Button onClick={handleSubmit}>
          {isEditing ? "儲存變更" : "建立分類"}
        </Button>
      </div>
    </div>
  );
}

function ProductCategoryRow({
  category,
  onEdit,
  onDelete,
}: {
  category: ProductCategory;
  onEdit: (category: ProductCategory) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <tr>
      <td className="p-2">{category.category_code}</td>
      <td className="p-2">{category.name}</td>
      <td className="p-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
          編輯
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="ml-2"
          onClick={() => onDelete(category.id)}
        >
          刪除
        </Button>
      </td>
    </tr>
  );
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    category: Partial<ProductCategory> | null;
  }>({ isOpen: false, category: null });

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getProductCategories();
      setCategories(data);
    } catch {}
    finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenModal = (category: Partial<ProductCategory> | null) => {
    setModalState({ isOpen: true, category });
  };
  const handleCloseModal = () => setModalState({ isOpen: false, category: null });
  const handleSave = () => {
    handleCloseModal();
    loadCategories();
  };
  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此分類嗎？")) return;
    try {
      await deleteProductCategory(id);
      toast.success("分類刪除成功");
      loadCategories();
    } catch {}
  };

  return (
    <main className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">產品分類</h1>
        <Button onClick={() => handleOpenModal(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增分類
        </Button>
      </div>

      <div className="border rounded-lg p-2 bg-card overflow-x-auto">
        {isLoading ? (
          <p className="p-4 text-muted-foreground">載入中...</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-2 text-left">分類代碼</th>
                <th className="p-2 text-left">分類名稱</th>
                <th className="p-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <ProductCategoryRow
                  key={category.id}
                  category={category}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalState.isOpen && (
        <Modal
          title={modalState.category?.id ? "編輯分類" : "新增分類"}
          onClose={handleCloseModal}
        >
          <ProductCategoryForm
            category={modalState.category}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </main>
  );
}
