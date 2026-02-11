import { useState } from "react";
import Input from "@/shared/components/input/Input";
import Select from "@/shared/components/input/Select";
import Textarea from "@/shared/components/input/Textarea";
import type { StageFromData } from "@/shared/types/stageFromData.types";

interface CreateStageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: StageFromData) => void;
    stateItems: { label: string; value: number }[];
    stageItems: { label: string; value: number }[];
    userItems: { label: string; value: number }[];
}

export default function StageCreateModal({
    isOpen,
    onClose,
    onSave,
    stateItems,
    userItems,
}: CreateStageModalProps) {
    const [formData, setFormData] = useState<StageFromData>({
        state_id: "",
        name: "",
        planned_date: "",
        act_date: "",
        eta: "",
        note: "",
        remark: "",
        eta_change_reason: "",
        stage_owner_id: "",
    });

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white border rounded-2xl px-8 py-5 w-[800px] max-w-full shadow-lg">
                <h2 className="text-xl font-semibold mb-6">새로운 단계 추가</h2>

                <div className="space-y-4">
                    <div className="flex gap-6">
                        <div className="flex-1 space-y-4">
                            {/* 단계 */}
                            <Input
                                label="단계 명"
                                value={formData.name}
                                onChange={(value) => handleChange("name", value)}
                            />

                            {/* 상태 */}
                            <Select
                                label="단계 상태"
                                value={formData.state_id}
                                items={stateItems}
                                onChange={(value) => handleChange("state_id", value)}
                            />
                            <Select
                                label="담당자"
                                value={formData.stage_owner_id}
                                items={userItems}
                                onChange={(value) => handleChange("stage_owner_id", value)}
                            />
                        </div>

                        <div className="flex-1 space-y-4">
                            {/* 실행일 */}
                            <Input
                                label="실행일"
                                type="date"
                                value={formData.act_date}
                                onChange={(value) => handleChange("act_date", value)}
                            />

                            {/* 마감일 */}
                            <Input
                                label="마감일"
                                type="date"
                                value={formData.planned_date}
                                onChange={(value) => handleChange("planned_date", value)}
                            />
                            {/* 예상 완료일 */}
                            <Input
                                label="예상 완료일"
                                type="date"
                                value={formData.eta}
                                onChange={(value) => handleChange("eta", value)}
                            />


                        </div>
                    </div>

                    {/* Note */}
                    <Textarea
                        label="업무 내용"
                        value={formData.note}
                        onChange={(value) => handleChange("note", value)}
                    />

                    {/* Remark */}
                    <Textarea
                        label="비고"
                        value={formData.remark}
                        onChange={(value) => handleChange("remark", value)}
                    />

                    {/* 버튼 */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-1 rounded-full border-2 hover:bg-gray-800 hover:text-white cursor-pointer"
                        >
                            취소
                        </button>
                        <button
                            onClick={() => {
                                onSave(formData);
                                onClose();
                            }}
                            className="px-6 py-1 text-primary rounded-full border-2 border-primary bg-primary text-white hover:bg-primary-dark cursor-pointer"
                        >
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
