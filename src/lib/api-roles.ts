// src/lib/api-roles.ts

import { Role, Menu } from "./types";
import { fetchWithAuth } from "./fetchWithAuth";

// 取得所有角色
export async function fetchRoles(): Promise<Role[]> {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE}/api/roles`);
  if (!res.ok) throw new Error("無法取得角色列表");
  return await res.json();
}

// 取得指定角色可分配 menu id 清單
export async function fetchRoleMenus(roleId: number): Promise<number[]> {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE}/api/role-menus?role_id=${roleId}`);
  if (!res.ok) throw new Error("無法取得角色 menu 權限");
  return await res.json();
}

// 儲存角色選單分配（menu_ids: number[]）
export async function updateRoleMenus(roleId: number, menuIds: number[]) {
  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE}/api/role-menus`, {
    method: "POST",
    body: JSON.stringify({ role_id: roleId, menu_ids: menuIds }),
  });
  if (!res.ok) throw new Error("儲存角色 menu 權限失敗");
}
