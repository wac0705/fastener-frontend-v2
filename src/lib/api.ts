// src/lib/api.ts
import api from "@/utils/axios";
import { toast } from "sonner";

// --- 公司 (Companies) 相關的 API ---
export interface Company {
  id: number;
  name: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children?: Company[];
}

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const res = await api.get("/api/definitions/companies");
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "取得公司清單失敗");
    throw err;
  }
};

export const createCompany = async (data: { name: string; parent_id: number | null }): Promise<Company> => {
  try {
    const res = await api.post("/api/definitions/companies", data);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "公司建立失敗");
    throw err;
  }
};

export const updateCompany = async (id: number, data: { name: string; parent_id: number | null }): Promise<{ message: string }> => {
  try {
    const res = await api.put(`/api/definitions/companies/${id}`, data);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "公司更新失敗");
    throw err;
  }
};

export const deleteCompany = async (id: number): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`/api/definitions/companies/${id}`);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "公司刪除失敗");
    throw err;
  }
};

// --- 客戶 (Customers) 相關的 API ---
export interface CustomerTransactionTerm { id: number; customer_id: number; company_id: number; incoterm: string; currency_code: string; }
export interface Customer { id: number; group_customer_code: string; group_customer_name: string; remarks: string; created_at: string; updated_at: string; transaction_terms: CustomerTransactionTerm[]; }
export type CustomerListItem = Omit<Customer, 'transaction_terms'>;

export const getCustomers = async (): Promise<CustomerListItem[]> => {
  try {
    const res = await api.get('/api/definitions/customers');
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "取得客戶清單失敗");
    throw err;
  }
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  try {
    const res = await api.get(`/api/definitions/customers/${id}`);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "取得客戶資料失敗");
    throw err;
  }
};

export const createCustomer = async (data: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'transaction_terms'>): Promise<Customer> => {
  try {
    const res = await api.post('/api/definitions/customers', data);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "建立客戶失敗");
    throw err;
  }
};

export const updateCustomer = async (id: number, data: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'transaction_terms'>): Promise<Customer> => {
  try {
    const res = await api.put(`/api/definitions/customers/${id}`, data);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "更新客戶失敗");
    throw err;
  }
};

export const deleteCustomer = async (id: number): Promise<{ success: true }> => {
  try {
    const res = await api.delete(`/api/definitions/customers/${id}`);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "刪除客戶失敗");
    throw err;
  }
};

// --- 產品定義 (Product Definitions) 相關的 API ---
export interface ProductCategory { id: number; category_code: string; name: string; }
export const getProductCategories = async (): Promise<ProductCategory[]> => {
  try {
    const res = await api.get('/api/definitions/product-categories');
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "取得產品分類失敗");
    throw err;
  }
};
export const createProductCategory = async (data: Omit<ProductCategory, 'id'>): Promise<ProductCategory> => {
  try {
    const res = await api.post('/api/definitions/product-categories', data);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "建立產品分類失敗");
    throw err;
  }
};
export const updateProductCategory = async (id: number, data: Omit<ProductCategory, 'id'>): Promise<ProductCategory> => {
  try {
    const res = await api.put(`/api/definitions/product-categories/${id}`, data);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "更新產品分類失敗");
    throw err;
  }
};
export const deleteProductCategory = async (id: number): Promise<{ success: true }> => {
  try {
    const res = await api.delete(`/api/definitions/product-categories/${id}`);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "刪除產品分類失敗");
    throw err;
  }
};

export interface ProductShape { id: number; shape_code: string; name: string; }
export const getProductShapes = async (): Promise<ProductShape[]> => {
  try {
    const res = await api.get('/api/definitions/product-shapes');
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "取得產品形狀失敗");
    throw err;
  }
};
export const createProductShape = async (data: Omit<ProductShape, 'id'>): Promise<ProductShape> => {
  try {
    const res = await api.post('/api/definitions/product-shapes', data);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "建立產品形狀失敗");
    throw err;
  }
};

export interface ProductFunction { id: number; function_code: string; name: string; }
export const getProductFunctions = async (): Promise<ProductFunction[]> => {
  try {
    const res = await api.get('/api/definitions/product-functions');
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "取得產品功能失敗");
    throw err;
  }
};
export const createProductFunction = async (data: Omit<ProductFunction, 'id'>): Promise<ProductFunction> => {
  try {
    const res = await api.post('/api/definitions/product-functions', data);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "建立產品功能失敗");
    throw err;
  }
};

export interface ProductSpecification { id: number; spec_code: string; name: string; parent_id: number | null; }
export const getProductSpecifications = async (): Promise<ProductSpecification[]> => {
  try {
    const res = await api.get('/api/definitions/product-specifications');
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "取得產品規格失敗");
    throw err;
  }
};
export const createProductSpecification = async (data: Omit<ProductSpecification, 'id'>): Promise<ProductSpecification> => {
  try {
    const res = await api.post('/api/definitions/product-specifications', data);
    return res.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.error || "建立產品規格失敗");
    throw err;
  }
};

