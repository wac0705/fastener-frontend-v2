// src/lib/api-menus.ts
import { Menu } from "./types";
import { fetchWithAuth } from "./fetchWithAuth";

const API_URL = process.env.NEXT_PUBLIC_API_BASE || "";

export async function fetchMenus(): Promise<Menu[]> {
  const res = await fetchWithAuth(`${API_URL}/api/menus`);
  if (!res.ok) throw new Error("無法取得 menu 列表");
  return await res.json();
}

export async function createMenu(menu: Partial<Menu>): Promise<Menu> {
  const res = await fetchWithAuth(`${API_URL}/api/menus`, {
    method: "POST",
    body: JSON.stringify(menu),
  });
  if (!res.ok) throw new Error("新增 menu 失敗");
  return await res.json();
}

export async function updateMenu(id: number, menu: Partial<Menu>): Promise<Menu> {
  const res = await fetchWithAuth(`${API_URL}/api/menus/${id}`, {
    method: "PUT",
    body: JSON.stringify(menu),
  });
  if (!res.ok) throw new Error("編輯 menu 失敗");
  return await res.json();
}

export async function deleteMenu(id: number) {
  const res = await fetchWithAuth(`${API_URL}/api/menus/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("刪除 menu 失敗");
}
