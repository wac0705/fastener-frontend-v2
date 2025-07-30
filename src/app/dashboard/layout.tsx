// src/app/dashboard/layout.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ROLE_DASHBOARD_MAP } from "@/lib/roleDashboardMap";
import {
  Users, Building, Settings, Package, LogOut,
  FileText, Truck, ClipboardCheck, Wrench
} from "lucide-react";
import { useRouter } from "next/navigation";

// iconMap 建議統一集中管理
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "帳號管理": Users,
  "公司資料": Building,
  "公司組織": Building,
  "全部客戶": Users,
  "客戶管理": Users,
  "客戶資料": Users,
  "產品類別": Package,
  "報價管理": FileText,
  "出貨追蹤": Truck,
  "系統日誌": ClipboardCheck,
  "規格審查": Wrench,
  "製程追蹤": Wrench,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  const menuItems = ROLE_DASHBOARD_MAP[role] || [];

  // 登出邏輯
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("company_id");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="w-64 flex-col border-r bg-background p-4 hidden md:flex justify-between">
        <div>
          <div className="mb-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Settings className="h-6 w-6" />
              <span>報價系統後台</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-2">
            {menuItems.map(item => {
              const Icon = iconMap[item.name] || Settings;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full mt-6 text-destructive px-3 py-2 rounded-lg hover:bg-destructive/10 transition font-medium"
        >
          <LogOut className="h-5 w-5" />
          登出帳號
        </button>
      </aside>
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
