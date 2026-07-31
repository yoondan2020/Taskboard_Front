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
    const projectStateInfo = getStateInfo(project?.state_name);

    return (
        <div className="relative flex items-center p-3 bg-white rounded-xl border hover:shadow-md transition-shadow overflow-hidden">
            {/* 좌측 컬러 스트립 */}
            <div className={`absolute left-0 top-0 h-full w-2 border-r ${projectStateInfo.color}`} />

            {/* 내용이 스트립에 붙어보이지 않게 padding-left 확보 */}
            <div className="flex w-full items-center gap-6 pl-3">
                {/* 썸네일 이미지 */}
                <div className="flex-shrink-0 size-22 bg-gray-200 rounded-lg overflow-hidden border">
                    {project.thumbnail_url ? (
                        <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200" />
                    )}
                </div>

                {/* 프로젝트 정보 */}
                <div className="w-1/2 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="text-xl font-bold text-gray-900">{project.title || "-"}</div>
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {project.product_group_name || "-"}
                        </span>
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {project.owner_name || "-"}
                        </span>
                    </div>

                    {/* 진행률 바 */}
                    <div className="space-y-1">
                        <div className="w-full h-2 bg-gray-200 rounded-full border overflow-hidden">
                            <div
                                className="h-full bg-gray-700 transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <div className="text-sm mt-1">
                            {project.progress.completed}/{project.progress.total} 단계 <span className="text-gray-400">({progressPercentage}%)</span>
                        </div>
                    </div>
                </div>


                {/* 우측 정보 */}
                <div className="flex-1 h-full flex items-center justify-center gap-10">
                    <div className="w-px self-stretch bg-gray-300" />
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="text-md font-bold">{project.current_stage?.stage_name || "-"}</div>

                        <div className={`text-center items-center justify-center`}>
                            <div
                                className={`w-24 h-8 px-2 flex items-center justify-center rounded-full border border-black text-xs font-medium text-white ${stateInfo.color}`}
                            >
                                <div>
                                    {stateInfo.label}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-full text-md">{formattedDate || "-"}</div>
                        <div className="w-full text-md">
                            <span className="text-sm text-gray-500">담당자: </span> {project.current_stage?.stage_owner_name || "-"}</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
