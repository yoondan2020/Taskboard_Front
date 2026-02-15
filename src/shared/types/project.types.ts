// src/shared/types/project.types.ts
import type { DetailProjectStage } from "./projectStage.types";

/* =========================
 * Create / Update
 * ========================= */

export type CreateProjectDTO = {
  product_group_id: number;
  title: string;
  thumbnail_url?: string;
  state_id: number;
  owner_id?: number;
  goal_due_date: string | null;
  remark?: string;
};

export type UpdateProjectDTO = {
  id?: number;
  product_group_id?: number;
  title?: string;
  thumbnail_url?: string;
  state_id?: number;
  goal_due_date?: string | null;
  remark?: string;
  owner_id?: number | null;
};

export type ChangeProjectOwnerDTO = {
  owner_id: number | null;
};


/* =========================
 * Summary (Dashboard)
 * ========================= */

/** 프로젝트 단계 요약 (백엔드 ProjectStageSummary 대응) */
export type ProjectStageSummaryDTO = {
  id: number;
  stage_name: string;
  state_name?: string;
  planned_date?: string;
  stage_owner_name?: string;
};

/** 프로젝트 진행률 (백엔드 ProjectProgress 대응) */
export type ProjectProgressDTO = {
  completed: number;
  total: number;
};

/** Dashboard용 프로젝트 요약 */
export type SummaryProjectDTO = {
  id: number;
  title: string;
  thumbnail_url?: string;
  state_id: number;
  state_name?: string;

  owner_id?: number;
  owner_name?: string;

  // 프로젝트 구분
  product_group_id: number;
  product_group_name: string;

  // 현재 진행 중인 단계
  current_stage?: ProjectStageSummaryDTO;

  // 진행률
  progress: ProjectProgressDTO;
};

// 마감 임박 프로젝트
export type urgentProjects = {
  count: number
}


/* =========================
 * Detail
 * ========================= */

export type DetailProject = {
  id: number;
  title: string;
  thumbnail_url?: string;
  goal_due_date?: string;
  remark?: string;

  // 소유자
  owner_id?: number;
  owner_name?: string;

  // 프로젝트 구분
  product_group_id: number;
  product_group_name: string;

  // 프로젝트 상태
  state_id: number;
  state_name: string;

  // 진행률 
  progress: ProjectProgressDTO;

  // 단계 목록
  stages: DetailProjectStage[];
  stage_owner_names: string[];
};


/* =========================
 * 기타 (필요 시 사용)
 * ========================= */

export type ProjectOut = {
  id: number;
  product_group_id: number;
  title: string;
  thumbnail_url?: string;
  state_id: number;
  goal_due_date?: string | null;
  remark?: string;
};
