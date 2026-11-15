import ProjectCard from "./ProjectCard";
import { useProjectStore } from "../store/project.store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SummaryProjectDTO } from "@/shared/types/project.types";
import '@/shared/lib/styles/Scrollbar.css';

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
            className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-50 px-5"
            onClick={onClose}
        >
            <div
                className="modal-panel max-w-5xl w-full max-h-[84vh] m-4 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 - 고정 */}
                <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100 flex-shrink-0">
                    <h2 className="modal-title">마감 임박 프로젝트</h2>
                    <button
                        onClick={onClose}
                        className="btn-icon size-8 text-sm text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* 내용 - 스크롤 영역 */}
                <div className="overflow-y-auto custom-scrollbar p-6 bg-gray-50">
                    {urgentProjects.length < 1 ? (
                        <div className="flex items-center justify-center min-h-[200px] text-[15px] text-gray-500">
                            마감 임박 프로젝트가 없습니다.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {urgentProjects.map((project: SummaryProjectDTO) => (
                                <div
                                    key={project.id}
                                    onClick={() => {
                                        navigator(`/project/${project.id}`);
                                        onClose();
                                    }}
                                    className="cursor-pointer rounded-[18px]"
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