import type { SummaryProjectDTO } from "@/shared/types/project.types";

interface ProjectCardProps {
    project: SummaryProjectDTO;
}

export default function ProjectSummaryCard({ project }: ProjectCardProps) {

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

    const projectStateInfo = getStateInfo(project?.state_name);

    return (
        <div className="surface-card flex items-center gap-3 p-2.5 transition hover:bg-gray-50">
            {/* 썸네일 이미지 */}
            <div className="flex-shrink-0 size-11 rounded-md bg-callout-gray overflow-hidden">
                {project.thumbnail_url ? (
                    <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-400">
                        {project.title ? project.title.slice(0, 1) : ""}
                    </div>
                )}
            </div>

            {/* 프로젝트 정보 */}
            <div className="flex-1 min-w-0 flex items-center gap-2">
                <div className="truncate text-sm font-semibold text-gray-900">{project.title || "-"}</div>
                <span className="tag bg-tag-orange text-tag-orange-text">{project.product_group_name || "-"}</span>
            </div>
            <span className={`status-badge shrink-0 ${projectStateInfo.color}`}>{projectStateInfo.label}</span>
        </div>
    );
}
