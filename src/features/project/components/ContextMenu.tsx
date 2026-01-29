
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
                className="fixed bg-white border border-1 rounded-lg shadow-lg z-50 overflow-hidden"
                style={{
                    left: contextMenu.x,
                    top: contextMenu.y,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <div className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 ">
                    수정 권한이 없습니다.
                </div>
            </div>
        );
    } else {
        return (
            <div
                className="fixed bg-white border border-1 rounded-lg shadow-lg z-50 overflow-hidden"
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
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 border-b"
                >
                    <div>✏️</div>
                    <div>수정</div>
                </button>
                <button
                    onClick={() => {
                        onDelete();
                        onClose();
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-red-600"
                >
                    <div>🗑️</div>
                    <div>삭제</div>
                </button>
            </div>
        )
    }
}