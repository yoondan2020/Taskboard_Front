import type { SummaryProjectDTO } from "@/shared/types/project.types";

export interface ProjectFilters {
    q?: string;
    productGroupId?: number;
    stateId?: number;
}

/**
 * 프로젝트 목록을 필터 조건에 따라 필터링하는 함수
 * @param projects - 필터링할 프로젝트 목록
 * @param filters - 필터 조건 (검색어, 제품군, 상태)
 * @returns 필터링된 프로젝트 목록
 */
export function filterProjects(
    projects: SummaryProjectDTO[],
    filters: ProjectFilters
): SummaryProjectDTO[] {
    const q = (filters.q ?? "").trim().toLowerCase();

    return projects.filter((project) => {
        // 검색어 매칭
        const matchQ =
            !q || (project.title ?? "").toLowerCase().includes(q);

        // 제품군 필터링
        const matchProductGroup =
            !filters.productGroupId || 
            project.product_group_id === filters.productGroupId;

        // 상태 필터링
        const matchState =
            !filters.stateId || 
            project.state_id === filters.stateId;

        return matchQ && matchProductGroup && matchState;
    });
}
