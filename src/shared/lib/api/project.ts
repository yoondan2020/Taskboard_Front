import { request } from "./client";

import type {
    DetailProject, CreateProjectDTO, ProjectOut, UpdateProjectDTO, SummaryProjectDTO, ChangeProjectOwnerDTO
} from "@/shared/types/project.types";



const BASE = "/project";

export const projectApi = {
    //Crate
    create: (payload: CreateProjectDTO) =>
        request<ProjectOut>(BASE, { method: "POST", body: payload }),

    //Read
    projectList: () => request<SummaryProjectDTO[]>(BASE),

    projectDetail: (id: number) =>
        request<DetailProject>(`${BASE}/${id}`, { method: "GET" }),

    myProjects: () =>
        request<SummaryProjectDTO[]>(`${BASE}/owned`, { method: "GET" }),

    relatedProjects: () =>
        request<SummaryProjectDTO[]>(`${BASE}/related`, { method: "GET" }),

    urgentProjectsCount: () =>
        request<number>(`${BASE}/urgent/count`, { method: "GET" }),

    //Update
    update: (id: number, payload: UpdateProjectDTO) =>
        request<ProjectOut>(`${BASE}/${id}`, { method: "PATCH", body: payload }),

    fetchUpdateForm: (id: number) =>
        request<UpdateProjectDTO>(`${BASE}/${id}/update`, { method: "GET" }),

    changeOwner: (id: number, payload: ChangeProjectOwnerDTO) =>
        request<ProjectOut>(`${BASE}/${id}/owner`, { method: "PATCH", body: payload }),

    //Delete
    delete: (id: number) => request<void>(`${BASE}/${id}`, { method: "DELETE" }),
}
