import { useState, useEffect } from "react";
import "./AdminPage.css";
import SideMenu from "@/shared/layout/admin/SideMenu";
import PlusButton from "@/shared/components/button/PlusButton";
import ProductGroupManage from "@/features/admin/components/ProductGroupManage";
import StageManage from "@/features/admin/components/StageManage";
import StateManage from "@/features/admin/components/StateManage";
import UserManage from "../components/UserManage";
import { PlusModal } from "@/features/admin/components/PlusModal";
import { useProductGroupStore } from "@/features/admin/store/productGroup.store";
import { useStateStore } from "@/features/admin/store/state.store";
import { useStageStore } from "@/features/admin/store/stage.store";
import { ReloadIcon } from "@/shared/components/icons/ReloadIcon";

type MenuKey = "productGroup" | "state" | "stage" | "user";
export default function AdminPage() {

    const [menu, setMenu] = useState<MenuKey>("productGroup");
    const [isModalOpen, setIsModalOpen] = useState(false);

    //새로운 구분/단계/상태 추가
    const createProductGroup = useProductGroupStore((s) => s.create);
    const createState = useStateStore((s) => s.create);
    const createStage = useStageStore((s) => s.create);

    //새로고침
    const fetchProductGroup = useProductGroupStore((s) => s.fetchAll);
    const fetchState = useStateStore((s) => s.fetchAll);
    const fetchStage = useStageStore((s) => s.fetchAll);

    const title =
        menu === "productGroup"
            ? "프로젝트 구분"
            : menu === "state"
                ? "상태 관리"
                : menu === "stage"
                    ? "단계 관리"
                    : "사용자 관리";

    const buttonLabel =
        menu === "productGroup"
            ? "구분"
            : menu === "state"
                ? "상태"
                : menu === "stage"
                    ? "단계"
                    : "사용자";

    const renderMain = () => {
        if (menu === "productGroup") return <ProductGroupManage />;
        if (menu === "state") return <StateManage />;
        if (menu === "stage") return <StageManage />;
        return <div><UserManage /></div>;
    };

    const submitMap: Record<MenuKey, (name: string) => Promise<void>> = {
        productGroup: (name) => createProductGroup({ name }),
        state: (name) => createState({ name }),
        stage: (name) => createStage({ name }),
        user: async () => { },
    };

    const handleSubmit = async (name: string) => {
        await submitMap[menu](name);
        setIsModalOpen(false);
    };

    const fetchMap: Record<MenuKey, () => Promise<void>> = {
        productGroup: fetchProductGroup,
        state: fetchState,
        stage: fetchStage,
        user: async () => { },
    };

    const fetchByMenu = async () => {
        await fetchMap[menu]();
    };

    useEffect(() => {
        fetchByMenu();
    }, [menu]);

    return (
        <div className="admin-page-container">
            <div className="admin-page-side-menu">
                <SideMenu selected={menu} onSelect={setMenu} />
            </div>
            <div className="admin-page-content">
                <div className="admin-page-content-header">
                    <div className="flex gap-5">
                        <h1>{title}</h1>
                        <div onClick={fetchByMenu} className="refreshButton">
                            새로고침 < ReloadIcon />
                        </div>
                    </div>
                    <div>
                        <PlusButton
                            buttonLabel={buttonLabel}
                            onClick={() => setIsModalOpen(true)}
                        />
                    </div>
                </div>
                <div className="admin-page-main-content">
                    {renderMain()}
                </div>
                {isModalOpen && (
                    <PlusModal
                        buttonLabel={buttonLabel}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>

        </div>
    )
} 