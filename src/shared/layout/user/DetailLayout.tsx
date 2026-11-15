// Layout.tsx
import Header from "@/shared/layout/user/Header"
import { Outlet } from "react-router-dom";

export default function DetailLayout() {

    return (
        <div className="min-h-screen min-w-[1280px] bg-white">
            {/* 헤더 */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <Header />
            </header>
            {/* 메인 */}
            <main className="max-w-[1680px] mx-auto px-10 py-8">
                <Outlet />
            </main>
        </div>
    );
}