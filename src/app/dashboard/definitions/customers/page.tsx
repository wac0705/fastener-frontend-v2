"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CustomerListItem,
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/api";
import { PlusCircle, X } from "lucide-react";

// ======= Modal 元件 =======
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

// ======= Customer 編輯/新增表單 =======
function CustomerForm({
  customer,
  onSave,
  onCancel,
}: {
  customer: Partial<CustomerListItem> | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [groupCustomerCode, setGroupCustomerCode] = useState(
    customer?.group_customer_code || ""
  );
  const [groupCustomerName, setGroupCustomerName] = useState(
    customer?.group_customer_name || ""
  );
  const [remarks, setRemarks] = useState(customer?.remarks || "");
  const isEditing = !!customer?.id;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!groupCustomerCode.trim() || !groupCustomerName.trim()) {
      toast.error("群組客戶代碼與名稱皆不可為空");
      return;
    }
    try {
      if (isEditing) {
        await updateCustomer(customer.id!, {
          group_customer_code: groupCustomerCode,
          group_customer_name: groupCustomerName,
          remarks,
        });
        toast.success("客戶更新成功");
      } else {
        await createCustomer({
          group_customer_code: groupCustomerCode,
          group_customer_name: groupCustomerName,
          remarks,
        });
        toast.success("客戶建立成功");
      }
      onSave();
    } catch (e) {
      toast.error("儲存失敗，請重試");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          群組客戶代碼 <span className="text-red-500">*</span>
        </label>
        <Input
          value={groupCustomerCode}
          onChange={(e) => setGroupCustomerCode(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          群組客戶名稱 <span className="text-red-500">*</span>
        </label>
        <Input
          value={groupCustomerName}
          onChange={(e) => setGroupCustomerName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">備註</label>
        <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
      </div>
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onCancel} type="button" className="mr-2">
          取消
        </Button>
        <Button type="submit">
          {isEditing ? "儲存變更" : "建立客戶"}
        </Button>
      </div>
    </form>
  );
}

// ======= 客戶表格 row 元件 =======
function CustomerRow({
  customer,
  onEdit,
  onDelete,
}: {
  customer: CustomerListItem;
  onEdit: (customer: CustomerListItem) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <tr>
      <td className="p-2">{customer.group_customer_code}</td>
      <td className="p-2">{customer.group_customer_name}</td>
      <td className="p-2">{customer.remarks}</td>
      <td className="p-2">{customer.created_at?.substring(0, 10)}</td>
      <td className="p-2">{customer.updated_at?.substring(0, 10)}</td>
      <td className="p-2 whitespace-nowrap">
        <Button variant="outline" size="sm" onClick={() => onEdit(customer)}>
          編輯
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="ml-2"
          onClick={() => onDelete(customer.id)}
        >
          刪除
        </Button>
      </td>
    </tr>
  );
}

// ======= 主頁面 =======
export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    customer: Partial<CustomerListItem> | null;
  }>({ isOpen: false, customer: null });
  const [search, setSearch] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch {
      toast.error("客戶資料讀取失敗");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleOpenModal = (customer: Partial<CustomerListItem> | null) => {
    setModalState({ isOpen: true, customer });
  };
  const handleCloseModal = () => setModalState({ isOpen: false, customer: null });
  const handleSave = () => {
    handleCloseModal();
    loadCustomers();
  };
  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此客戶嗎？")) return;
    try {
      await deleteCustomer(id);
      toast.success("客戶刪除成功");
      loadCustomers();
    } catch {
      toast.error("刪除失敗，請重試");
    }
  };

  // 搜尋邏輯
  const filtered = customers.filter(
    (c) =>
      c.group_customer_code.toLowerCase().includes(search.toLowerCase()) ||
      c.group_customer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">客戶清單</h1>
        <Button onClick={() => handleOpenModal(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增客戶
        </Button>
      </div>

      <div className="flex mb-4">
        <Input
          className="w-64"
          placeholder="搜尋客戶編碼/名稱..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-1"
            onClick={() => setSearch("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="border rounded-lg p-2 bg-card overflow-x-auto">
        {isLoading ? (
          <p className="p-4 text-muted-foreground">載入中...</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-2 text-left">群組客戶代碼</th>
                <th className="p-2 text-left">群組客戶名稱</th>
                <th className="p-2 text-left">備註</th>
                <th className="p-2 text-left">建立時間</th>
                <th className="p-2 text-left">最後修改</th>
                <th className="p-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    無資料
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalState.isOpen && (
        <Modal
          title={modalState.customer?.id ? "編輯客戶" : "新增客戶"}
          onClose={handleCloseModal}
        >
          <CustomerForm
            customer={modalState.customer}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </main>
  );
}
