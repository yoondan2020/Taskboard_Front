import { request } from "./client";
import type { LoginRequest, LoginResponse } from "@/shared/types/auth.types";

const BASE = "/auth";

export const authApi = {
    login: (payload: LoginRequest) =>
        request<LoginResponse>(`${BASE}/login`, { method: "POST", body: payload }),
};
