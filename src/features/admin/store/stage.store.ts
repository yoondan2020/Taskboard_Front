import { create } from "zustand";
import { stageApi} from "@/shared/lib/api/stage";
import type { StageOut } from "@/shared/types/stage.types";

type So = StageOut;

type State = {
    items: So[];
    loading: boolean;
    error: string | null;

    fetchAll: () => Promise<void>;
    fetchActive: () => Promise<void>;
    create: (data: {name: string}) => Promise<void>;
    update: (id: number, data: {name: string}) => Promise<void>;
    deactivate: (id: number) => Promise<void>;
    restore: (id: number) => Promise<void>;
    clearError: () => void;
}

export const useStageStore = create<State>((set) => ({
    items: [],
    loading: false,
    error: null,

    clearError: () => set({error: null}),
    
    //Create
    create: async (data: {name: string}) => {
        set({loading: true, error: null});
        try{
            const item = await stageApi.create(data);
            set((state)=> ({
                items: [...state.items, item],
            }));
        } catch (e: any) {
            set({error: e?.message ?? String(e)});
        } finally {
            set({ loading: false});
        }
    }, 

    //Read
        fetchAll: async () => {
            set({ loading: true, error: null });
            try {
                const data = await stageApi.listAll();
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
                    const data = await stageApi.listActive();
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
                const item = await stageApi.update(id, data);
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
                await stageApi.restore(id);
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
                await stageApi.deactivate(id);
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

}))