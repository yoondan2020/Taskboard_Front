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
        due_date: "",
        eta: "",
        completed_date: "",
        note: "",
        remark: "",
        change_reason: "",
        stage_owner_id: "",
    });

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    // 생성 버튼 클릭 핸들러
    const handelCreate = async () => {
        //필수값 검증
        if (!formData.name.trim()) {
            alert("단계명을 입력하세요");
            return;
        }
        onSave(formData);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="modal-panel w-[760px] max-w-[92vw] max-h-[88vh] overflow-y-auto custom-scrollbar px-7 py-6">
                <h2 className="modal-title mb-6">새로운 단계 추가</h2>

                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {/* 단계 */}
                            <Input
                                label="단계 명 *"
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

                        <div className="space-y-4">
                            {/* 마감일 */}
                            <Input
                                label="마감일"
                                type="date"
                                value={formData.due_date}
                                onChange={(value) => handleChange("due_date", value)}
                            />
                            {/* 예상 마감일 */}
                            <Input
                                label="예상 완료일"
                                type="date"
                                value={formData.eta}
                                onChange={(value) => handleChange("eta", value)}
                            />
                            {/* 실제 완료일 */}
                            <Input
                                label="실제 완료일"
                                type="date"
                                value={formData.completed_date}
                                onChange={(value) => handleChange("completed_date", value)}
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
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={onClose}
                            className="btn-secondary min-w-[88px]"
                        >
                            취소
                        </button>
                        <button
                            onClick={() => {
                                handelCreate()
                            }}
                            className="btn-primary min-w-[88px]"
                        >
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
