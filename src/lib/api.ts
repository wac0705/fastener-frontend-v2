// src/lib/api.ts

import { fetchWithAuth } from './fetchWithAuth';
import { Company } from '@/models/company';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// --- Define all data models based on backend and frontend usage ---
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

// Add the missing type alias to fix the build error
export type CustomerListItem = Customer;

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
}

export interface CustomerTradeTerm {
  id: number;
  customer_id: number;
  payment_type: string;
  delivery_type: string;
  currency: string;
  notes: string;
}

// === Company Functions ===
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

// === Customer Functions ===
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

// === Product Category Functions ===
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

// === Customer Trade Terms Functions ===
export async function getCustomerTradeTerms(customerId: string | number): Promise<CustomerTradeTerm[]> {
    const response = await fetchWithAuth(`${API_URL}/customers/${customerId}/tradeterms`);
    if (!response.ok) { throw new Error('Failed to fetch customer trade terms'); }
    return response.json();
}
