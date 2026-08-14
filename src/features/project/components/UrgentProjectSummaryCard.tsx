import type { SummaryProjectDTO } from "@/shared/types/project.types";

interface ProjectCardProps {
    project: SummaryProjectDTO;
}

export default function UrgentProjectSummaryCard({ project }: ProjectCardProps) {

    // state_name → { label, color } 반환
    const getStateInfo = (state_name?: string) => {
        switch (state_name) {
            case "PLANNED":
                return { label: "PLANNED", color: "bg-planned" };
            case "IN_PROGRESS":
                return { label: "IN_PROGRESS", color: "bg-inProgress" };
            case "DELAYED":
                return { label: "DELAYED", color: "bg-delayed" };
            case "DONE":
                return { label: "DONE", color: "bg-completed" };
            default:
                return { label: "-", color: "bg-planned" };
        }
    };

    const stateInfo = getStateInfo(project.current_stage?.state_name);

    return (
        <div className="relative flex items-center p-2 bg-white rounded-xl border border-1 hover:shadow-md transition-shadow overflow-hidden">
            {/* 좌측 컬러 스트립 */}
            <div className={`absolute left-0 top-0 h-full w-2 border-r ${stateInfo.color}`} />

            {/* 내용이 스트립에 붙어보이지 않게 padding-left 확보 */}
            <div className="flex w-full items-center gap-6 pl-2">
                {/* 프로젝트 정보 */}
                <div className="flex-[2] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 text-sm text-gray-900">{project.title || "-"}</div>
                        <div className="flex-1 text-sm font-bold">{project.current_stage?.stage_name || "-"}</div>
                        <div className="flex-1 text-xs">
                            {project.current_stage?.stage_owner_name || "-"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
