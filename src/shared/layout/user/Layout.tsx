// Layout.tsx
import Header from "@/shared/layout/user/Header";
import { Outlet } from "react-router-dom";
import SideMenu from "./SideMenu";
import SearchBox from "@/shared/components/input/SearchBox";
import { useProjectStore } from "@/features/project/store/project.store";
import { useEffect } from "react";

export default function Layout() {
    const fetchProjectSummary = useProjectStore((s) => s.fetchProjectSummary);
    const fetchUrgentProjectsCount = useProjectStore((s) => s.fetchUrgentProjectsCount)
    const projectList = useProjectStore((s) => s.projectSummary);
    const projectCount = projectList.length;
    const urgentProjectCount = useProjectStore((s) => s.urgentProjectsCount)

    useEffect(() => {
        fetchProjectSummary();
        fetchUrgentProjectsCount();
    }, [fetchProjectSummary, fetchUrgentProjectsCount])

    return (
        <div className="h-screen min-w-[1280px] flex flex-col bg-white">
            {/* 헤더 */}
            <header className="shrink-0 bg-white border-b border-gray-200">
                <Header />
            </header>
            {/* 메인 */}
            <main className="flex-1 flex overflow-hidden">
                {/* 사이드 메뉴 — Notion 사이드바 */}
                <aside className="w-[300px] shrink-0 bg-sidebar border-r border-gray-200 overflow-y-auto custom-scrollbar">
                    <SideMenu projectCount={projectCount} urgentProjectCount={urgentProjectCount} />
                </aside>

                {/* 본문 */}
                <section className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white">
                    <div className="px-10 pt-6 pb-4">
                        <SearchBox />
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-10">
                        <Outlet />
                    </div>
                </section>
            </main>
        </div>
    );
}
