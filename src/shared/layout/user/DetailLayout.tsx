// Layout.tsx
import Header from "@/shared/layout/user/Header"
import { Outlet } from "react-router-dom";

export default function DetailLayout() {

    return (
        <div className="min-h-screen min-w-[1280px] bg-gray-100">
            {/* 헤더 */}
            <header className="sticky top-0 z-40 bg-white border-b border-black/5">
                <Header />
            </header>
            {/* 메인 */}
            <main className="max-w-[1920px] mx-auto px-6 py-6">
                <Outlet />
            </main>
        </div>
    );
}