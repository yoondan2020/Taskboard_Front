// src/features/main/store/projectHistory.store.ts
import { create } from "zustand";
import { projectHistoryApi } from "@/shared/lib/api/projectHistory";
import type {
  CreateProjectHistory,
  ProjectHistoryOut,
  ProjectHistoryEventType,
} from "@/shared/types/project_history.types";
import { log } from "@/shared/lib/log";

type State = {
  items: ProjectHistoryOut[];
  loading: boolean;
  error: string | null;

  create: (projectId: number, data: CreateProjectHistory) => Promise<void>;
  fetchList: (
    projectId: number,
    projectStageId?: number,
    eventType?: ProjectHistoryEventType
  ) => Promise<void>;
  fetchOne: (projectId: number, historyId: number) => Promise<void>;

  clearError: () => void;
};

export const useProjectHistoryStore = create<State>((set) => ({
  items: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  create: async (projectId, data) => {
    log("[API] createProjectHistory payload:", data);
    set({ loading: true, error: null });
    try {
      const newHistory = await projectHistoryApi.create(projectId, data);
      set((state) => ({
        items: [newHistory, ...state.items],
      }));
    } catch (e: any) {
      set({ error: e?.message ?? String(e) });
    } finally {
      set({ loading: false });
    }
  },

  fetchList: async (projectId, projectStageId, eventType) => {
    set({ loading: true, error: null });
    try {
      const data = await projectHistoryApi.list(projectId, projectStageId, eventType);
      log("[API] fetch project history list", data);
      set({ items: data });
    } catch (e: any) {
      set({ error: e?.message ?? String(e) });
    } finally {
      set({ loading: false });
    }
  },

  fetchOne: async (projectId, historyId) => {
    set({ loading: true, error: null });
    try {
      const data = await projectHistoryApi.get(projectId, historyId);
      log("[API] fetch project history one", data);
      // Optionally update the list if needed
      set((state) => ({
        items: state.items.map((item) =>
          item.id === historyId ? data : item
        ),
      }));
    } catch (e: any) {
      set({ error: e?.message ?? String(e) });
    } finally {
      set({ loading: false });
    }
  },
}));