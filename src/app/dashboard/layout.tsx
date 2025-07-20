// fastener-frontend-v2-main/src/app/dashboard/layout.tsx
import Link from 'next/link';
// 【新增】匯入 Package 圖示
import { Users, Building, Settings, Package } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: "/dashboard/manage-accounts", icon: Users, label: "帳號管理" },
    { href: "/dashboard/definitions/companies", icon: Building, label: "公司資料" },
    { href: "/dashboard/definitions/customers", icon: Users, label: "客戶資料" },
    // 【新增】產品類別管理頁面的連結
    { href: "/dashboard/definitions/product-categories", icon: Package, label: "產品類別" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="w-64 flex-col border-r bg-background p-4 hidden md:flex">
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Settings className="h-6 w-6" />
            <span>報價系統後台</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
