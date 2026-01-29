// AdminLayout.tsx
import AdminHeader from "./AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {

    return (
        <div className="w-full max-w-[1920px] min-w-[950px] mx-auto">
            {/* 헤더 */}
            <header>
                <AdminHeader />
            </header>
            {/* 메인 */}
            <main>
                <Outlet />
            </main>
        </div >
    );
}
