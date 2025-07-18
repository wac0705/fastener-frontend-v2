// fastener-frontend-v2-main/src/lib/api.ts
import { toast } from "sonner";

// 定義 API 的基礎 URL，從環境變數讀取
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// 封裝 fetch 請求，自動處理 token 和錯誤
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as any).Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || `請求失敗，狀態碼: ${response.status}`;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    // 對於 204 No Content (例如刪除成功)，直接回傳成功狀態
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

// --- 公司 (Companies) 相關的 API ---

export interface Company {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getCompanies = (): Promise<Company[]> => {
  return fetchWithAuth("/api/definitions/companies");
};

export const createCompany = (name: string): Promise<Company> => {
  return fetchWithAuth("/api/definitions/companies", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

export const updateCompany = (id: number, name: string): Promise<Company> => {
    return fetchWithAuth(`/api/definitions/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
};

export const deleteCompany = (id: number): Promise<{ success: true }> => {
    return fetchWithAuth(`/api/definitions/companies/${id}`, {
      method: 'DELETE',
    });
};
