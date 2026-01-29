// src/shared/types/project_history.types.ts

export const PROJECT_HISTORY_EVENT_TYPE = {
  STAGE_CREATED: "STAGE_CREATED",
  STAGE_DELETED: "STAGE_DELETED",
  STAGE_FIELD_CHANGED: "STAGE_FIELD_CHANGED",
  PROJECT_CREATED: "PROJECT_CREATED",
  PROJECT_DELETED: "PROJECT_DELETED",
  PROJECT_FIELD_CHANGED: "PROJECT_FIELD_CHANGED",
} as const;

export type ProjectHistoryEventType =
  typeof PROJECT_HISTORY_EVENT_TYPE[keyof typeof PROJECT_HISTORY_EVENT_TYPE];


export interface CreateProjectHistory {
  project_stage_id?: number;
  event_type: ProjectHistoryEventType;
  field?: string;

  old_value?: string;
  new_value?: string;

  content?: string;
  context?: Record<string, unknown>;
}

export interface ProjectHistoryOut {
  id: number;

  project_id: number;
  project_title: string;
  project_stage_id?: number;

  event_type: ProjectHistoryEventType;
  field?: string;

  old_value?: string;
  new_value?: string;

  content?: string;
  changed_at: string; 

  changed_by_id?: number;
  changed_by_name?: string;

  context?: Record<string, unknown>;
}