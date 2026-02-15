import PlusButton from "@/shared/components/button/PlusButton"
import { useState, useEffect } from "react"
import ProjectCreateModal from "@/features/project/components/ProjectCreateModal";
import UrgentProjectsModal from "@/features/project/components/UrgentProjectsModal";
import UrgentProjectSummaryCard from "@/features/project/components/UrgentProjectSummaryCard";
import InsightCard from "@/features/project/components/InsightCard";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './Calender.css'
import '@/shared/lib/styles/Scrollbar.css'
import { useProjectStore } from "@/features/project/store/project.store";
import { useNavigate } from "react-router-dom";
import type { SummaryProjectDTO } from "@/shared/types/project.types";

type Props = {
    projectCount: number;
    urgentProjectCount: number;
}

export default function SideMenu({ projectCount, urgentProjectCount }: Props) {
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const fetchDeadlineProjects = useProjectStore((s) => s.fetchDeadlineProjects);
    const deadlineProjects = useProjectStore((s) => s.deadlineProjects);
    const navigate = useNavigate();

    // 날짜를 YYYY-MM-DD 형식으로 변환
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 날짜 선택 시 또는 초기 로드 시
    useEffect(() => {
        fetchDeadlineProjects(formatDate(selectedDate));
    }, [selectedDate, fetchDeadlineProjects]);

    const handleDateChange = (value: any) => {
        setSelectedDate(value);
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* 프로젝트 관리 */}
            <div className="space-y-3 border-b border-gray-200 p-3 flex-shrink-0">
                <div className="font-semibold">
                    프로젝트 관리
                </div>
                <PlusButton
                    buttonLabel={"프로젝트"}
                    onClick={() => setIsProjectModalOpen(true)}
                />
                {isProjectModalOpen &&
                    <ProjectCreateModal
                        open={isProjectModalOpen}
                        onClose={() => setIsProjectModalOpen(false)}
                    />}
                <button className="w-full flex gap-1 bg-white text-primary border border-black items-center text-center justify-center px-5 py-2 rounded-xl text-base cursor-pointer">
                    새 연구회의 자료 등록
                </button>
            </div>

            {/* 통계 / 일정 */}
            <div className="py-4 px-4 flex-1 flex flex-col space-y-3 min-h-0">
                <div className="font-semibold flex-shrink-0">
                    통계 / 일정
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <div className="flex-1">
                        <InsightCard
                            label={"총 프로젝트"}
                            value={projectCount}
                            color={"black"}
                        />
                    </div>
                    <div
                        onClick={() => setIsUrgentModalOpen(true)}
                        className="cursor-pointer flex-1"
                    >
                        <InsightCard
                            label={"마감 임박 프로젝트"}
                            value={urgentProjectCount}
                            color={"red"}
                        />
                    </div>
                </div>

                {isUrgentModalOpen && (
                    <UrgentProjectsModal
                        open={isUrgentModalOpen}
                        onClose={() => setIsUrgentModalOpen(false)}
                    />
                )}

                <div className="flex-shrink-0">
                    <Calendar
                        className="react-calendar"
                        formatDay={(locale, date) => date.getDate().toString()}
                        onChange={handleDateChange}
                        value={selectedDate}
                    />
                </div>

                {deadlineProjects.length > 0 && (
                    <div className="flex-1 flex flex-col min-h-0 space-y-2">
                        <div className="text-sm font-semibold text-gray-600 flex-shrink-0">
                            {formatDate(selectedDate)} 마감
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-3 min-h-0">
                            <div className="space-y-2 pb-6">
                                {deadlineProjects.map((project: SummaryProjectDTO) => (
                                    <div
                                        key={project.id}
                                        onClick={() => navigate(`/project/${project.id}`)}
                                        className="cursor-pointer"
                                    >
                                        <UrgentProjectSummaryCard project={project} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}