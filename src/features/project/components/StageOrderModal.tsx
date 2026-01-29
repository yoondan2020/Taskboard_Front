import { useEffect, useState } from "react";

type StageItems = {
  value: number;
  label: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (stageOrder: number[]) => void;
  stageItems: StageItems[];
};

export default function StageOrderModal({ open, onClose, onConfirm, stageItems }: Props) {
  if (!open) return null;

  const [stages, setStages] = useState<StageItems[]>(stageItems);

  // 모달을 다시 열 때 stageItems가 바뀌면 반영되도록(중요)
  useEffect(() => {
    if (open) setStages(stageItems);
  }, [open, stageItems]);

  // drag 상태
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    if (to < 0 || to >= stages.length) return;

    setStages((prev) => {
      const copied = [...prev];
      const [target] = copied.splice(from, 1);
      copied.splice(to, 0, target);
      return copied;
    });
  };

  const handleDragStart = (idx: number) => (e: React.DragEvent) => {
    setDragIndex(idx);
    setOverIndex(idx);

    // HTML5 DnD는 dataTransfer 설정이 있어야 안정적으로 동작하는 브라우저가 있음
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
  };

  const handleDragOver = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (overIndex !== idx) setOverIndex(idx);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();

    const from =
      dragIndex ?? Number(e.dataTransfer.getData("text/plain"));

    if (Number.isNaN(from) || from == null) return;

    reorder(from, idx);
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const isDragging = dragIndex != null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      {/* dim */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative w-[500px] bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">단계 순서 설정</h2>

        <p className="text-sm text-gray-500 mb-3">
          왼쪽 <span className="font-medium">☰</span> 를 드래그해서 순서를 바꿀 수 있어요.
        </p>

        <ul className="space-y-2">
          {stages.map((stage, idx) => {
            const isOver = overIndex === idx && dragIndex !== idx;

            return (
              <li
                key={stage.value}
                onDragOver={handleDragOver(idx)}
                onDrop={handleDrop(idx)}
                className={[
                  "flex items-center justify-between border p-2 rounded transition",
                  isOver ? "border-[#005D73] bg-[#005D73]/5" : "",
                  dragIndex === idx ? "opacity-60" : "",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  {/* 드래그 핸들 */}
                  <span
                    className="cursor-grab select-none px-2 py-1 rounded border bg-gray-50 active:cursor-grabbing"
                    draggable
                    onDragStart={handleDragStart(idx)}
                    onDragEnd={handleDragEnd}
                    title="드래그해서 이동"
                  >
                    ☰
                  </span>

                  <span>
                    {idx + 1}. {stage.label}
                  </span>
                </div>

                {/* 기존 버튼도 유지(키보드/모바일 fallback) */}
                <div className="flex gap-1">
                  <button
                    className="px-2 border rounded disabled:opacity-40"
                    disabled={idx === 0}
                    onClick={() => reorder(idx, idx - 1)}
                  >
                    ↑
                  </button>
                  <button
                    className="px-2 border rounded disabled:opacity-40"
                    disabled={idx === stages.length - 1}
                    onClick={() => reorder(idx, idx + 1)}
                  >
                    ↓
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* 리스트 끝에 드랍하고 싶을 때(맨 아래로 이동) */}
        <div
          onDragOver={(e) => {
            if (!isDragging) return;
            e.preventDefault();
            setOverIndex(stages.length - 1);
          }}
          onDrop={(e) => {
            if (dragIndex == null) return;
            e.preventDefault();
            reorder(dragIndex, stages.length - 1);
            setDragIndex(null);
            setOverIndex(null);
          }}
          className="mt-2 text-xs text-gray-400"
        >
          {/* 빈 영역 */}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-1 rounded bg-gray-200"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-1 rounded bg-[#005D73] text-white"
            onClick={() => onConfirm(stages.map((s) => s.value))}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
