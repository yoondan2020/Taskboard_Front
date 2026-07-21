// notification/store/notifiaction.store.ts
import { create } from "zustand";
import { notificationApi } from "@/shared/lib/api/notification";
import type { NotificationOut } from "@/shared/types/notification.types";
import { log } from "@/shared/lib/log";

type No = NotificationOut

type State = {
    items: No[];
    loading: boolean;
    error: string | null;

    fetch: () => Promise<void>;
    // create: 
    // update: 

    clearError: () => void;
}

export const useNotificationStore = create<State>((set) => ({
    items: [],
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    // create

    // read
    fetch: async () => {
        set({ loading: true, error: null });
        try {
            const data = await notificationApi.myNotifications();
            set({ items: data });
            log("[API] fetch", data);
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false })
        }
    },
}))