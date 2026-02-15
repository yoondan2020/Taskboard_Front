// Layout.tsx
import Header from "@/shared/layout/user/Header";
import { Outlet } from "react-router-dom";
import SideMenu from "./SideMenu";
import SearchBox from "@/shared/components/input/SearchBox";
import { useProjectStore } from "@/features/project/store/project.store";
import { useEffect } from "react";

export default function Layout() {
    const fetchProjectSummary = useProjectStore((s) => s.fetchProjectSummary);
    const fetchUrgentProject = useProjectStore((s) => s.fetchUrgentProject)
    const projectList = useProjectStore((s) => s.projectSummary);
    const projectCount = projectList.length;
    const urgentProjectCount = useProjectStore((s) => s.urgentProjectsCount)
    console.log('Layout urgentProjectCount:', urgentProjectCount);

    useEffect(() => {
        fetchProjectSummary();
        fetchUrgentProject();
    }, [fetchProjectSummary, fetchUrgentProject])

    return (
        <div className="w-full px-5 pb-2 max-w-[1920px] min-w-[1500px] mx-auto space-y-3 h-screen flex flex-col">
            {/* 헤더 */}
            <header className="">
                <Header />
            </header>
            {/* 메인 */}
            <main className="flex flex-col border rounded-xl flex-1 overflow-hidden">
                <div className="border-b flex items-center justify-center">
                    <SearchBox />
                </div>

                <div className="flex gap-5 flex-1 overflow-hidden">
                    <div className="flex-[1] border-r items-center justify-center">
                        <SideMenu projectCount={projectCount} urgentProjectCount={urgentProjectCount} />
                    </div>
                    <div className="flex-[4] py-5 pr-5 overflow-y-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div >
    );
}
