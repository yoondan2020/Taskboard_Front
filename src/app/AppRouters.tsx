// AppRoutes.tsx
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import AdminLayout from "@/shared/layout/admin/AdminLayout";
import AdminPage from "@/features/admin/pages/AdminPage";
import Layout from "@/shared/layout/user/Layout";
import Dashboard from "@/features/main/pages/Dashboard";
import Meeting from "@/features/main/pages/Meeting";
import History from "@/features/main/pages/History";
import ProjectDetailPage from "@/features/project/pages/[id]";
import DetailLayout from "@/shared/layout/user/DetailLayout";
import LoginPage from "@/features/auth/pages/LoginPage";

interface ProtectedLayoutProps {
    children: ReactNode;
}

function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}