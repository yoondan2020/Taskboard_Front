import type { SummaryProjectDTO } from "@/shared/types/project.types";

interface ProjectCardProps {
    project: SummaryProjectDTO;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    // 진행률 계산
    const progress_completed = project.progress.completed;
    const progress_total = project.progress.total;
    const progressPercentage =
        progress_total > 0 ? Math.round((progress_completed / progress_total) * 100) : 0;

    // 날짜 포맷팅
    const formattedDate = project.current_stage?.due_date
        ? (() => {
            const d = new Date(project.current_stage.due_date);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}.${m}.${day} 까지`;
        })()
        : "-";

    // state_name → { label, color } 반환
    const getStateInfo = (state_name?: string) => {
        switch (state_name) {
            case "PLANNED":
                return { label: "PLANNED", color: "status-planned" };
            case "IN_PROGRESS":
                return { label: "IN_PROGRESS", color: "status-inProgress" };
            case "DELAYED":
                return { label: "DELAYED", color: "status-delayed" };
            case "DONE":
                return { label: "DONE", color: "status-completed" };
            default:
                return { label: "-", color: "status-planned" };
        }
    };

    const stateInfo = getStateInfo(project.current_stage?.state_name);
    const projectStateInfo = getStateInfo(project?.state_name);

    return (
        <div className="surface-card group flex items-stretch gap-4 p-3 transition hover:bg-gray-50 hover:shadow-md">
            {/* 썸네일 이미지 */}
            <div className="flex-shrink-0 size-[76px] rounded-md bg-callout-gray overflow-hidden">
                {project.thumbnail_url ? (
                    <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                        {project.title ? project.title.slice(0, 1) : ""}
                    </div>
                )}
            </div>

            {/* 프로젝트 정보 */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="truncate text-base font-bold text-gray-900">{project.title || "-"}</div>
                    <span className={`status-badge shrink-0 ${projectStateInfo.color}`}>{projectStateInfo.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="tag bg-tag-orange text-tag-orange-text">{project.product_group_name || "-"}</span>
                    <span className="tag">{project.owner_name || "-"}</span>
                </div>

                {/* 진행률 바 */}
                <div className="flex items-center gap-3 max-w-[480px]">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <div className="shrink-0 text-xs text-gray-600 tabular-nums">
                        {project.progress.completed}/{project.progress.total} 단계 <span className="text-gray-400">({progressPercentage}%)</span>
                    </div>
                </div>
            </div>

            {/* 우측 정보 */}
            <div className="shrink-0 flex items-stretch rounded-md bg-gray-50 border border-gray-200 divide-x divide-gray-200">
                <div className="w-44 px-4 py-2.5 space-y-1.5">
                    <div className="text-xs text-gray-500">현재 단계</div>
                    <div className="truncate text-sm font-semibold text-gray-900">{project.current_stage?.stage_name || "-"}</div>
                    <span className={`status-badge ${stateInfo.color}`}>{stateInfo.label}</span>
                </div>
                <div className="w-40 px-4 py-2.5 space-y-1.5">
                    <div className="text-xs text-gray-500">마감</div>
                    <div className="text-sm font-semibold text-gray-900 tabular-nums">{formattedDate || "-"}</div>
                    <div className="truncate text-xs text-gray-500">
                        담당자 <span className="text-gray-900">{project.current_stage?.stage_owner_name || "-"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
