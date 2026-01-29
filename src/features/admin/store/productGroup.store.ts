import { create } from "zustand";
import { productGroupApi} from "@/shared/lib/api/productGroup";
import type { ProductGroupOut } from "@/shared/types/productGroup.types";

type Pg = ProductGroupOut;

type State = {
    items: Pg[];
    loading: boolean;
    error: string | null;

    fetchAll: () => Promise<void>;
    fetchActive: () => Promise<void>;
    create: (data: { name: string }) => Promise<void>;
    update: (id: number, data: { name: string }) => Promise<void>;
    deactivate: (id: number) => Promise<void>;
    restore: (id: number) => Promise<void>;
    clearError: () => void;
};

export const useProductGroupStore = create<State>((set) => ({
    items: [],
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    //Create
    create: async (data: { name: string }) => {
        set({ loading: true, error: null });
        try {
            const item = await productGroupApi.create(data);
            set((state) => ({
                items: [...state.items, item],
            }));
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    //Read
    fetchAll: async () => {
        set({ loading: true, error: null });
        try {
            const data = await productGroupApi.listAll();
            set({ items: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    fetchActive: async () => {
            set({ loading: true, error: null });
            try {
                const data = await productGroupApi.listActive();
                set({ items: data });
            } catch (e: any) {
                set({ error: e?.message ?? String(e) });
            } finally {
                set({ loading: false })
            }
        },

    //Update
    update: async (id: number, data: { name: string }) => {
        set({ loading: true, error: null });
        try {
            const item = await productGroupApi.update(id, data);
            set((state) => ({
                items: state.items.map((x) =>
                    x.id === item.id ? item : x
                ),
            }));
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },
    
    restore: async (id) => {
        set({ loading: true, error: null });
        try {
            await productGroupApi.restore(id);
            set((state) => ({
                items: state.items.map((x) =>
                    x.id === id ? { ...x, is_active: true } : x
                ),
            }));
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },
    
    //Delete
    deactivate: async (id) => {
        set({ loading: true, error: null });
        try {
            await productGroupApi.deactivate(id);
            set((state) => ({
                items: state.items.map((x) =>
                    x.id === id ? { ...x, is_active: false } : x
                ),
            }));
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

}));
