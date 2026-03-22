// src/features/notification/components/NotificationModal.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NotificationOut } from "@/shared/types/notification.types";

type NotificationItem = {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    projectId?: number;
    projectTitle?: string;
    type:
    | "NOTICE_DEADLINE"
    | "NOTICE_REASON_MISSING"
    | "NOTICE_OVERDUE"
    | "NOTICE_DELAY"
    | "NOTICE_NORMALIZED"
    | "NOTICE_SCHEDULE_UPDATED";
};

type Props = {
    open: boolean;
    onClose: () => void;
    notifications: NotificationOut[];
    onRead?: (notificationId: number) => void;
    onReadAll?: () => void;
};

type MenuKey = "all" | "unread" | "read";

const MENU: { key: MenuKey; label: string }[] = [
    { key: "all", label: "전체 알림" },
    { key: "unread", label: "안 읽은 알림" },
    { key: "read", label: "읽은 알림" },
];

export default function NotificationModal({
    open,
    onClose,
    notifications,
    onRead,
    onReadAll,
}: Props) {
    const navigate = useNavigate();
    const [active, setActive] = useState<MenuKey>("all");
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!open) {
            setActive("all");
            setQuery("");
        }
    }, [open]);

    const title = useMemo(() => {
        return MENU.find((m) => m.key === active)?.label ?? "알림";
    }, [active]);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isRead).length,
        [notifications]
    );

    const filteredNotifications = useMemo(() => {
        let base = notifications;

        if (active === "unread") {
            base = base.filter((n) => !n.isRead);
        }

        if (active === "read") {
            base = base.filter((n) => n.isRead);
        }

        if (query.trim()) {
            const q = query.toLowerCase();
            base = base.filter(
                (n) =>
                    n.title?.toLowerCase().includes(q) ||
                    n.message?.toLowerCase().includes(q)
            );
        }

        return base;
    }, [notifications, active, query]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="알림 모달"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* modal */}
            <div className="relative w-[980px] max-w-[92vw] h-[640px] max-h-[86vh] bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* header */}
                <div className="h-14 px-5 flex items-center justify-between border-b">
                    <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold">{title}</div>
                        <div className="text-sm text-gray-500">
                            안 읽은 알림 {unreadCount}개
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="px-3 py-1.5 text-sm rounded-lg border bg-white hover:bg-gray-100 cursor-pointer"
                            onClick={onReadAll}
                        >
                            모두 읽음 처리
                        </button>
                        <button
                            className="px-3 py-1.5 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                            onClick={onClose}
                            type="button"
                        >
                            닫기
                        </button>
                    </div>
                </div>

                {/* body */}
                <div className="h-[calc(100%-56px)] grid grid-cols-[260px_1fr]">
                    {/* left menu */}
                    <aside className="border-r bg-gray-50">
                        <div className="p-4">
                            <div className="rounded-2xl bg-white border p-4">
                                <div className="text-sm text-gray-500">알림 요약</div>
                                <div className="mt-2 text-2xl font-semibold">
                                    {notifications.length}
                                </div>
                                <div className="text-sm text-gray-600">전체 알림</div>

                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                    <span className="px-2 py-1 rounded-full bg-gray-100 border">
                                        안 읽음 {unreadCount}
                                    </span>
                                    <span className="px-2 py-1 rounded-full bg-gray-100 border">
                                        읽음 {notifications.length - unreadCount}
                                    </span>
                                </div>
                            </div>

                            <nav className="mt-4 space-y-1">
                                {MENU.map((m) => {
                                    const isActive = m.key === active;

                                    return (
                                        <button
                                            key={m.key}
                                            type="button"
                                            onClick={() => setActive(m.key)}
                                            className={[
                                                "w-full text-left rounded-xl px-3 py-2 border transition",
                                                isActive
                                                    ? "bg-white border-gray-900 shadow-sm"
                                                    : "bg-transparent border-transparent hover:bg-white hover:border-gray-200",
                                            ].join(" ")}
                                        >
                                            <div className="font-medium">{m.label}</div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* right content */}
                    <main className="p-6 overflow-auto">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-lg font-semibold">{title}</div>

                                <div className="w-[280px]">
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="프로젝트명, 제목, 내용 검색"
                                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                                    />
                                </div>
                            </div>

                            {filteredNotifications.length === 0 ? (
                                <div className="rounded-2xl border bg-gray-50 px-4 py-10 text-center text-gray-500">
                                    표시할 알림이 없습니다.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredNotifications.map((notification) => (
                                        <NotificationCard
                                            key={notification.id}
                                            item={notification}
                                            onClick={() => {
                                                if (!notification.isRead) {
                                                    onRead?.(notification.id);
                                                }

                                                if (notification.projectId) {
                                                    navigate(`/project/${notification.projectId}`);
                                                    onClose();
                                                }
                                            }}
                                            onRead={() => onRead?.(notification.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}

function NotificationCard({
    item,
    onClick,
    onRead,
}: {
    item: NotificationOut;
    onClick: () => void;
    onRead: () => void;
}) {
    return (
        <div
            className={[
                "rounded-2xl border p-4 transition cursor-pointer",
                item.isRead
                    ? "bg-white hover:bg-gray-50"
                    : "bg-gray-50 border-gray-300 hover:bg-gray-100",
            ].join(" ")}
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        {!item.isRead && (
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        )}
                    </div>

                    <div className="mt-2 font-semibold text-gray-900 break-words">
                        {item.title}
                    </div>

                    <div className="mt-1 text-sm text-gray-600 break-words">
                        {item.message}
                    </div>
                </div>

                {!item.isRead && (
                    <button
                        type="button"
                        className="shrink-0 px-3 py-1.5 text-sm rounded-lg border bg-white hover:bg-gray-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRead();
                        }}
                    >
                        읽음 처리
                    </button>
                )}
            </div>
        </div>
    );
}

function notificationTypeLabel(type: NotificationItem["type"]) {
    switch (type) {
        case "NOTICE_DEADLINE":
            return "마감 예정";
        case "NOTICE_REASON_MISSING":
            return "사유 미입력";
        case "NOTICE_OVERDUE":
            return "지연 초과";
        case "NOTICE_DELAY":
            return "지연";
        case "NOTICE_NORMALIZED":
            return "정상화";
        case "NOTICE_SCHEDULE_UPDATED":
            return "일정 변경";
        default:
            return "알림";
    }
}

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}