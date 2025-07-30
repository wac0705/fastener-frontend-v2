// src/lib/api.ts

import { fetchWithAuth } from './fetchWithAuth';
// 關鍵改動：從 @/models/company 匯入我們的標準 Company 型別
import { Company } from '@/models/company'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// 移除這裡可能存在的任何本地 Company 型別定義
// interface Company { ... }  <-- 如果有類似這樣的程式碼，它會被刪除

export async function getCompanies(): Promise<Company[]> {
  const response = await fetchWithAuth(`${API_URL}/companies`);
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  return response.json();
}

export async function createCompany(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    const response = await fetchWithAuth(`${API_URL}/companies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
    });
    if (!response.ok) {
        throw new Error('Failed to create company');
    }
    return response.json();
}

// 您其他的 API 函式...
// ...
