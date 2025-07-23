"use client";
import { useEffect, useState } from "react";
import { fetchMenus } from "@/lib/api-menus";
import { fetchRoleMenus } from "@/lib/api-roles";
import { Menu } from "@/lib/types";
import Link from "next/link";

export default function Sidebar() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [roleMenuIds, setRoleMenuIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 取得目前角色與對應 menu 權限
    const role = localStorage.getItem("role"); // 依你的登入流程而定
    const roleId = localStorage.getItem("role_id"); // 建議登入時一併存 role_id
    if (!roleId) return;

    Promise.all([fetchMenus(), fetchRoleMenus(Number(roleId))]).then(([allMenus, menuIds]) => {
      setMenus(allMenus);
      setRoleMenuIds(menuIds);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>載入中...</div>;

  return (
    <aside className="w-64 border-r p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">後台功能選單</h2>
      <nav className="flex flex-col gap-2">
        {menus
          .filter((menu) => roleMenuIds.includes(menu.id) && menu.is_active)
          .map((menu) => (
            <Link
              key={menu.id}
              href={menu.path}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            >
              {/* 可加 icon */}
              {menu.name}
            </Link>
          ))}
      </nav>
    </aside>
  );
}
