//shared/lib/api/stage.ts
import { request } from "./client";
import type { 
    StageCreate , StageOut, StageUpdate
} from "@/shared/types/stage.types";

const BASE = "/stages";

export const stageApi = {
    // Create
    create: (payload: StageCreate) =>
        request<StageOut>(BASE, { method: "POST", body: payload }),

    //Read
    listActive: () => request<StageOut[]>(BASE),
    listAll: () => request<StageOut[]>(`${BASE}/all`),

    //Update
    update: (id: number, payload: StageUpdate) =>
        request<StageOut>(`${BASE}/${id}`, { method: "PATCH", body: payload }),
    restore: (id: number) =>
        request<StageOut>(`${BASE}/${id}/restore`, { method: "POST" }),

    // Soft Delete
    deactivate: (id: number) => request<void>(`${BASE}/${id}`, { method: "DELETE" }),
}