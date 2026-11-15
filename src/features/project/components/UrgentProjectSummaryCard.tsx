import type { SummaryProjectDTO } from "@/shared/types/project.types";

interface ProjectCardProps {
    project: SummaryProjectDTO;
}

export default function UrgentProjectSummaryCard({ project }: ProjectCardProps) {

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

    return (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition">
            {/* 좌측 컬러 스트립 */}
            <div className={`shrink-0 size-2 rounded-full status-solid ${stateInfo.color}`} />

            {/* 내용이 스트립에 붙어보이지 않게 padding-left 확보 */}
            <div className="flex-1 min-w-0">
                {/* 프로젝트 정보 */}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0 truncate text-sm font-semibold text-gray-900">{project.title || "-"}</div>
                        <div className="shrink-0 max-w-[90px] truncate text-xs text-gray-500">{project.current_stage?.stage_name || "-"}</div>
                        <div className="shrink-0 max-w-[60px] truncate text-xs text-gray-500">
                            {project.current_stage?.stage_owner_name || "-"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
