import { useEffect, useState } from "react";
import Input from "@/shared/components/input/Input";
import Select from "@/shared/components/input/Select";
import Textarea from "@/shared/components/input/Textarea";
import type { StageFromData } from "@/shared/types/stageFromData.types";
import type { DetailProjectStage } from "@/shared/types/projectStage.types";
import { projectStageApi } from "@/shared/lib/api/projectStage";

type Props = {
    stage: DetailProjectStage;
    stateItems: { value: number; label: string }[];
    stageItems: { value: number; label: string }[];
    userItems: { value: number; label: string }[];
    onCancel: () => void;
    onSave: (data: StageFromData) => void | Promise<void>;
};

export default function StageUpdateFrom({
    stage,
    stateItems,
    userItems,
    onCancel,
    onSave,
}: Props) {
    // 담당자 변경
    const [stageOwnerId, setStageOwnerId] = useState<number | "">(
        stage.stage_owner_id ?? ""
    );

    const [formData, setFormData] = useState<StageFromData>({
        state_id: stage.state_id ?? "",
        name: stage.name ?? "",
        stage_owner_id: stage.stage_owner_id ?? "",
        note: stage.note ?? "",
        remark: stage.remark ?? "",
        planned_date: stage.planned_date ?? "",
        act_date: stage.act_date ?? "",
        eta: stage.eta ?? "",
        eta_change_reason: "",
    });

    // stage 변경 시 폼 초기화 (아코디언 전환 대응)
    useEffect(() => {
        setFormData({
            state_id: stage.state_id ?? "",
            name: stage.name ?? "",
            stage_owner_id: stage.stage_owner_id ?? "",
            note: stage.note ?? "",
            remark: stage.remark ?? "",
            planned_date: stage.planned_date ?? "",
            act_date: stage.act_date ?? "",
            eta: stage.eta ?? "",
            eta_change_reason: "",
        });
    }, [stage.id]);

    // stage 변경 시 담당자 초기화
    useEffect(() => {
        setStageOwnerId(stage.stage_owner_id ?? "");
    }, [stage.id, stage.stage_owner_id]);

    // 예상 완료일 변경 시 사유 입력
    const initialEta = stage.eta ?? "";

    const isEtaChanged =
        initialEta &&
        formData.eta &&
        initialEta !== formData.eta;

    const handleChange = (
        key: keyof StageFromData,
        value: string | number
    ) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const [saving, setSaving] = useState(false);

    // 담당자 해제까지 허용할 건지 결정
    const currentOwnerKey = stage.stage_owner_id ?? "";
    const ownerChanged = currentOwnerKey !== stageOwnerId;
    const nextOwnerId = stageOwnerId === "" ? null : Number(stageOwnerId);

    // 유효성 검사 && 저장
    const handleSave = async () => {
        if (saving) return;

        if (isEtaChanged && !formData.eta_change_reason?.trim()) {
            alert("예상 완료일 변경 사유를 입력해주세요.");
            return;
        }

        setSaving(true);
        try {
            // 1) stage 일반 업데이트 (반드시 끝나고 다음)
            await onSave(formData);

            // 2) 담당자 변경 (변경된 경우만)
            if (ownerChanged) {
                await projectStageApi.changeOwner(stage.project_id, stage.id, {
                    stage_owner_id: nextOwnerId,
                });
            }
        } catch (e: any) {
            alert(e?.message ?? "저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <tr>
            <td colSpan={8} className="bg-gray-50 p-6">
                <div className="space-y-4 px-10">
                    <div className="flex gap-10">
                        {/* LEFT */}
                        <div className="flex-1 space-y-4">
                            <Input
                                label="현재 단계"
                                value={formData.name}
                                onChange={(v) => handleChange("name", v)}
                            />
                            <Select
                                label="현재 상태"
                                value={formData.state_id === "" ? "" : String(formData.state_id)}
                                items={stateItems}
                                onChange={(v) => handleChange("state_id", Number(v))}
                            />
                            <Select
                                label="담당자"
                                value={stageOwnerId === "" ? "" : String(stageOwnerId)}
                                items={userItems}
                                onChange={(v) => setStageOwnerId(Number(v))}
                            />

                        </div>

                        {/* RIGHT */}
                        <div className="flex-1 space-y-4">
                            <Input
                                label="실행일"
                                type="date"
                                value={formData.act_date}
                                onChange={(v) =>
                                    handleChange("act_date", v)
                                }
                            />
                            <Input
                                label="마감일"
                                type="date"
                                value={formData.planned_date}
                                onChange={(v) =>
                                    handleChange("planned_date", v)
                                }
                            />
                            <Input
                                label="예상 완료일"
                                type="date"
                                value={formData.eta}
                                onChange={(v) => handleChange("eta", v)}
                            />
                        </div>
                    </div>

                    {isEtaChanged && (
                        <Textarea
                            label="완료 예정일 변경 사유"
                            placeholder="예: 고객 요청으로 일정 조정"
                            value={formData.eta_change_reason}
                            onChange={(v) =>
                                handleChange("eta_change_reason", v)
                            }
                        />
                    )}

                    <Textarea
                        label="업무 내용"
                        value={formData.note}
                        onChange={(v) => handleChange("note", v)}
                    />

                    <Textarea
                        label="비고"
                        value={formData.remark}
                        onChange={(v) => handleChange("remark", v)}
                    />

                    {/* 버튼 */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-1 border rounded-full hover:bg-gray-700 hover:text-white cursor-pointer"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-1 text-white rounded-full bg-primary hover:bg-primary-dark cursor-pointer"
                        >
                            저장
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
