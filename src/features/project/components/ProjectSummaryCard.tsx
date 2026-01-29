import type { SummaryProjectDTO } from "@/shared/types/project.types";

interface ProjectCardProps {
    project: SummaryProjectDTO;
}

export default function ProjectSummaryCard({ project }: ProjectCardProps) {

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

    const projectStateInfo = getStateInfo(project?.state_name);

    return (
        <div className="relative flex items-center p-2 bg-white rounded-xl border border-1 hover:shadow-md transition-shadow overflow-hidden">
            {/* 좌측 컬러 스트립 */}
            <div className={`absolute left-0 top-0 h-full w-2 border-r ${projectStateInfo.color}`} />

            {/* 내용이 스트립에 붙어보이지 않게 padding-left 확보 */}
            <div className="flex w-full items-center gap-6 pl-2">
                {/* 썸네일 이미지 */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden border">
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
                <div className="flex-[2] space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-gray-900">{project.title || "-"}</div>
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {project.product_group_name || "-"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
