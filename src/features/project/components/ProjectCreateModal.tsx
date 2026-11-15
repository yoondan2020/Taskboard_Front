import { useEffect, useState } from "react";
import Input from "@/shared/components/input/Input";
import Select from "@/shared/components/input/Select";
import Textarea from "@/shared/components/input/Textarea";
import { useProductGroupStore } from "@/features/admin/store/productGroup.store";
import { useStateStore } from "@/features/admin/store/state.store";
import { useProjectStore } from "@/features/project/store/project.store";
import { useStageStore } from "@/features/admin/store/stage.store";
import { useUserStore } from "@/features/user/store/user.store";
import { type CreateProjectDTO } from "@/shared/types/project.types";
import { type ProjectFormData } from "@/shared/types/projectFormData.types";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function ProjectCreateModal({ open, onClose }: Props) {
    if (!open) return null;

    const fetchProjectGroup = useProductGroupStore((s) => s.fetchActive);
    const fetchState = useStateStore((s) => s.fetchActive);
    const fetchStage = useStageStore((s) => s.fetchActive);
    const fetchUsers = useUserStore((s) => s.fetchActive);
    const productGroups = useProductGroupStore((s) => s.items);
    const states = useStateStore((s) => s.items);
    const users = useUserStore((s) => s.items);
    const create = useProjectStore((s) => s.create);

    const productGroupItems = productGroups.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    const stateItems = states.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    const userItems = users.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.position})`
    }));

    // 폼 데이터
    const [formData, setFormData] = useState<ProjectFormData>({
        product_group_id: "",
        title: "",
        state_id: "",
        owner_id: "",
        goal_due_date: "",
        remark: "",
    });

    const handleChange = (key: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // DTO 변환
    const toCreateProjectDTO = (formData: ProjectFormData): CreateProjectDTO => {
        return {
            product_group_id: Number(formData.product_group_id),
            title: formData.title.trim(),
            state_id: Number(formData.state_id),
            owner_id: formData.owner_id ? Number(formData.owner_id) : undefined,
            goal_due_date: formData.goal_due_date || null,
            remark: formData.remark || undefined,
        };
    };

    // 썸네일
    const handleThumbnailChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            thumbnail: file,
        }));
    };

    useEffect(() => {
        fetchProjectGroup();
        fetchState();
        fetchStage();
        fetchUsers();
    }, [fetchProjectGroup, fetchState, fetchStage, fetchUsers]);

    // 생성 버튼 클릭 핸들러
    const handleCreate = async () => {
        // 필수값 검증
        if (!formData.title.trim()) {
            alert("프로젝트명을 입력하세요");
            return;
        }
        if (!formData.product_group_id) {
            alert("프로젝트 구분을 선택하세요");
            return;
        }
        if (!formData.state_id) {
            alert("진행 상태를 선택하세요");
            return;
        }

        const dto = toCreateProjectDTO(formData);
        await create({
            dto,
            thumbnail: formData.thumbnail,
        });

        onClose();
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* dim */}
                <div className="modal-overlay" onClick={onClose} />

                {/* modal */}
                <div className="modal-panel w-[720px] max-w-[92vw] max-h-[88vh] flex flex-col overflow-hidden">
                    {/* header */}
                    <div className="w-full flex items-center justify-between px-7 pt-6 pb-4">
                        <h1 className="modal-title">새 프로젝트 생성</h1>
                        <button className="btn-icon size-8 text-sm text-gray-600" onClick={onClose}>
                            ✕
                        </button>
                    </div>

                    {/* body */}
                    <div className="flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar px-7 pb-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* left */}
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="프로젝트명 *"
                                    placeholder="프로젝트명"
                                    value={formData.title}
                                    type="text"
                                    onChange={(value: string) => handleChange("title", value)}
                                />
                                <Select
                                    label="프로젝트 구분 *"
                                    items={productGroupItems}
                                    value={formData.product_group_id}
                                    onChange={(value: string) =>
                                        handleChange("product_group_id", value)
                                    }
                                />

                                <Select
                                    label="진행 상태 *"
                                    items={stateItems}
                                    value={formData.state_id}
                                    onChange={(value: string) => handleChange("state_id", value)}
                                />
                                <Input
                                    label="목표일"
                                    type="date"
                                    placeholder="YYYY.MM.DD"
                                    value={formData.goal_due_date}
                                    onChange={(value) => handleChange("goal_due_date", value)}
                                />
                            </div>

                            {/* right */}
                            <div className="flex flex-col">
                                <label className="field-label block mb-1.5">
                                    프로젝트 대표 이미지
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="thumbnail-upload"
                                    onChange={handleThumbnailChange}
                                />
                                <div
                                    className="flex flex-1 min-h-[180px] items-center justify-center overflow-hidden rounded-2xl
                                        border-2 border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500 mb-3 cursor-pointer transition hover:border-primary/50 hover:bg-primary/5"
                                    onClick={() =>
                                        document.getElementById("thumbnail-upload")?.click()
                                    }
                                >
                                    {formData.thumbnail instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(formData.thumbnail)}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>클릭 또는 드래그하여 업로드</span>
                                    )}
                                </div>
                                <Select
                                    label="담당자"
                                    items={userItems}
                                    value={formData.owner_id}
                                    onChange={(value) => handleChange("owner_id", value)}
                                />
                            </div>
                        </div>
                        {/* bottom */}
                        <div>
                            <Textarea
                                label="프로젝트 개요, 상세 내용, 비고란"
                                value={formData.remark}
                                onChange={(value) => handleChange("remark", value)}
                            />
                        </div>
                    </div>

                    {/* footer */}
                    <div className="w-full px-7 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/60">
                        <div />

                        <div className="flex gap-2 ">
                            <button
                                onClick={onClose}
                                className="btn-secondary min-w-[88px]"
                            >
                                취소
                            </button>
                            <button
                                className="btn-primary min-w-[88px]"
                                onClick={async () => {
                                    handleCreate();
                                }}
                            >
                                생성
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
