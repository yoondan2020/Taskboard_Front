// AppRoutes.tsx
import { useEffect, type ReactNode } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useUserStore } from '@/features/user/store/user.store';
import AdminLayout from "@/shared/layout/admin/AdminLayout";
import AdminPage from "@/features/admin/pages/AdminPage";
import Layout from "@/shared/layout/user/Layout";
import Dashboard from "@/features/main/pages/Dashboard";
import Meeting from "@/features/main/pages/Meeting";
import History from "@/features/main/pages/History";
import ProjectDetailPage from "@/features/project/pages/[id]";
import DetailLayout from "@/shared/layout/user/DetailLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import { log } from "@/shared/lib/log";
import { useLocation } from "react-router-dom";

interface ProtectedLayoutProps {
    children: ReactNode;
}

function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const user = useAuthStore((state) => state.user);
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default function AppRoutes() {
    const user = useAuthStore((state) => state.user);
    const accessToken = localStorage.getItem("access_token");
    const navigation = useNavigate()
    const fetchMe = useUserStore((s) => s.fetchMe);
    const location = useLocation();

    useEffect(() => {
        if (accessToken && !user) {
            fetchMe();
        }
    }, []);

    useEffect(() => {
        if (user && location.pathname === "/") {
            log("user 정보 있음");
            navigation("/dashboard");
        }
    }, [user, location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route element={<ProtectedLayout><Layout /></ProtectedLayout>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/meeting" element={<Meeting />} />
                <Route path="/history" element={<History />} />
            </Route>

            <Route element={<ProtectedLayout><DetailLayout /></ProtectedLayout>}>
                <Route path="/project/:id" element={<ProjectDetailPage />} />
                <Route path="/project/:id/history" element={<History />} />
            </Route>

            <Route element={<ProtectedLayout><AdminLayout /></ProtectedLayout>}>
                <Route path="/admin" element={<AdminPage />} />
            </Route>
        </Routes>
    );
}