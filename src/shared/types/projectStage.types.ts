// projectStage.types.ts

export interface CreateProjectStage {
  name: string;
  state_id?: number;

  due_date?: string;
  eta?: string;
  completed_date?: string;

  stage_owner_id?: number;

  note?: string;
  remark?: string;
}

export interface ProjectStageOut {
  id: number;
  project_id: number;

  stage_id: number;
  state_id?: number;
  sequence: number;

  due_date?: string;
  eta?: string;
  completed_date?: string;

  note?: string;
  remark?: string;
}

export interface UpdateProjectStage {
  name?: string;
  stage_id?: number;
  state_id?: number;

  due_date?: string;
  eta?: string;
  completed_date?: string;

  note?: string;
  remark?: string;

  change_reason?: string;          // 변경 사유
}

export interface ChangeProjectStageOwner {
  stage_owner_id: number | null;
}

export interface DetailProjectStage {
  id: number;                // ProjectStage id
  project_id: number;

  // 담당자
  stage_owner_id?: number;
  stage_owner_name?: string;

  // Stage
  stage_id: number;
  name: string;        // Stage.name 

  // State
  state_id: number;
  state_name: string;

  due_date?: string;
  eta?: string;
  completed_date?: string;

  note?: string;
  remark?: string;
  sequence: number;
}
