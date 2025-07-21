"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
import { PlusCircle, CornerDownRight, X } from "lucide-react";

// --- Utility function to flatten the tree for the select dropdown ---
function flattenCompanies(companies: Company[]): { id: number; name: string; level: number }[] {
    const result: { id: number; name: string; level: number }[] = [];
    function recurse(nodes: Company[], level: number) {
        for (const node of nodes) {
            result.push({ id: node.id, name: node.name, level });
            if (node.children) {
                recurse(node.children, level + 1);
            }
        }
    }
    recurse(companies, 0);
    return result;
}

// --- Modal & Form Components ---
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

function CompanyForm({
    company,
    allCompanies,
    onSave,
    onCancel,
}: {
    company: Partial<Company> | null;
    allCompanies: Company[];
    onSave: () => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState(company?.name || "");
    // 關鍵：parentId 只能是 number 或 null
    const [parentId, setParentId] = useState<number | null>(
        typeof company?.parent_id === "number" ? company.parent_id : null
    );
    const [currency, setCurrency] = useState(company?.currency || "USD");
    const [language, setLanguage] = useState(company?.language || "en");
    const isEditing = company && company.id;

    const companyOptions = useMemo(() => flattenCompanies(allCompanies), [allCompanies]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("公司名稱不能為空");
            return;
        }
        // 關鍵：保證 parent_id 只有 number 或 null
        const payload = {
            name,
            parent_id: parentId === null ? null : Number(parentId),
            currency: currency || "USD",
            language: language || "en",
        };
        try {
            if (isEditing) {
                await updateCompany(company.id!, payload);
                toast.success("公司更新成功");
            } else {
                await createCompany(payload);
                toast.success("公司建立成功");
            }
            onSave();
        } catch { }
    };

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
                    onChange={(e) => setParentId(e.target.value === "" ? null : Number(e.target.value))}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="">-- 無 (設為根層級) --</option>
                    {companyOptions.map(opt => (
                        <option
                            key={opt.id}
                            value={opt.id}
                            disabled={!!(isEditing && opt.id === company?.id)}
                        >
                            {"\u00A0".repeat(opt.level * 4)}
                            {opt.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">貨幣 (currency)</label>
                <Input value={currency} onChange={e => setCurrency(e.target.value)} placeholder="USD" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">語言 (language)</label>
                <Input value={language} onChange={e => setLanguage(e.target.value)} placeholder="en" />
            </div>
            <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={onCancel} className="mr-2">
                    取消
                </Button>
                <Button onClick={handleSubmit}>
                    {isEditing ? "儲存變更" : "建立公司"}
                </Button>
            </div>
        </div>
    );
}

// --- Recursive Node Component ---
function CompanyNode({
    company,
    level,
    onEdit,
    onDelete,
}: {
    company: Company;
    level: number;
    onEdit: (company: Company) => void;
    onDelete: (id: number) => void;
}) {
    return (
        <div>
            <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted group"
                style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
            >
                <div className="flex items-center gap-2">
                    {level > 0 && <CornerDownRight className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-medium">{company.name}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" onClick={() => onEdit(company)}>
                        編輯
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(company.id)}
                        disabled={company.id === 1}
                    >
                        刪除
                    </Button>
                </div>
            </div>
            {company.children && company.children.length > 0 && (
                <div>
                    {company.children.map(child => (
                        <CompanyNode
                            key={child.id}
                            company={child}
                            level={level + 1}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Main Page Component ---
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
        } catch { }
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
    const handleCloseModal = () => setModalState({ isOpen: false, company: null });
    const handleSave = () => {
        handleCloseModal();
        loadCompanies();
    };
    const handleDelete = async (id: number) => {
        if (!confirm("確定要刪除此公司嗎？其下的子公司將會被保留並提升至上一層。")) return;
        try {
            await deleteCompany(id);
            toast.success("公司刪除成功");
            loadCompanies();
        } catch { }
    };

    return (
        <main className="container mx-auto max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">公司組織結構</h1>
                <Button onClick={() => handleOpenModal(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    新增公司
                </Button>
            </div>

            <div className="border rounded-lg p-2 bg-card">
                {isLoading ? (
                    <p className="p-4 text-muted-foreground">載入中...</p>
                ) : (
                    companies.map(company => (
                        <CompanyNode
                            key={company.id}
                            company={company}
                            level={0}
                            onEdit={handleOpenModal}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            {modalState.isOpen && (
                <Modal
                    title={modalState.company?.id ? "編輯公司" : "新增公司"}
                    onClose={handleCloseModal}
                >
                    <CompanyForm
                        company={modalState.company}
                        allCompanies={companies}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                    />
                </Modal>
            )}
        </main>
    );
}
