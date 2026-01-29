// Layout.tsx
import Header from "@/shared/layout/user/Header"
import { Outlet } from "react-router-dom";

export default function DetailLayout() {

    return (
        <div className="w-full px-5 max-w-[1920px] min-w-[950px] mx-auto">
            {/* 헤더 */}
            <header>
                <Header />
            </header>
            {/* 메인 */}
            <main className="">
                <div className="">
                    <Outlet />
                </div>
            </main>
        </div >
    );
}