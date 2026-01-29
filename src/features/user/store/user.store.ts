import { create } from "zustand";
import { userApi } from "@/shared/lib/api/user";
import type { Me } from "@/shared/types/user.types";
import { log } from "@/shared/lib/log"; 

type State = {
    items: Me[];
    loading: boolean;
    error: string | null;
    me: Me | null;

    fetchActive: () => Promise<void>;
    fetchMe: () => Promise<void>;
    clearError: () => void;
};

export const useUserStore = create<State>((set) => ({
    items: [],
    loading: false,
    error: null,
    me: null,

    clearError: () => set({ error: null }),

    fetchMe: async () => {
        set({ loading: true, error: null });
        try {
            const data = await userApi.me();
            log("user store - fetchMe", data);
            set({ me: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    fetchActive: async () => {
        set({ loading: true, error: null });
        try {
            const data = await userApi.listActive();
            log("user store - fetchActive", data);
            set({ items: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },
}));
