
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
                className="fixed z-50 min-w-[180px] p-1 bg-white rounded-lg shadow-lg text-sm"
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
                className="fixed z-50 min-w-[180px] p-1 bg-white rounded-lg shadow-lg text-sm"
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
                    className="w-full h-8 px-2.5 text-left rounded-md hover:bg-hover flex items-center gap-2.5 cursor-pointer"
                >
                    <div>✏️</div>
                    <div>수정</div>
                </button>
                <button
                    onClick={() => {
                        onDelete();
                        onClose();
                    }}
                    className="w-full h-8 px-2.5 text-left rounded-md hover:bg-callout-red flex items-center gap-2.5 text-danger cursor-pointer"
                >
                    <div>🗑️</div>
                    <div>삭제</div>
                </button>
            </div>
        )
    }
}