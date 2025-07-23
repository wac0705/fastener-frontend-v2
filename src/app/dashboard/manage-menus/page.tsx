// src/app/dashboard/manage-menus/page.tsx
"use client";
import { useEffect, useState } from "react";
import { fetchMenus, createMenu, updateMenu, deleteMenu } from "@/lib/api-menus";
import { Menu } from "@/lib/types";

export default function ManageMenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadMenus() {
    setLoading(true);
    try {
      const data = await fetchMenus();
      setMenus(data);
    } catch (err) {
      alert("讀取 menu 失敗");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMenus();
  }, []);

  // 新增
  async function handleAdd() {
    const name = prompt("功能名稱：");
    if (!name) return;
    const path = prompt("路徑（如 /dashboard/xxxx）：");
    if (!path) return;
    try {
      await createMenu({ name, path, is_active: true });
      await loadMenus();
    } catch {
      alert("新增 menu 失敗");
    }
  }

  // 編輯
  async function handleEdit(menu: Menu) {
    const name = prompt("編輯名稱：", menu.name);
    if (!name) return;
    const path = prompt("編輯路徑：", menu.path);
    if (!path) return;
    try {
      await updateMenu(menu.id, { ...menu, name, path });
      await loadMenus();
    } catch {
      alert("編輯 menu 失敗");
    }
  }

  // 刪除
  async function handleDelete(menu: Menu) {
    if (!window.confirm(`確定要刪除 ${menu.name}？`)) return;
    try {
      await deleteMenu(menu.id);
      await loadMenus();
    } catch {
      alert("刪除 menu 失敗");
    }
  }

  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">功能頁選單管理</h1>
      <button
        className="mb-4 px-4 py-2 rounded bg-primary text-white hover:bg-primary/80"
        onClick={handleAdd}
      >
        新增功能頁
      </button>
      {loading ? (
        <div>載入中...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-muted">
              <th className="p-2">名稱</th>
              <th className="p-2">路徑</th>
              <th className="p-2">啟用</th>
              <th className="p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id} className="border-t">
                <td className="p-2">{menu.name}</td>
                <td className="p-2">{menu.path}</td>
                <td className="p-2">{menu.is_active ? "✅" : "❌"}</td>
                <td className="p-2 flex gap-2">
                  <button className="text-blue-700" onClick={() => handleEdit(menu)}>
                    編輯
                  </button>
                  <button className="text-red-700" onClick={() => handleDelete(menu)}>
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
