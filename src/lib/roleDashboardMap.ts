// lib/roleDashboardMap.ts

import { ReactNode } from "react";

// 功能卡片型別
export type DashboardItem = {
  name: string;        // 顯示名稱
  path: string;        // 連結路徑
  icon?: ReactNode;    // 可選：icon
  description?: string;// 可選：描述
};

// 角色對應功能頁（請依你目前 pages/dashboard/* 為主）
export const ROLE_DASHBOARD_MAP: Record<string, DashboardItem[]> = {
  superadmin: [
    { name: "帳號管理", path: "/dashboard/manage-accounts" },
    { name: "公司組織", path: "/dashboard/definitions/companies" },
    { name: "全部客戶", path: "/dashboard/definitions/customers" },
    { name: "系統日誌", path: "/dashboard/system-log" },
  ],
  company_admin: [
    { name: "帳號管理", path: "/dashboard/manage-accounts" },
    { name: "公司組織", path: "/dashboard/companies" },
    { name: "客戶管理", path: "/dashboard/customers" },
    // 如需更多功能，請自行補上
  ],
  sales: [
    { name: "報價管理", path: "/dashboard/quotes" },
    { name: "客戶資料", path: "/dashboard/customers" },
    { name: "出貨追蹤", path: "/dashboard/shipments" },
  ],
  engineer: [
    { name: "規格審查", path: "/dashboard/spec-review" },
    { name: "製程追蹤", path: "/dashboard/production" },
  ],
  // 若有更多角色，這裡補充即可
};
