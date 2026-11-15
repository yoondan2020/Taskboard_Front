
type ContextMenue = {
    x: number;
    y: number;
}

type Props = {
    contextMenu: ContextMenue;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
    isEditable: boolean;
}

export default function ContextMenu(
    { contextMenu,
        isEditable,
        onEdit,
        onDelete,
        onClose,
    }: Props
) {

    if (!isEditable) {
        return (
            <div
                className="fixed z-50 min-w-[168px] p-1.5 bg-white/95 backdrop-blur-xl rounded-xl ring-1 ring-black/5 shadow-[0_12px_32px_rgba(0,0,0,0.14)] text-sm"
                style={{
                    left: contextMenu.x,
                    top: contextMenu.y,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <div className="w-full px-3 py-2 text-left text-gray-500 flex items-center gap-2.5">
                    수정 권한이 없습니다.
                </div>
            </div>
        );
    } else {
        return (
            <div
                className="fixed z-50 min-w-[168px] p-1.5 bg-white/95 backdrop-blur-xl rounded-xl ring-1 ring-black/5 shadow-[0_12px_32px_rgba(0,0,0,0.14)] text-sm"
                style={{
                    left: contextMenu.x,
                    top: contextMenu.y,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <button
                    onClick={() => {
                        onEdit();
                        onClose();
                    }}
                    className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-100 flex items-center gap-2.5 cursor-pointer"
                >
                    <div>✏️</div>
                    <div>수정</div>
                </button>
                <button
                    onClick={() => {
                        onDelete();
                        onClose();
                    }}
                    className="w-full px-3 py-2 text-left rounded-lg hover:bg-danger/10 flex items-center gap-2.5 text-danger cursor-pointer"
                >
                    <div>🗑️</div>
                    <div>삭제</div>
                </button>
            </div>
        )
    }
}