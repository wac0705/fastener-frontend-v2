// utils/axios.js
import api from "@/utils/axios";

// 建立 axios 實例（共用設定）
const instance = axios.create({
  baseURL: "https://fastener-api.zeabur.app",  // 這裡根據你的後端 API 網域設定
  headers: {
    "Content-Type": "application/json"
  }
});

// 自動加上 JWT token 到 header
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
