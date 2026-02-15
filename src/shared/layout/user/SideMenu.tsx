import PlusButton from "@/shared/components/button/PlusButton"
import { useState } from "react"
import ProjectCreateModal from "@/features/project/components/ProjectCreateModal";
import InsightCard from "@/features/project/components/InsightCard";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './Calender.css'

type Props = {
    projectCount: number;
    urgentProjectCount: number;
}

export default function SideMenu({ projectCount, urgentProjectCount }: Props) {

    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    //const [date, setDate] = useState(new Date());

    return (
        <div className="w-full">
            {/* 프로젝트 관리 */}
            <div className="space-y-3 border-b border-gray-200 p-3">
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
            <div className="space-y-3 py-4 px-4">
                <div className="font-semibold">
                    통계 / 일정
                </div>
                <div>
                    <InsightCard
                        label={"총 프로젝트"}
                        value={projectCount}
                    />
                </div>
                <div>
                    <InsightCard
                        label={"마감 임박 프로젝트"}
                        value={urgentProjectCount}
                    />
                </div>
                {/* 캘린더 */}
                <div className="mt-3">
                    <Calendar
                        className="react-calendar"
                        formatDay={(locale, date) => date.getDate().toString()}
                    />
                </div>
            </div>
        </div>
    )
}