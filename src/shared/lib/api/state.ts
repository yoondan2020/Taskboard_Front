//shared/lib/api/state.ts
import { request } from "./client";
import type { 
    StateCreate, StateOut, StateUpdate 
} from "@/shared/types/state.type";

const BASE = "/states";

export const stateApi = {
    // Create
    create: (payload: StateCreate) =>
        request<StateOut>(BASE, { method: "POST", body: payload }),

    //Read
    listActive: () => request<StateOut[]>(BASE),
    listAll: () => request<StateOut[]>(`${BASE}/all`),

    //Update
    update: (id: number, payload: StateUpdate) =>
        request<StateOut>(`${BASE}/${id}`, { method: "PATCH", body: payload }),
    restore: (id: number) =>
        request<StateOut>(`${BASE}/${id}/restore`, { method: "POST" }),

    // Soft Delete
    deactivate: (id: number) => request<void>(`${BASE}/${id}`, { method: "DELETE" }),
}