import { request } from "./client";

import type {
    DetailProject, CreateProjectDTO, ProjectOut, UpdateProjectDTO, SummaryProjectDTO, ChangeProjectOwnerDTO
} from "@/shared/types/project.types";



const BASE = "/project";

export const projectApi = {
    //Create
    create: (
        payload: CreateProjectDTO,
        thumbnail?: File
    ) => {
        const formData = new FormData();

        formData.append(
            "payload",
            JSON.stringify(payload)
        );

        if (thumbnail) {
            formData.append(
                "thumbnail",
                thumbnail
            );
        }

        return request<ProjectOut>(BASE, {
            method: "POST",
            body: formData,
        });
    },

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

    urgentProjects: () =>
        request<SummaryProjectDTO[]>(`${BASE}/urgent`, { method: "GET" }),

    // 특정 날짜 마감 프로젝트
    deadlineProjects: (date: string): Promise<SummaryProjectDTO[]> =>
        request<SummaryProjectDTO[]>(`${BASE}/deadline?date=${date}`, { method: "GET" }),

    //Update
    update: (id: number, payload: UpdateProjectDTO, thumbnail?: File) => {
        const formData = new FormData();

        formData.append(
            "payload",
            JSON.stringify(payload)
        );

        if (thumbnail) {
            formData.append(
                "thumbnail",
                thumbnail
            );
        }
        return request<ProjectOut>(`${BASE}/${id}`, { method: "PATCH", body: formData });
    },

    fetchUpdateForm: (id: number) =>
        request<UpdateProjectDTO>(`${BASE}/${id}/update`, { method: "GET" }),

    changeOwner: (id: number, payload: ChangeProjectOwnerDTO) =>
        request<ProjectOut>(`${BASE}/${id}/owner`, { method: "PATCH", body: payload }),

    //Delete
    delete: (id: number) => request<void>(`${BASE}/${id}`, { method: "DELETE" }),
}
