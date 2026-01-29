import { useStageStore } from "@/features/admin/store/stage.store";
import { useState } from "react";
import ModifyIcon from "@/shared/components/icons/ModifyIcon";
import { UpdateModal } from "./UpdateModal";
import ActiveButton from "@/shared/components/button/ActiveButton";

export default function StageManage() {
    const items = useStageStore((s) => s.items);
    const loading = useStageStore((s) => s.loading);
    const error = useStageStore((s) => s.error);
    const deactivate = useStageStore((s) => s.deactivate);
    const restore = useStageStore((s) => s.restore);
    const update = useStageStore((s) => s.update);

    const [editingItem, setEditingItem] = useState<{
        id: number;
        name: string;
    } | null>(null);

    return (
        <div className="container">
            {loading && <div>로딩…</div>}

            {error && <div className="error">{error}</div>}

            {/* 표 영역 */}
            <table className="table">
                <thead className="thead">
                    <tr>
                        <th className="th thCenter w-16">ID</th>
                        <th className="th text-left">단계 명</th>
                        <th className="th thCenter w-24">활성화</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="td empty">
                                데이터가 없습니다
                            </td>
                        </tr>
                    ) : (
                        items.map((x) => (
                            <tr key={x.id}>
                                <td className="td tdCenter">{x.id}</td>
                                <td className="td">
                                    <div className="nameCell">
                                        <span>{x.name}</span>
                                        <ModifyIcon
                                            onClick={() =>
                                                setEditingItem({ id: x.id, name: x.name })
                                            }
                                        />
                                    </div>
                                </td>
                                <td className="td tdCenter">
                                    <ActiveButton
                                        active={x.is_active}
                                        onChange={(next) => {
                                            if (next) restore(x.id);
                                            else deactivate(x.id);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {editingItem && (
                <UpdateModal
                    buttonLabel="상태"
                    itemName={editingItem.name}
                    onClose={() => setEditingItem(null)}
                    onSubmit={(newName) => {
                        update(editingItem.id, { name: newName });
                        setEditingItem(null);
                    }}
                />
            )}
        </div>
    )
}