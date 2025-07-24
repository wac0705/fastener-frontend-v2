// lib/types.ts

export type Menu = {
  id: number;
  name: string;
  path: string;
  icon?: string;
  parent_id?: number | null;
  order_no?: number;
  is_active: boolean;
};

export type Role = {
  id: number;
  name: string;
};

export type RoleMenu = {
  role_id: number;
  menu_id: number;
};
