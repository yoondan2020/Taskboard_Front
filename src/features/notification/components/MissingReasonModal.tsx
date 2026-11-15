import { useEffect, useState } from "react";
import Input from "@/shared/components/input/Input";
import Textarea from "@/shared/components/input/Textarea";
import { type NotiData } from "@/shared/types/notification.types";
import type { MissingReasonStage } from "@/shared/types/stageFromData.types";
import { useProjectStageStore } from "@/features/project/store/projectStage.store";
import { log } from "@/shared/lib/log";

type Props = {
    open: boolean;
    onClose: () => void;
    notiData: NotiData | null;
}

export default function MissingReasonModal({
    open,
    onClose,
    notiData,
}: Props) {
    const fetchDetail = useProjectStageStore((s) => s.fetchDetail);
    const update = useProjectStageStore((s) => s.update);
    const stage = useProjectStageStore((s) => s.item);

    const [formData, setFormData] = useState<MissingReasonStage>({
        name: "",
        note: "",
        remark: "",
        due_date: "",
        eta: "",
        change_reason: "",
    });

    const [saving, setSaving] = useState(false);

    // 모달이 열리고 notiData가 있으면 stage 조회
    useEffect(() => {
        if (!open || !notiData) return;

        fetchDetail(
            notiData.projectId,
            Number(notiData.stageId)
        );
    }, [open, notiData, fetchDetail]);

    // stage 조회가 끝나면 formData 초기화
    useEffect(() => {
        if (!stage) return;

        setFormData({
            name: stage.name ?? "",
            note: stage.note ?? "",
            remark: stage.remark ?? "",
            due_date: stage.due_date ?? "",
            eta: stage.eta ?? "",
            change_reason: "",
        });
    }, [stage]);

    if (!open || !notiData) {
        return null;
    }

    if (!stage) {
        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center">
                <div className="modal-panel px-6 py-5 text-sm text-gray-500">
                    불러오는 중...
                </div>
            </div>
        );
    }

    const initialEta = stage.eta ?? "";
    const initialDueDate = stage.due_date ?? "";

    const isScheduleChanged =
        (initialEta &&
            formData.eta &&
            initialEta !== formData.eta) ||
        (initialDueDate &&
            formData.due_date &&
            initialDueDate !== formData.due_date);

    const handleChange = (
        key: keyof MissingReasonStage,
        value: string | number
    ) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // 단계 수정 폼 데이터 정규화
    const normalizeFormData = (formData: MissingReasonStage) => ({
        name: formData.name || undefined,
        due_date: formData.due_date || undefined,
        eta: formData.eta || undefined,
        change_reason: formData.change_reason || undefined,
    });

    const handleSave = async () => {
        if (saving) return;

        if (isScheduleChanged && !formData.change_reason?.trim()) {
            alert("변경 사유를 입력해주세요.");
            return;
        }

        setSaving(true);

        try {
            log("MissingReasonModal-save", formData);
            await update(notiData.projectId, Number(notiData.stageId), normalizeFormData(formData));
            onClose();
        } catch (e: any) {
            alert(e?.message ?? "저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="modal-panel px-7 py-6 w-[640px] max-w-[92vw]">
                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-6">
                        {/* LEFT */}
                        <div className="space-y-4">
                            <Input
                                label="마감일"
                                type="date"
                                value={formData.due_date}
                                onChange={(v) =>
                                    handleChange("due_date", v)
                                }
                            />
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-4">

                            <Input
                                label="예상 완료일"
                                type="date"
                                value={formData.eta}
                                onChange={(v) =>
                                    handleChange("eta", v)
                                }
                            />
                        </div>
                    </div>

                    {isScheduleChanged && (
                        <Textarea
                            label="일정 변경 사유"
                            placeholder="예: 고객 요청으로 일정 조정"
                            value={formData.change_reason}
                            onChange={(v) =>
                                handleChange("change_reason", v)
                            }
                        />
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary min-w-[88px]"
                        >
                            취소
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
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