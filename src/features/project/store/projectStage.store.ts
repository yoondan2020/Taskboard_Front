// src/store/projectStage.store.ts

import { create } from "zustand";
import type {
  CreateProjectStage,
  UpdateProjectStage,
  DetailProjectStage,
} from "@/shared/types/projectStage.types";
import { useProjectStore } from "./project.store";
import { projectStageApi } from "@/shared/lib/api/projectStage";
import { log } from "@/shared/lib/log";

type State = {
  items: DetailProjectStage[];
  loading: boolean;
  error: string | null;

  create: (projectId: number, data: CreateProjectStage) => Promise<void>;
  fetchDetail: (projectId: number, stageId: number) => Promise<void>;
  update: (
    projectId: number,
    stageId: number,
    data: UpdateProjectStage
  ) => Promise<void>;
  changeOwner: (
    projectId: number,
    stageId: number,
    ownerId: number | null
  ) => Promise<void>;
  delete: (projectId: number, stageId: number) => Promise<void>;

  clearError: () => void;
};

export const useProjectStageStore = create<State>((set) => ({
  items: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  create: async (projectId, data) => {
    set({ loading: true, error: null });
    try {
      await projectStageApi.create(projectId, data);
      log("[API] create", data);
      await useProjectStore.getState().fetchDetail(projectId);
    } catch (e: any) {
      set({ error: e.message ?? "create failed" });
    } finally {
      set({ loading: false });
    }
  },


  fetchDetail: async (projectId, stageId) => {
    set({ loading: true, error: null });
    try {
        const detail = await projectStageApi.projectStageDetail(
            projectId,
            stageId
        );

        set((state) => ({
            items: [
            ...state.items.filter((item) => item.id !== stageId),
            detail,
            ],
        }));
        log("[API] fetchDetasil", detail);
    } catch (e: any) {
        set({ error: e.message ?? "Fetch failed" });
    } finally {
        set({ loading: false });
    }
  },

  update: async (projectId, stageId, data) => {
    set({ loading: true, error: null });
    try {
      log("[API] update", data);
        await projectStageApi.update(projectId, stageId, data);
        await useProjectStore.getState().fetchDetail(projectId);
    } catch (e: any) {
        set({ error: e.message ?? "Update failed" });
    } finally {
        set({ loading: false });
    }
  },
  
  changeOwner: async (projectId, stageId, ownerId) => {
    set({ loading: true, error: null });
    try {
      log("[API] changeOwner", ownerId);
        await projectStageApi.changeOwner(projectId, stageId, {
            stage_owner_id: ownerId,
        });
        await useProjectStore.getState().fetchDetail(projectId);
    } catch (e: any) {
        set({ error: e.message ?? "Change owner failed" });
    } finally {
        set({ loading: false });
    }
  },

  delete: async (projectId, stageId) => {
    set({ loading: true, error: null });
    try {
      log("[API] delete projectId/stageId", projectId, stageId);
        await projectStageApi.delete(projectId, stageId);
        await useProjectStore.getState().fetchDetail(projectId);
    } catch (e: any) {
        set({ error: e.message ?? "Delete failed" });
    } finally {
        set({ loading: false });
    }
  },
}));
