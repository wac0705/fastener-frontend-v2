// src/lib/api.ts

import { fetchWithAuth } from './fetchWithAuth';
import { Company } from '@/models/company';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// --- 根據後端模型和前端頁面用法，定義最精確的型別 ---
export interface Customer {
  id: number;
  code: string;
  name: string;
  address: string;
  phone_number: string;
  contact_person: string;
  email: string;
  tax_id: string;
  remarks: string;
  group_customer_code: string;
  group_customer_name: string;
  created_at: string;
  updated_at: string;
}

// 為 Customer 列表頁面匯出一個別名，解決 CustomerListItem 的問題
export type CustomerListItem = Customer;

export interface ProductCategory {
  id: number;
  category_code: string;
  name: string;
  description: string;
}

// 修正型別名稱以匹配前端元件的匯入
export interface CustomerTransactionTerm {
  id: number;
  customer_id: number;
  payment_type: string;
  delivery_type: string;
  currency: string;
  notes: string;
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
        headers: { 'Content-Type': 'application/json' },
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
        body: JSON.stringify(customerData),
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
// 修正函式名稱以匹配前端元件的匯入
export async function getCustomerTradeTerms(customerId: string | number): Promise<CustomerTransactionTerm[]> {
    const response = await fetchWithAuth(`${API_URL}/customers/${customerId}/tradeterms`);
    if (!response.ok) { throw new Error('Failed to fetch customer trade terms'); }
    return response.json();
}
