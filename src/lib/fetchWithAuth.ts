// src/lib/fetchWithAuth.ts
"use client";

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  // 自動加 token header
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    // token過期或無效，清除localStorage，導回登入
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    // 停止後續處理
    throw new Error("未授權，請重新登入。");
  }

  return response;
}
