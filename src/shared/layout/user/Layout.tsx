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
        <div className="h-screen min-w-[1280px] flex flex-col bg-gray-100">
            {/* 헤더 */}
            <header className="shrink-0 bg-white border-b border-black/5">
                <Header />
            </header>
            {/* 메인 */}
            <main className="flex-1 overflow-hidden">
                <div className="h-full max-w-[1920px] mx-auto px-6 py-6 flex gap-6">
                    {/* 사이드 메뉴 */}
                    <aside className="w-[320px] shrink-0 overflow-y-auto custom-scrollbar pr-1">
                        <SideMenu projectCount={projectCount} urgentProjectCount={urgentProjectCount} />
                    </aside>

                    {/* 본문 */}
                    <section className="flex-1 min-w-0 flex flex-col gap-4 overflow-hidden">
                        <SearchBox />
                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                            <Outlet />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
