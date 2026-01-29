import { request } from "./client";
import type { Me } from "@/shared/types/user.types";

const BASE = "/users";

export const userApi = {
    listActive: () => request<Me[]>(`${BASE}/active`),
    me: () => request<Me>(`${BASE}/me`),
};
