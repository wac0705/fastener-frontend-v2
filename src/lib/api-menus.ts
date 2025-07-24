// fastener-frontend-v2/src/lib/api-menus.ts

import { fetchWithAuth } from './fetchWithAuth';
import { Menu } from './types'; // 確保 Menu type 已定義

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 給 Sidebar 使用，獲取當前登入者的選單
export const getUserMenus = async (): Promise<Menu[]> => {
  return fetchWithAuth(`${API_URL}/user-menus`);
};

// 給「角色選單權限管理」頁面使用，獲取所有選單
export const getAllMenusTree = async (): Promise<Menu[]> => {
  return fetchWithAuth(`${API_URL}/menus/tree`);
};

// --- 以下是您可能已經有的其他函式 ---

export const getMenus = async (): Promise<Menu[]> => {
  return fetchWithAuth(`${API_URL}/menus`);
};

export const createMenu = async (menuData: Omit<Menu, 'id' | 'children'>): Promise<Menu> => {
  return fetchWithAuth(`${API_URL}/menus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(menuData),
  });
};

// ... 其他更新和刪除的函式 ...
