// src/features/notification/components/NotificationModal.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NotificationOut } from "@/shared/types/notification.types";
import { useNotificationStore } from "../store/notifications.store";


type Props = {
    open: boolean;
    onClose: () => void;
    onRead?: (notificationId: number) => void;
    onReadAll?: () => void;
};

type MenuKey = "all" | "unread" | "read";

const MENU: { key: MenuKey; label: string }[] = [
    { key: "all", label: "전체 알림" },
    { key: "unread", label: "안 읽은 알림" },
    { key: "read", label: "읽은 알림" },
];


const NOTIFICATION_CONFIG = {
    NOTICE_DEADLINE: {
        icon: "⏰",
        title: "마감 예정",
        color: "bg-orange-50",
    },
    NOTICE_REASON_MISSING: {
        icon: "⚠️",
        title: "사유 미입력",
        color: "bg-yellow-50",
    },
    NOTICE_OVERDUE: {
        icon: "🚨",
        title: "지연 초과",
        color: "bg-red-50",
    },
    NOTICE_DELAY: {
        icon: "⏱️",
        title: "지연",
        color: "bg-blue-50",
    },
    NOTICE_NORMALIZED: {
        icon: "✅",
        title: "정상화",
        color: "bg-green-50",
    },
    NOTICE_SCHEDULE_UPDATED: {
        icon: "📅",
        title: "일정 변경",
        color: "bg-purple-50",
    },
} as const;


