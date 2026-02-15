import ProjectCard from "./ProjectCard";
import { useProjectStore } from "../store/project.store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SummaryProjectDTO } from "@/shared/types/project.types";
import "@/features/main/pages/Dashboard.css";

type Props = {
    open: boolean;
    onClose: () => void;
}

export default function UrgentProjectsModal({ open, onClose }: Props) {
    const fetchUrgentProjects = useProjectStore((s) => s.fetchUrgentProjects);
    const urgentProjects = useProjectStore((s) => s.urgentProjects);
    const navigator = useNavigate();

    useEffect(() => {
        if (open) {
            fetchUrgentProjects();
        }
    }, [open, fetchUrgentProjects])

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-5"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[80vh] m-4 flex flex-col px-3"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 - 고정 */}
                <div className="flex justify-between items-center p-5 border-b flex-shrink-0 mb-3">
                    <h2 className="text-xl font-semibold">마감 임박 프로젝트</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                    >
                        ✕
                    </button>
                </div>

                {/* 내용 - 스크롤 영역 */}
                <div className="overflow-y-auto custom-scrollbar p-4">
                    {urgentProjects.length < 1 ? (
                        <div className="flex items-center justify-center min-h-[200px] text-gray-500">
                            마감 임박 프로젝트가 없습니다.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {urgentProjects.map((project: SummaryProjectDTO) => (
                                <div
                                    key={project.id}
                                    onClick={() => {
                                        navigator(`/project/${project.id}`);
                                        onClose();
                                    }}
                                    className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <ProjectCard project={project} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}