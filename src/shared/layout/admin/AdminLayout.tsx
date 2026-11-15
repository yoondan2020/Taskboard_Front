// AdminLayout.tsx
import AdminHeader from "./AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {

    return (
        <div className="min-h-screen min-w-[1280px] bg-sidebar">
            {/* 헤더 */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <AdminHeader />
            </header>
            {/* 메인 */}
            <main>
                <Outlet />
            </main>
        </div >
    );
}
