//store/state.store.ts
import { create } from "zustand";
import { stateApi} from "@/shared/lib/api/state";
import type { StateOut } from "@/shared/types/state.type";

type So = StateOut;

type State = {
    items: So[];
    loading: boolean;
    error: string | null;

    fetchAll: () => Promise<void>;
    fetchActive: () => Promise<void>;
    create: (data: { name: string }) => Promise<void>;
    update: (id: number, data: {name: string}) => Promise<void>;
    restore: (id: number) => Promise<void>;
    deactivate: (id: number) => Promise<void>;

    clearError: () => void;
}

export const useStateStore = create<State>((set) => ({
    items: [],
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    //Create
    create: async (data:{name: string}) => {
        set({ loading: true, error: null });
        try {
            const item = await stateApi.create(data);
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
            const data = await stateApi.listAll();
            set({ items: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false })
        }
    },

    fetchActive: async () => {
        set({ loading: true, error: null });
        try {
            const data = await stateApi.listActive();
            set({ items: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false })
        }
    },

    //Update
    update: async (id, data:{name: string} ) => {
        set({ loading: true, error: null });
        try {
            const item = await stateApi.update(id, data);
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

    restore: async(id) => {
        set({loading: true, error: null});
        try{
            await stateApi.restore(id);
            set((state) => ({
                items: state.items.map((x) =>
                    x.id === id ? { ...x, is_active: true } : x
                ),
            }));
        } catch (e: any) {
            set({error: e?.message ?? String(e)});
        } finally {
            set({loading: false});
        }
    },

    // Delete
    deactivate: async (id) => {
        set({ loading: true, error: null });
        try {
            await stateApi.deactivate(id);
            set((s) => ({ 
                items: s.items.map((x) => 
                    x.id === id ? { ...x, is_active: false } : x
                ) 
            }));
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false })
        }
    },

}))