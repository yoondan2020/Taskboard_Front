// src/shared/lib/api.ts
import axios from "axios";
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    withCredentials: true, // 세션/쿠키 쓰면 유지
});
api.interceptors.response.use(
    (r) => r,
    (err) => {
        // 401 공통 처리 포인트
        if (err?.response?.status === 401) {
            console.warn("[API] 401 unauthorized");
        }
        return Promise.reject(err);
    }
);