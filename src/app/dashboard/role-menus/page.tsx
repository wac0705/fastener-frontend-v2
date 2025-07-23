// src/app/dashboard/role-menus/page.tsx
"use client";
import { useEffect, useState } from "react";
import { fetchRoles, fetchRoleMenus, updateRoleMenus } from "@/lib/api-roles";
import { fetchMenus } from "@/lib/api-menus";
import { Menu, Role } from "@/lib/types";

export default function RoleMenusPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number>();
  const [checkedMenuIds, setCheckedMenuIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // 初始化取所有角色、所有 menu
  useEffect(() => {
    fetchRoles().then(setRoles);
    fetchMenus().then(setMenus);
  }, []);

  // 選角色時查目前權限
  useEffect(() => {
    if (selectedRoleId) {
      setLoading(true);
      fetchRoleMenus(selectedRoleId)
        .then((ids) => setCheckedMenuIds(ids))
        .finally(() => setLoading(false));
    }
  }, [selectedRoleId]);

  function handleToggle(menuId: number) {
    setCheckedMenuIds((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  }

  async function handleSave() {
    if (!selectedRoleId) return;
    setLoading(true);
    try {
      await updateRoleMenus(selectedRoleId, checkedMenuIds);
      alert("儲存成功！");
    } catch {
      alert("儲存失敗！");
    }
    setLoading(false);
  }

  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">角色功能頁權限分配</h1>
      <div className="flex gap-6">
        {/* 角色清單 */}
        <div className="w-48">
          <h2 className="font-semibold mb-2">角色</h2>
          <ul className="flex flex-col gap-1">
            {roles.map((role) => (
              <li key={role.id}>
                <button
                  className={`px-3 py-2 w-full text-left rounded ${
                    selectedRoleId === role.id
                      ? "bg-primary text-white"
                      : "bg-muted text-gray-700"
                  }`}
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  {role.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* menu 權限列表 */}
        <div className="flex-1">
          <h2 className="font-semibold mb-2">可分配功能頁</h2>
          {loading ? (
            <div>載入中...</div>
          ) : !selectedRoleId ? (
            <div className="text-gray-400">請先選擇角色</div>
          ) : (
            <ul className="flex flex-col gap-2">
              {menus.map((menu) => (
                <li key={menu.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checkedMenuIds.includes(menu.id)}
                    onChange={() => handleToggle(menu.id)}
                  />
                  <span>
                    {menu.name}
                    <span className="text-xs text-gray-400 ml-2">{menu.path}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <button
            className="mt-6 px-4 py-2 rounded bg-primary text-white hover:bg-primary/80 disabled:bg-gray-400"
            disabled={!selectedRoleId || loading}
            onClick={handleSave}
          >
            儲存
          </button>
        </div>
      </div>
    </main>
  );
}
