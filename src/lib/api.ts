// fastener-frontend-v2-main/src/lib/api.ts
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || `請求失敗，狀態碼: ${response.status}`;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        return { success: true };
    }
    return response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "發生未知網路錯誤";
    if (!message.startsWith("請求失敗")) {
        toast.error(message);
    }
    throw error;
  }
}

// --- 公司 (Companies) 相關的 API (階層版) ---
export interface Company {
  id: number;
  name: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children?: Company[];
}
export const getCompanies = (): Promise<Company[]> => fetchWithAuth("/api/definitions/companies");

export const createCompany = (data: { name: string; parent_id: number | null }): Promise<Company> => {
    return fetchWithAuth("/api/definitions/companies", { method: "POST", body: JSON.stringify(data) });
};

export const updateCompany = (id: number, data: { name: string; parent_id: number | null }): Promise<{ message: string }> => {
    return fetchWithAuth(`/api/definitions/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteCompany = (id: number): Promise<{ message: string }> => fetchWithAuth(`/api/definitions/companies/${id}`, { method: 'DELETE' });

// ... (其他 API 不變)


// --- 客戶 (Customers) 相關的 API ---
export interface CustomerTransactionTerm { id: number; customer_id: number; company_id: number; incoterm: string; currency_code: string; }
export interface Customer { id: number; group_customer_code: string; group_customer_name: string; remarks: string; created_at: string; updated_at: string; transaction_terms: CustomerTransactionTerm[]; }
export type CustomerListItem = Omit<Customer, 'transaction_terms'>;
export const getCustomers = (): Promise<CustomerListItem[]> => fetchWithAuth('/api/definitions/customers');
export const getCustomerById = (id: number): Promise<Customer> => fetchWithAuth(`/api/definitions/customers/${id}`);
export const createCustomer = (data: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'transaction_terms'>): Promise<Customer> => fetchWithAuth('/api/definitions/customers', { method: 'POST', body: JSON.stringify(data) });
export const updateCustomer = (id: number, data: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'transaction_terms'>): Promise<Customer> => fetchWithAuth(`/api/definitions/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCustomer = (id: number): Promise<{ success: true }> => fetchWithAuth(`/api/definitions/customers/${id}`, { method: 'DELETE' });


// --- 產品定義 (Product Definitions) 相關的 API ---
export interface ProductCategory { id: number; category_code: string; name: string; }
export const getProductCategories = (): Promise<ProductCategory[]> => fetchWithAuth('/api/definitions/product-categories');
export const createProductCategory = (data: Omit<ProductCategory, 'id'>): Promise<ProductCategory> => fetchWithAuth('/api/definitions/product-categories', { method: 'POST', body: JSON.stringify(data) });
export const updateProductCategory = (id: number, data: Omit<ProductCategory, 'id'>): Promise<ProductCategory> => fetchWithAuth(`/api/definitions/product-categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProductCategory = (id: number): Promise<{ success: true }> => fetchWithAuth(`/api/definitions/product-categories/${id}`, { method: 'DELETE' });

export interface ProductShape { id: number; shape_code: string; name: string; }
export const getProductShapes = (): Promise<ProductShape[]> => fetchWithAuth('/api/definitions/product-shapes');
export const createProductShape = (data: Omit<ProductShape, 'id'>): Promise<ProductShape> => fetchWithAuth('/api/definitions/product-shapes', { method: 'POST', body: JSON.stringify(data) });

export interface ProductFunction { id: number; function_code: string; name: string; }
export const getProductFunctions = (): Promise<ProductFunction[]> => fetchWithAuth('/api/definitions/product-functions');
export const createProductFunction = (data: Omit<ProductFunction, 'id'>): Promise<ProductFunction> => fetchWithAuth('/api/definitions/product-functions', { method: 'POST', body: JSON.stringify(data) });

export interface ProductSpecification { id: number; spec_code: string; name: string; parent_id: number | null; }
export const getProductSpecifications = (): Promise<ProductSpecification[]> => fetchWithAuth('/api/definitions/product-specifications');
export const createProductSpecification = (data: Omit<ProductSpecification, 'id'>): Promise<ProductSpecification> => fetchWithAuth('/api/definitions/product-specifications', { method: 'POST', body: JSON.stringify(data) });
