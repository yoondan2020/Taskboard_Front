import {request} from "./client";

import type { 
    CreateProjectStage, UpdateProjectStage, DetailProjectStage, ProjectStageOut, ChangeProjectStageOwner
} from "@/shared/types/projectStage.types";

const BASE = (projectId:number)=> { 
    return `/project/${projectId}/stages`; 
}

export const projectStageApi = {
    // Create
    create: (projectId: number, payload: CreateProjectStage) => 
        request<ProjectStageOut>( BASE(projectId), {method: "POST", body: payload}),

    // Read
    projectStageList: (projectId: number) =>
        request<ProjectStageOut>(BASE(projectId), {method:"GET"}),

    projectStageDetail: (projectId: number, stageId: number) =>
        request<DetailProjectStage>(`${BASE(projectId)}/${stageId}`, {method:"GET"}),

    // Update
    update: (projectId: number, stageId: number, payload: UpdateProjectStage) => 
        request<ProjectStageOut>( `${BASE(projectId)}/${stageId}`, {method: "PATCH", body: payload}),

    changeOwner: (
        projectId: number,
        stageId: number,
        payload: ChangeProjectStageOwner
    ) =>
        request(
            `${BASE(projectId)}/${stageId}/owner`,
            {
                method: "PATCH",
                body: payload,
            }
        ),

    // Delete
    delete: (projectId: number, stageId: number) => 
        request<ProjectStageOut>( `${BASE(projectId)}/${stageId}`, {method: "DELETE"}),

}