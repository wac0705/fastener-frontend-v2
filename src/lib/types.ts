// lib/types.ts

// 功能頁（選單）型別
export type Menu = {
  id: number;
  name: string;
  path: string;
  icon?: string;
  parent_id?: number | null;
  order_no?: number;
  is_active: boolean;
};

// 角色型別
export type Role = {
  id: number;
  name: string;
};

// 角色與 menu 的權限設定（用於前端批次設定時）
export type RoleMenu = {
  role_id: number;
  menu_id: number;
}；
