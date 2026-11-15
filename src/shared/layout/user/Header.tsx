import logo from "@/assets/images/logo/logo.png";
import { BellIcon } from "@/shared/components/icons/BellIcon";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MyPageModal from "@/features/user/components/MyPageModal";
import NotificationModal from "@/features/notification/components/NotificationModal";
import { useUserStore } from "@/features/user/store/user.store";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function Header() {

    const navigate = useNavigate();
    const location = useLocation();

    const currentPath = location.pathname;
    const fetchMe = useUserStore((s) => s.fetchMe);
    const me = useUserStore((s) => s.me);
    const logout = useAuthStore((s) => s.logout);

    const [openMyModal, setOpenMyModal] = useState(false);
    const [openNotiModal, setOpenNotiModal] = useState(false);

    useEffect(() => {
        fetchMe();
    }, []);

    return (
        <div className="h-14 px-5 flex items-center justify-between">
            <div className="flex gap-6 items-center">
                <img src={logo} width={180} alt="KOAS 로고" onClick={() => navigate("/")} className="h-7 w-auto cursor-pointer" />
                {/* 내비게이션 — 세그먼트 컨트롤 */}
                <nav className="flex items-center gap-1">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className={`${currentPath === "/dashboard" ? "bg-hover text-gray-900 font-semibold" : "text-gray-600 hover:bg-hover hover:text-gray-900"} h-8 px-3 rounded-md text-sm font-medium cursor-pointer`}
                    >
                        대시보드
                    </button>
                    {/* <button
                        onClick={() => navigate("/meeting")}
                        className={`${currentPath === "/meeting" ? "bg-hover text-gray-900 font-semibold" : "text-gray-600 hover:bg-hover hover:text-gray-900"} h-8 px-3 rounded-md text-sm font-medium cursor-pointer`}
                    >
                        회의 자료실
                    </button> */}
                    <button
                        onClick={() => navigate("/history")}
                        className={`${currentPath === "/history" ? "bg-hover text-gray-900 font-semibold" : "text-gray-600 hover:bg-hover hover:text-gray-900"} h-8 px-3 rounded-md text-sm font-medium cursor-pointer`}
                    >
                        프로젝트 변경이력
                    </button>
                </nav>
            </div>
            {/* 사용자 정보 */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setOpenMyModal(true)}
                    className="h-8 pl-1.5 pr-3 flex items-center gap-2 rounded-md hover:bg-hover cursor-pointer"
                >
                    <span className="size-6 rounded-[4px] bg-tag-brown text-tag-brown-text text-xs font-semibold flex items-center justify-center">
                        {me?.name ? me.name.slice(0, 1) : ""}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{me ? `${me.name} 님` : ""}</span>
                </button>
                <button
                    type="button"
                    aria-label="알림"
                    className="btn-icon"
                    onClick={() => setOpenNotiModal(true)}
                >
                    <BellIcon className="w-5 h-5" />
                </button>
            </div>
            <MyPageModal
                open={openMyModal}
                onClose={() => setOpenMyModal(false)}
                me={me}
                logout={() => logout()}
            />
            <NotificationModal
                open={openNotiModal}
                onClose={() => setOpenNotiModal(false)}
            />
        </div>
    );
}
