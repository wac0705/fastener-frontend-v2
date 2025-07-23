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
