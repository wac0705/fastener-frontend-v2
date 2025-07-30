// src/lib/api.ts
import { fetchWithAuth } from "./fetchWithAuth";
import { toast } from "sonner";

/* ========================= 公司 Company ========================= */
export interface Company {
  id: number;
  name: string;
  parent_id: number | null;
  currency: string;
  language: string;
  created_at: string;
  updated_at: string;
  children?: Company[];
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/companies`);
    if (!res.ok) throw new Error("取得公司清單失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "取得公司清單失敗");
    throw err;
  }
};
export const createCompany = async (data: { name: string; parent_id: number | null; currency: string; language: string }): Promise<Company> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/companies`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("公司建立失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "公司建立失敗");
    throw err;
  }
};
export const updateCompany = async (
  id: number,
  data: { name: string; parent_id: number | null; currency: string; language: string }
): Promise<{ message: string }> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("公司更新失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "公司更新失敗");
    throw err;
  }
};
export const deleteCompany = async (id: number): Promise<{ message: string }> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/companies/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("公司刪除失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "公司刪除失敗");
    throw err;
  }
};

/* ========================= 客戶 Customer ========================= */
export interface CustomerTransactionTerm {
  id: number;
  customer_id: number;
  company_id: number;
  incoterm: string;
  currency_code: string;
  commission_rate: number | null;
  export_port: string;
  destination_country: string;
  is_primary: boolean;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  group_customer_code: string;
  group_customer_name: string;
  remarks: string;
  created_at: string;
  updated_at: string;
  transaction_terms: CustomerTransactionTerm[];
}
export type CustomerListItem = Omit<Customer, "transaction_terms">;

export const getCustomers = async (): Promise<CustomerListItem[]> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/customers`);
    if (!res.ok) throw new Error("取得客戶清單失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "取得客戶清單失敗");
    throw err;
  }
};

export const getCustomerById = async (id: string | number): Promise<Customer> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/customers/${id}`);
    if (!res.ok) throw new Error("取得客戶資料失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "取得客戶資料失敗");
    throw err;
  }
};

export const getCustomerByCode = async (code: string): Promise<Customer> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/customers/code/${code}`);
    if (!res.ok) throw new Error("取得客戶資料失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "取得客戶資料失敗");
    throw err;
  }
};

export const createCustomer = async (
  data: Omit<Customer, "id" | "created_at" | "updated_at" | "transaction_terms">
): Promise<Customer> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/customers`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("建立客戶失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "建立客戶失敗");
    throw err;
  }
};
export const updateCustomer = async (
  id: string | number,
  data: Omit<Customer, "id" | "created_at" | "updated_at" | "transaction_terms">
): Promise<Customer> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("更新客戶失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "更新客戶失敗");
    throw err;
  }
};
export const deleteCustomer = async (id: string | number): Promise<{ success: true }> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/customers/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("刪除客戶失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "刪除客戶失敗");
    throw err;
  }
};

/* ===== 客戶交易條件 Customer Transaction Terms ===== */
export const getCustomerTradeTerms = async (customerId: string | number): Promise<CustomerTransactionTerm[]> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/customers/${customerId}/transaction-terms`);
    if (!res.ok) throw new Error("取得交易條件失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "取得交易條件失敗");
    throw err;
  }
};
export const createCustomerTradeTerm = async (
  customerId: string | number,
  data: Omit<CustomerTransactionTerm, "id" | "customer_id" | "created_at" | "updated_at" | "is_primary">
): Promise<CustomerTransactionTerm> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/customers/${customerId}/transaction-terms`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("新增交易條件失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "新增交易條件失敗");
    throw err;
  }
};
export const updateCustomerTradeTerm = async (
  id: string | number,
  data: Omit<CustomerTransactionTerm, "id" | "customer_id" | "created_at" | "updated_at" | "is_primary">
): Promise<CustomerTransactionTerm> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/transaction-terms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("更新交易條件失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "更新交易條件失敗");
    throw err;
  }
};
export const deleteCustomerTradeTerm = async (id: string | number): Promise<{ success: true }> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/transaction-terms/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("刪除交易條件失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "刪除交易條件失敗");
    throw err;
  }
};
export const setPrimaryTradeTerm = async (customerId: string | number, id: string | number): Promise<{ success: true }> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/customers/${customerId}/transaction-terms/${id}/set-primary`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("設主交易條件失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "設主交易條件失敗");
    throw err;
  }
};

/* ========================= 產品定義 Product Definitions ========================= */
export interface ProductCategory {
  id: number;
  category_code: string;
  name: string;
}
export const getProductCategories = async (): Promise<ProductCategory[]> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/product-categories`);
    if (!res.ok) throw new Error("取得產品分類失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "取得產品分類失敗");
    throw err;
  }
};
export const createProductCategory = async (data: Omit<ProductCategory, "id">): Promise<ProductCategory> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/product-categories`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("建立產品分類失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "建立產品分類失敗");
    throw err;
  }
};
export const updateProductCategory = async (id: number, data: Omit<ProductCategory, "id">): Promise<ProductCategory> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/product-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("更新產品分類失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "更新產品分類失敗");
    throw err;
  }
};
export const deleteProductCategory = async (id: number): Promise<{ success: true }> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/product-categories/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("刪除產品分類失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "刪除產品分類失敗");
    throw err;
  }
};

export interface ProductShape {
  id: number;
  shape_code: string;
  name: string;
}
export const getProductShapes = async (): Promise<ProductShape[]> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/product-shapes`);
    if (!res.ok) throw new Error("取得產品形狀失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "取得產品形狀失敗");
    throw err;
  }
};
export const createProductShape = async (data: Omit<ProductShape, "id">): Promise<ProductShape> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/product-shapes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("建立產品形狀失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "建立產品形狀失敗");
    throw err;
  }
};

export interface ProductFunction {
  id: number;
  function_code: string;
  name: string;
}
export const getProductFunctions = async (): Promise<ProductFunction[]> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/product-functions`);
    if (!res.ok) throw new Error("取得產品功能失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "取得產品功能失敗");
    throw err;
  }
};
export const createProductFunction = async (data: Omit<ProductFunction, "id">): Promise<ProductFunction> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/product-functions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("建立產品功能失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "建立產品功能失敗");
    throw err;
  }
};

export interface ProductSpecification {
  id: number;
  spec_code: string;
  name: string;
  parent_id: number | null;
}
export const getProductSpecifications = async (): Promise<ProductSpecification[]> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/product-specifications`);
    if (!res.ok) throw new Error("取得產品規格失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "取得產品規格失敗");
    throw err;
  }
};
export const createProductSpecification = async (data: Omit<ProductSpecification, "id">): Promise<ProductSpecification> => {
  try {
    const res = await fetchWithAuth(`${apiBase}/api/definitions/product-specifications`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("建立產品規格失敗");
    return await res.json();
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : "建立產品規格失敗");
    throw err;
  }
};
