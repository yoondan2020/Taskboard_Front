import { useEffect, useMemo, useState } from "react";
import Input from "@/shared/components/input/Input";
import Select from "@/shared/components/input/Select";
import Textarea from "@/shared/components/input/Textarea";
import { useProductGroupStore } from "@/features/admin/store/productGroup.store";
import { useStateStore } from "@/features/admin/store/state.store";
import { useProjectStore } from "@/features/project/store/project.store";
import { useUserStore } from "@/features/user/store/user.store";
import type { UpdateProjectDTO } from "@/shared/types/project.types";

type Props = {
    id: number;
    open: boolean;
    onClose: () => void;
};

type FormData = {
    product_group_id: string;
    title: string;
    thumbnail: File | null;
    thumbnail_url: string;
    state_id: string;
    goal_due_date: string;
    owner_id: string;
    remark: string;
};

export default function ProjectUpdateModal({ id, open, onClose }: Props) {
    const fetchProjectGroup = useProductGroupStore((s) => s.fetchActive);
    const fetchState = useStateStore((s) => s.fetchActive);
    const fetchUser = useUserStore((s) => s.fetchActive);

    const productGroups = useProductGroupStore((s) => s.items);
    const states = useStateStore((s) => s.items);
    const users = useUserStore((s) => s.items);

    const updateProject = useProjectStore((s) => s.update);
    const changeOwner = useProjectStore((s) => s.changeOwner);
    const fetchUpdateForm = useProjectStore((s) => s.fetchUpdateForm);
    const updateFormData = useProjectStore((s) => s.updateFormData);

    const [formData, setFormData] = useState<FormData>({
        product_group_id: "",
        title: "",
        thumbnail: null,
        thumbnail_url: "",
        state_id: "",
        goal_due_date: "",
        owner_id: "",
        remark: "",
    });

    useEffect(() => {
        if (!open) return;
        fetchProjectGroup();
        fetchState();
        fetchUser();
        fetchUpdateForm(id);
    }, [open, id, fetchProjectGroup, fetchState, fetchUser, fetchUpdateForm]);

    useEffect(() => {
        if (!updateFormData) return;

        setFormData({
            product_group_id: String(updateFormData.product_group_id ?? ""),
            title: updateFormData.title ?? "",
            thumbnail: null,
            thumbnail_url: updateFormData.thumbnail_url ?? "",
            state_id: String(updateFormData.state_id ?? ""),
            goal_due_date: updateFormData.goal_due_date ?? "",
            owner_id: String(updateFormData.owner_id ?? ""),
            remark: updateFormData.remark ?? "",
        });
    }, [updateFormData]);

    const handleChange = (key: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const productGroupItems = useMemo(
        () => productGroups.map((item) => ({ value: item.id, label: item.name })),
        [productGroups]
    );

    const stateItems = useMemo(
        () => states.map((item) => ({ value: item.id, label: item.name })),
        [states]
    );

    const userItems = useMemo(
        () =>
            users.map((user) => ({
                value: user.id,
                label: user.name,
            })),
        [users]
    );

    // DTO 변환 
    const toUpdateProjectDTO = (data: FormData): UpdateProjectDTO => ({
        id: updateFormData?.id!,
        product_group_id: Number(data.product_group_id),
        title: data.title.trim(),
        thumbnail: data.thumbnail || undefined,
        thumbnail_url: data.thumbnail_url,
        state_id: Number(data.state_id),
        goal_due_date: data.goal_due_date || null,
        remark: data.remark || undefined,
    });

    // 담당자 변경 DTO
    const toUpdateOwnerDTO = (data: FormData) => ({
        owner_id: data.owner_id === "" ? null : Number(data.owner_id),
    });

    const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            thumbnail: file,
        }));
    };

    // 변경 여부 체크
    const ownerChanged =
        String(updateFormData?.owner_id ?? "") !== formData.owner_id;

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative w-[900px] max-h-[80vh] bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="w-full flex items-center justify-between px-6 py-3 text-black border-b">
                    <h1 className="text-xl">프로젝트 수정</h1>
                    <button className="cursor-pointer" onClick={onClose}>✕</button>
                </div>

                <div className="px-10 py-6 flex flex-col gap-5 overflow-y-auto max-h-[65vh]">
                    <div className="flex gap-10">
                        <div className="flex-1 flex flex-col gap-3">
                            <Input
                                label="프로젝트명"
                                placeholder="프로젝트명"
                                value={formData.title}
                                type="text"
                                onChange={(value) => handleChange("title", value)}
                            />
                            <Select
                                label="프로젝트 구분"
                                items={productGroupItems}
                                value={formData.product_group_id}
                                onChange={(value) => handleChange("product_group_id", value)}
                            />
                            <Select
                                label="진행 상태"
                                items={stateItems}
                                value={formData.state_id}
                                onChange={(value) => handleChange("state_id", value)}
                            />
                            <Input
                                label="목표일"
                                type="date"
                                value={formData.goal_due_date}
                                onChange={(value) => handleChange("goal_due_date", value)}
                            />
                        </div>

                        <div className="flex flex-col flex-1">
                            <label className="block mb-2">프로젝트 대표 이미지</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="thumbnail-upload"
                                onChange={handleThumbnailChange}
                            />
                            <div
                                className="flex flex-1 items-center justify-center border-1 
                                        border-black rounded-lg text-gray-400 mb-3 cursor-pointer"
                                onClick={() => document.getElementById("thumbnail-upload")?.click()}
                            >
                                {formData.thumbnail ? (
                                    <img
                                        src={URL.createObjectURL(formData.thumbnail)}
                                        className="w-full h-full object-cover rounded-lg"
                                        alt="thumbnail"
                                    />
                                ) : formData.thumbnail_url ? (
                                    <img
                                        src={formData.thumbnail_url}
                                        className="w-full h-full object-cover rounded-lg"
                                        alt="thumbnail"
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

                    <Textarea
                        label="프로젝트 개요, 상세 내용, 비고란"
                        value={formData.remark}
                        onChange={(value) => handleChange("remark", value)}
                    />

                    <div className="flex items-center justify-end">
                        <div className="flex gap-2">
                            <button onClick={onClose} className="px-7 py-1 rounded-xl border-1 hover:bg-gray-800 hover:text-white cursor-pointer">
                                취소
                            </button>

                            <button
                                className="px-7 rounded-xl border-1 border-primary text-white bg-primary hover:bg-primary-dark hover:text-white cursor-pointer"
                                onClick={async () => {
                                    if (!updateFormData?.id) return;

                                    const projectId = updateFormData.id;

                                    // 1) 일반 수정
                                    const dto = toUpdateProjectDTO(formData);
                                    await updateProject(projectId, dto);

                                    // 2) 담당자 수정(분리 엔드포인트) — 변경된 경우만
                                    if (ownerChanged) {
                                        await changeOwner(projectId, toUpdateOwnerDTO(formData));
                                    }

                                    onClose();
                                }}
                            >
                                수정
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
