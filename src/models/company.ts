// src/models/company.ts

export interface Company {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  created_at: string; // 在 TypeScript 中，日期通常以 string 或 Date 物件處理
  updated_at: string;
}
