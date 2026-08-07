import { create } from "zustand";
import { authApi } from "@/shared/lib/api/auth";
import type { LoginRequest, LoginResponse } from "@/shared/types/auth.types";
import { log } from "@/shared/lib/log";

type AuthUser = LoginResponse["user"];

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;

  // actions
  restore: () => void;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser) => void; // 추가
  setError: (msg: string | null) => void;
};

const TOKEN_KEY = "access_token";

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  loading: false,
  error: null,

  restore: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    set({ token });
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login(payload);
      log("[auth store]", res);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      set({ token: res.access_token, user: res.user, loading: false });
    } catch (e: any) {
      localStorage.removeItem(TOKEN_KEY);
      set({
        token: null,
        user: null,
        loading: false,
        error: e?.message ?? "Login failed",
      });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null, error: null });
  },

  setUser: (user) => set({ user }),

  setError: (msg) => set({ error: msg }),
}));
