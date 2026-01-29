import { request } from "./client";
import type { 
    ProductGroupCreate, ProductGroupOut, ProductGroupUpdate
 } from "@/shared/types/productGroup.types";

const BASE = "/product-group";

export const productGroupApi = {
    //Create
    create: (payload: ProductGroupCreate) =>
        request<ProductGroupOut>(BASE, { method: "POST", body: payload }),

    //Read
    listActive: () => request<ProductGroupOut[]>(BASE),
    listAll: () => request<ProductGroupOut[]>(`${BASE}/all`),

    //Update
    update: (id: number, payload: ProductGroupUpdate) =>
        request<ProductGroupOut>(`${BASE}/${id}`, { method: "PATCH", body: payload }),
    restore: (id: number) =>
        request<ProductGroupOut>(`${BASE}/${id}/restore`, { method: "POST" }),

    //Delete
    deactivate: (id: number) => request<void>(`${BASE}/${id}`, { method: "DELETE" }),
};
