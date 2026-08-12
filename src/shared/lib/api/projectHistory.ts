// src/shared/lib/api/projectHistory.ts

import { request } from "./client";

import type {
  CreateProjectHistory,
  ProjectHistoryOut,
} from "@/shared/types/project_history.types";

const BASE = (
  projectId: number,
) => `/project/${projectId}/history`;

export const projectHistoryApi = {
  // Create
  create: (projectId: number, payload: CreateProjectHistory) =>
    request<ProjectHistoryOut>(`${BASE(projectId)}`, {
      method: "POST",
      body: payload,
    }),

  // Read
  list: (
    projectId: number,
    projectStageId?: number,
    eventType?: string,
    eventRange?: string,
  ) => {
    const params = new URLSearchParams();
    if (projectStageId !== undefined) {
      params.append("project_stage_id", projectStageId.toString());
    }
    if (eventType) {
      params.append("event_type", eventType);
    }
    if (eventRange) {
      params.append("event_range", eventRange);
    }
    const query = params.toString();
    const url = query ? `${BASE(projectId)}?${query}` : `${BASE(projectId)}`;
    return request<ProjectHistoryOut[]>(url);
  },

  get: (projectId: number, historyId: number) =>
    request<ProjectHistoryOut>(`${BASE(projectId)}/${historyId}`),
};