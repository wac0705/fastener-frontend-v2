// components/DashboardMenu.tsx

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ROLE_DASHBOARD_MAP, DashboardItem } from "@/lib/roleDashboardMap";

export default function DashboardMenu() {
  const [role, setRole] = useState<string>("");

  // 初始化取得 role
  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  // 取得對應功能頁
  const menuItems: DashboardItem[] = ROLE_DASHBOARD_MAP[role] || [];

  return (
    <nav className="flex flex-col gap-3">
      {menuItems.length === 0 && (
        <div className="text-muted-foreground">尚未分配可用功能</div>
      )}
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className="flex items-center gap-2 p-3 rounded-xl hover:bg-muted transition"
        >
          {/* 若未來有 icon，可這樣插入： */}
          {/* {item.icon && <span>{item.icon}</span>} */}
          <span className="font-medium">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
