// fastener-frontend-v2-main/src/app/dashboard/definitions/customers/page.tsx
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    CustomerListItem, 
    Customer,
    getCustomers, 
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from "@/lib/api";
import { PlusCircle, X } from "lucide-react";

// --- Modal 元件 ---
function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-16">
            <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-3xl relative animate-in fade-in-0 zoom-in-95">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    );
}

// --- 客戶編輯/新增表單 ---
function CustomerForm({ customerId, onSave, onCancel }: { customerId: number | null, onSave: () => void, onCancel: () => void }) {
    const [customer, setCustomer] = useState<Partial<Customer>>({
        group_customer_code: '',
        group_customer_name: '',
        remarks: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = customerId !== null;

    useEffect(() => {
        if (isEditing) {
            setIsLoading(true);
            getCustomerById(customerId).then(data => {
                setCustomer(data);
            }).finally(() => setIsLoading(false));
        }
    }, [customerId, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!customer.group_customer_code || !customer.group_customer_name) {
            toast.error("客戶代碼和名稱為必填項");
            return;
        }
        
        const payload = {
            group_customer_code: customer.group_customer_code,
            group_customer_name: customer.group_customer_name,
            remarks: customer.remarks || '',
        };

        try {
            if (isEditing) {
                await updateCustomer(customerId, payload);
                toast.success("客戶資料更新成功");
            } else {
                await createCustomer(payload);
                toast.success("客戶建立成功");
            }
            onSave();
        } catch (_error) {}
    };

    if (isLoading) return <p>載入客戶資料中...</p>;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">集團客戶代碼</label>
                    <Input name="group_customer_code" value={customer.group_customer_code} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">集團客戶名稱</label>
                    <Input name="group_customer_name" value={customer.group_customer_name} onChange={handleChange} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">備註</label>
                <textarea name="remarks" value={customer.remarks} onChange={handleChange} rows={3}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
            {/* 未來交易條件的管理區塊會放在這裡 */}
            <div className="mt-6 p-4 border-t">
                <h3 className="text-lg font-semibold">交易條件</h3>
                <p className="text-muted-foreground text-sm mt-2">(主從式交易條件編輯功能待開發)</p>
            </div>
            <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={onCancel} className="mr-2">取消</Button>
                <Button onClick={handleSubmit}>{isEditing ? "儲存變更" : "建立客戶"}</Button>
            </div>
        </div>
    );
}


// --- 主頁面元件 ---
export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState<{ isOpen: boolean; customerId: number | null }>({ isOpen: false, customerId: null });

  const router = useRouter();

  const loadCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (_error) {
    } finally {
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
    loadCustomers();
  }, [router, loadCustomers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => 
        customer.group_customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.group_customer_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const handleOpenModal = (customerId: number | null) => {
    setModalState({ isOpen: true, customerId });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, customerId: null });
  };

  const handleSave = () => {
    handleCloseModal();
    loadCustomers(); // 重新載入列表
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("確定要刪除此客戶嗎？其下的所有交易條件也將一併刪除。")) return;
    try {
        await deleteCustomer(id);
        toast.success("客戶刪除成功");
        loadCustomers();
    } catch(_error) {}
  }

  return (
    <main className="container mx-auto max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">客戶資料管理</h1>
        <Button onClick={() => handleOpenModal(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            新增客戶
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="搜尋客戶代碼或名稱..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg">
        <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">客戶代碼</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">客戶名稱</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">操作</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {isLoading ? (
                        <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">載入中...</td></tr>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle font-mono">{customer.group_customer_code}</td>
                                <td className="p-4 align-middle font-medium">{customer.group_customer_name}</td>
                                <td className="p-4 align-middle">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(customer.id)}>編輯</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(customer.id)}>刪除</Button>
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
            title={modalState.customerId ? "編輯客戶資料" : "新增客戶"}
            onClose={handleCloseModal}
        >
            <CustomerForm 
                customerId={modalState.customerId}
                onSave={handleSave}
                onCancel={handleCloseModal}
            />
        </Modal>
      )}
    </main>
  );
}
