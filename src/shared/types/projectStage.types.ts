// projectStage.types.ts

export interface CreateProjectStage {
  name: string;
  state_id?: number;     
  
  planned_date?: string;     
  act_date?: string;         
  eta?: string; 

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

  planned_date?: string;     
  act_date?: string;         
  eta?: string;  

  note?: string;
  remark?: string;
}

export interface UpdateProjectStage {
  stage_id?: number;
  state_id?: number;
  
  planned_date?: string;     
  act_date?: string;         

  eta?: string;              
  note?: string;
  remark?: string;

  eta_change_reason?: string;          // 변경 사유
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
  stage_id:number;
  name: string;        // Stage.name 

  // State
  state_id: number;
  state_name: string;

  planned_date?: string;     // ISO date string
  act_date?: string;         // ISO date string
  eta?: string;              // ISO date string
  note?: string;
  remark?: string;
  sequence: number;
}
