// src/lib/api.ts

import { fetchWithAuth } from './fetchWithAuth';
// 統一從 @/models 匯入所有資料模型
import { Company } from '@/models/company';

// --- 基礎設定 ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// --- 為其他頁面需要的資料預先定義基礎模型 ---
// 這樣可以避免 'any' 型別，讓程式碼更安全
// 您未來可以根據後端回傳的實際資料，來完善這些 interface
export interface Customer {
  id: number;
  name: string;
  code: string;
  [key: string]: any; // 允許其他未知欄位，保持彈性
}

export interface ProductCategory {
  id: number;
  name: string;
  [key: string]: any;
}

export interface CustomerTradeTerm {
  id: number;
  [key: string]: any;
}

// === 公司 (Company) 相關函式 ===
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create company');
    }
    return response.json();
}

// === 客戶 (Customer) 相關函式 ===
export async function getCustomers(): Promise<Customer[]> {
  const response = await fetchWithAuth(`${API_URL}/customers`);
  if (!response.ok) { throw new Error('Failed to fetch customers'); }
  return response.json();
}

export async function getCustomerById(id: string | number): Promise<Customer> {
    const response = await fetchWithAuth(`${API_URL}/customers/${id}`);
    if (!response.ok) { throw new Error('Failed to fetch customer by ID'); }
    return response.json();
}

export async function getCustomerByCode(code: string): Promise<Customer> {
    const response = await fetchWithAuth(`${API_URL}/customers/code/${code}`);
    if (!response.ok) { throw new Error('Failed to fetch customer by code'); }
    return response.json();
}

export async function createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    const response = await fetchWithAuth(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
    });
    if (!response.ok) { throw new Error('Failed to create customer'); }
    return response.json();
}

export async function updateCustomer(id: string | number, customerData: Partial<Customer>): Promise<Customer> {
    const response = await fetchWithAuth(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
    });
    if (!response.ok) { throw new Error('Failed to update customer'); }
    return response.json();
}

export async function deleteCustomer(id: string | number): Promise<void> {
    const response = await fetchWithAuth(`${API_URL}/customers/${id}`, { method: 'DELETE' });
    if (!response.ok) { throw new Error('Failed to delete customer'); }
}

// === 產品類別 (Product Category) 相關函式 ===
export async function getProductCategories(): Promise<ProductCategory[]> {
    const response = await fetchWithAuth(`${API_URL}/product-categories`);
    if (!response.ok) { throw new Error('Failed to fetch product categories'); }
    return response.json();
}

export async function createProductCategory(categoryData: Partial<ProductCategory>): Promise<ProductCategory> {
    const response = await fetchWithAuth(`${API_URL}/product-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) { throw new Error('Failed to create product category'); }
    return response.json();
}

export async function updateProductCategory(id: string | number, categoryData: Partial<ProductCategory>): Promise<ProductCategory> {
    const response = await fetchWithAuth(`${API_URL}/product-categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) { throw new Error('Failed to update product category'); }
    return response.json();
}

export async function deleteProductCategory(id: string | number): Promise<void> {
    const response = await fetchWithAuth(`${API_URL}/product-categories/${id}`, { method: 'DELETE' });
    if (!response.ok) { throw new Error('Failed to delete product category'); }
}

// === 客戶交易條件 (Customer Trade Terms) 相關函式 ===
export async function getCustomerTradeTerms(customerId: string | number): Promise<CustomerTradeTerm[]> {
    // 注意：這裡的 API 路徑是我的猜測，您可能需要根據後端 API 的實際路徑進行調整
    const response = await fetchWithAuth(`${API_URL}/customers/${customerId}/tradeterms`); 
    if (!response.ok) { throw new Error('Failed to fetch customer trade terms'); }
    return response.json();
}
