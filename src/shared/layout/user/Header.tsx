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
        <div className="
            flex w-full content-center items-center justify-between px-3 py-5
            ">
            <div className="
            flex gap-10 items-center
            //border border-gray-300
            ">
                <img src={logo} width={180} alt="KOAS 로고" onClick={() => navigate("/")} className="cursor-pointer" />
                <div className="flex gap-5 items-center">
                    <div
                        className={`${currentPath === "/dashboard" ? "bg-primary text-white" : "bg-white text-gray-800"} 
                        border rounded-full px-4 py-1
                        hover:bg-primary hover:text-white
                        `}
                    >
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="cursor-pointer"
                        >
                            대시보드
                        </button>
                    </div>
                    <div
                        className={`${currentPath === "/meeting" ? "bg-primary text-white" : "bg-white text-gray-800"} 
                        border rounded-full px-4 py-1
                        hover:bg-primary hover:text-white
                        `}
                    >
                        <button
                            onClick={() => navigate("/meeting")}
                            className="cursor-pointer"
                        >
                            회의 자료실
                        </button>
                    </div>
                    <div className={`${currentPath === "/history" ? "bg-primary text-white" : "bg-white text-gray-800"} 
                    border rounded-full px-4 py-1
                    hover:bg-primary hover:text-white
                    `}>
                        <button
                            onClick={() => navigate("/history")}
                            className="cursor-pointer"
                        >
                            프로젝트 변경이력
                        </button>
                    </div>
                </div>
            </div>
            {/* 사용자 정보 */}
            <div className="flex content-center items-center justify-between gap-3">
                <div className="border rounded-full px-4 py-1 text-black bg-white hover:bg-primary hover:text-white border-1 border-black">
                    <button onClick={() => setOpenMyModal(true)}>
                        {me ? `${me.name} 님` : ""}
                    </button>
                </div>
                <div className="w-9 h-9 bg-primary text-white items-center justify-center flex rounded-full cursor-pointer border border-black hover:bg-white hover:text-primary"
                    onClick={() => setOpenNotiModal(true)}>
                    <BellIcon className="w-5 h-5" />
                </div>
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