export default function NotificationModal({
    open,
    onClose,
    onRead,
    onReadAll,
}: Props) {
    const navigate = useNavigate();

    const [active, setActive] = useState<MenuKey>("all");
    const [query, setQuery] = useState("");
    const fetchReadNoti = useNotificationStore((s) => s.fetchReadNoti);
    const fetch = useNotificationStore((s) => s.fetch);
    const notifications = useNotificationStore((s) => s.items);

    useEffect(() => {
        if (!open) {
            setActive("all");
            setQuery("");
        }
        fetch();
    }, [open]);


    const title = useMemo(() => {
        return MENU.find((m) => m.key === active)?.label ?? "알림";
    }, [active]);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.is_read).length,
        [notifications]
    );

    const filteredNotifications = useMemo(() => {
        let base = notifications;
        if (active === "unread") {
            base = base.filter((n) => !n.is_read);
        }
        if (active === "read") {
            base = base.filter((n) => n.is_read);
        }
        if (query.trim()) {
            const q = query.toLowerCase();
            base = base.filter(
                (n) =>
                    n.project_title
                        ?.toLowerCase()
                        .includes(q) ||
                    n.project_stage_name
                        ?.toLowerCase()
                        .includes(q)
            );
        }
        return base;
    }, [notifications, active, query]);
    if (!open) return null;

    const handleRead = async (notification: NotificationOut) => {
        console.log("notification:", notification);
        await fetchReadNoti(notification.notification_id);
        onRead?.(notification.notification_id);
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="absolute inset-0 bg-black/40" />
            <div className="
                relative
                w-[980px]
                max-w-[92vw]
                h-[640px]
                max-h-[86vh]
                bg-white
                rounded-2xl
                shadow-xl
                overflow-hidden
            ">

                {/* Header */}
                <div className="
                    h-14
                    px-5
                    flex
                    items-center
                    justify-between
                    border-b
                ">

                    <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold">
                            {title}
                        </div>
                        <div className="text-sm text-gray-500">
                            안 읽은 알림 {unreadCount}개
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="
                                px-3
                                py-1.5
                                text-sm
                                rounded-lg
                                border
                                hover:bg-gray-100
                            "
                            onClick={onReadAll}
                        >
                            모두 읽음
                        </button>
                        <button
                            className="
                                px-3
                                py-1.5
                                text-sm
                                rounded-lg
                                bg-gray-900
                                text-white
                            "
                            onClick={onClose}
                        >
                            닫기
                        </button>
                    </div>
                </div>

                <div className="
                    h-[calc(100%-56px)]
                    grid
                    grid-cols-[260px_1fr]
                ">
                    {/* Sidebar */}
                    <aside className="
                        border-r
                        bg-gray-50
                    ">
                        <div className="p-4">
                            <div className="
                                rounded-2xl
                                bg-white
                                border
                                p-4
                            ">
                                <div className="text-sm text-gray-500">
                                    전체 알림
                                </div>
                                <div className="
                                    mt-2
                                    text-2xl
                                    font-semibold
                                ">
                                    {notifications.length}
                                </div>
                                <div className="mt-3 flex gap-2 text-xs">
                                    <span className="
                                        px-2
                                        py-1
                                        rounded-full
                                        bg-gray-100
                                    ">
                                        안 읽음 {unreadCount}
                                    </span>
                                    <span className="
                                        px-2
                                        py-1
                                        rounded-full
                                        bg-gray-100
                                    ">
                                        읽음 {notifications.length - unreadCount}
                                    </span>
                                </div>
                            </div>
                            <nav className="mt-4 space-y-1">
                                {MENU.map((m) => (
                                    <button
                                        key={m.key}
                                        onClick={() => setActive(m.key)}
                                        className={`
                                            w-full
                                            text-left
                                            px-3
                                            py-2
                                            rounded-xl
                                            ${active === m.key
                                                ? "bg-white border shadow-sm"
                                                : "hover:bg-white"
                                            }
                                        `}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="p-6 overflow-auto">
                        <div className="
                            flex
                            justify-between
                            mb-4
                        ">
                            <h2 className="font-semibold text-lg">
                                {title}
                            </h2>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="프로젝트 검색"
                                className="
                                    border
                                    rounded-xl
                                    px-3
                                    py-2
                                    text-sm
                                "
                            />
                        </div>
                        {filteredNotifications.length === 0 ? (
                            <div className="
                                rounded-2xl
                                border
                                p-10
                                text-center
                                text-gray-500
                            ">
                                표시할 알림이 없습니다.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredNotifications.map((notification) => (
                                    <NotificationCard
                                        key={notification.id}
                                        item={notification}
                                        onClick={async () => {
                                            if (!notification.is_read) {
                                                await handleRead(notification)
                                            }
                                            navigate(`/project/${notification.project_id}`);
                                            onClose();
                                        }}
                                        onRead={() => handleRead(notification)}
                                    />
                                ))}
                            </div>
                        )}
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

    const config =
        NOTIFICATION_CONFIG[
        item.code as keyof typeof NOTIFICATION_CONFIG
        ] ?? {
            icon: "🔔",
            title: "알림",
            color: "bg-gray-50"
        };

    return (
        <div
            onClick={onClick}
            className={`
                rounded-2xl
                border
                p-4
                cursor-pointer
                transition

                ${item.is_read
                    ? "bg-white hover:bg-gray-50"
                    : `${config.color} border-gray-300`
                }
            `}
        >
            <div className="flex justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span>
                            {config.icon}
                        </span>
                        <span className="font-semibold">
                            {config.title}
                        </span>
                        {!item.is_read && (
                            <span className="
                                w-2
                                h-2
                                rounded-full
                                bg-red-500
                            "/>
                        )}
                    </div>
                    <div className="flex gap-5 items-center">
                        <div className="
                        font-medium
                        ">
                            {item.project_title}
                        </div>

                        {item.project_stage_name && (
                            <div className="
                            text-sm
                            text-gray-500
                        ">
                                {item.project_stage_name}
                            </div>
                        )}
                    </div>

                    <div className="
                        mt-2
                        text-sm
                        text-gray-600
                    ">
                        {getNotificationMessage(item)}
                    </div>

                    <div className="
                        mt-2
                        text-xs
                        text-gray-400
                    ">
                        {formatDate(item.triggered_at)}
                    </div>
                </div>
                {!item.is_read && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRead();
                        }}
                        className="
                            h-fit
                            px-3
                            py-1.5
                            text-sm
                            rounded-lg
                            border
                            bg-white
                        "
                    >
                        읽음
                    </button>
                )}
            </div>
        </div>
    );
}


function getNotificationMessage(item: NotificationOut) {
    switch (item.code) {
        case "NOTICE_DEADLINE":
            return `${item.project_stage_name} 단계의 마감일이 다가왔습니다.`;
        case "NOTICE_SCHEDULE_UPDATED":
            return `${item.project_stage_name} 일정이 변경되었습니다.`;
        case "NOTICE_DELAY":
            return `${item.project_stage_name} 단계가 지연되었습니다.`;
        case "NOTICE_OVERDUE":
            return `${item.project_stage_name} 지연이 초과되었습니다.`;
        case "NOTICE_REASON_MISSING":
            return `지연 사유를 입력해주세요.`;
        case "NOTICE_NORMALIZED":
            return `${item.project_stage_name} 단계가 정상화되었습니다.`;
        default:
            return "프로젝트 알림이 있습니다.";
    }
}

function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return new Intl.DateTimeFormat(
        "ko-KR",
        {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }
    ).format(date);
}