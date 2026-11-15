// src/features/notification/components/NotificationModal.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NotificationOut, NotiData } from "@/shared/types/notification.types";
import { useNotificationStore } from "../store/notifications.store";
import { log } from "@/shared/lib/log";
import MissingReasonModal from "@/features/notification/components/MissingReasonModal";

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
        color: "bg-callout-orange",
    },
    NOTICE_REASON_MISSING: {
        icon: "⚠️",
        title: "사유 미입력",
        color: "bg-callout-yellow",
    },
    NOTICE_DELAY: {
        icon: "⏱️",
        title: "지연",
        color: "bg-callout-blue",
    },
    NOTICE_SCHEDULE_UPDATED: {
        icon: "📅",
        title: "일정 변경",
        color: "bg-callout-purple",
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

    // 사유 입력 모달
    const [openReasonModal, setOpenReasonModal] = useState(false);
    const [notiData, setNotiData] = useState<NotiData | null>(null);

    const handleReasonModal = (noti: NotificationOut) => {
        if (noti.code === "NOTICE_REASON_MISSING") {

            setNotiData({
                projectId: noti.project_id,
                stageId: noti.project_stage_id,
            });
            log("[handleReasonModal], 노티 확인", notiData);
            setOpenReasonModal(true);
        }
    };

    ////
    useEffect(() => {
        if (!open) {
            setActive("all");
            setQuery("");
            setOpenReasonModal(false);
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

    const handleRead = async (notification: NotificationOut) => {
        console.log("notification:", notification);
        await fetchReadNoti(notification.notification_id);
        onRead?.(notification.notification_id);
    }

    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="relative z-[70]">
                <MissingReasonModal
                    open={openReasonModal}
                    onClose={() => setOpenReasonModal(false)}
                    notiData={notiData} />
            </div>
            <div className="modal-overlay" />
            <div className="modal-panel w-[980px] max-w-[92vw] h-[640px] max-h-[86vh] overflow-hidden">

                {/* Header */}
                <div className="h-14 px-5 flex items-center justify-between border-b border-gray-200">

                    <div className="flex items-center gap-3">
                        <div className="modal-title">
                            {title}
                        </div>
                        <div className="text-sm text-gray-500">
                            안 읽은 알림 {unreadCount}개
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="btn-secondary h-9 px-4"
                            onClick={onReadAll}
                        >
                            모두 읽음
                        </button>
                        <button
                            className="btn-dark"
                            onClick={onClose}
                        >
                            닫기
                        </button>
                    </div>
                </div>

                <div className="h-[calc(100%-64px)] grid grid-cols-[260px_1fr]">
                    {/* Sidebar */}
                    <aside className="border-r border-gray-200 bg-sidebar">
                        <div className="p-4">
                            <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-4">
                                <div className="text-sm text-gray-500">
                                    전체 알림
                                </div>
                                <div className="mt-1 text-2xl font-bold leading-tight">
                                    {notifications.length}
                                </div>
                                <div className="mt-3 flex gap-2 text-xs">
                                    <span className="tag">
                                        안 읽음 {unreadCount}
                                    </span>
                                    <span className="tag">
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
                                            rounded-md
                                            text-sm
                                            ${active === m.key
                                                ? "bg-hover text-gray-900 font-semibold"
                                                : "text-gray-600 hover:bg-hover"
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
                            <h2 className="text-base font-bold">
                                {title}
                            </h2>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="프로젝트 검색"
                                className="field-control w-64"
                            />
                        </div>
                        {filteredNotifications.length === 0 ? (
                            <div className="rounded-lg bg-callout-gray p-12 text-center text-sm text-gray-500">
                                표시할 알림이 없습니다.
                            </div>
                        ) : (
                            <div className="space-y-3 pointer">
                                {filteredNotifications.map((notification) => (
                                    <NotificationCard
                                        key={notification.id}
                                        item={notification}
                                        onClick={async () => {
                                            if (!notification.is_read) {
                                                await handleRead(notification)
                                            }
                                            if (notification.code == 'NOTICE_REASON_MISSING') {
                                                handleReasonModal(notification);
                                            } else {
                                                navigate(`/project/${notification.project_id}`);
                                                onClose();
                                            }
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
            color: "bg-callout-gray"
        };

    return (
        <div
            onClick={onClick}
            className={`
                rounded-lg
                border
                p-4
                cursor-pointer
                transition

                ${item.is_read
                    ? "bg-white border-gray-200 hover:bg-gray-50"
                    : `${config.color} border-transparent hover:brightness-[0.97]`
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
                                bg-primary
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

                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                        {getNotificationMessage(item)}
                    </div>

                    <div className="mt-2 text-xs text-gray-500 tabular-nums">
                        {formatDate(item.triggered_at)}
                    </div>
                </div>
                {!item.is_read && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRead();
                        }}
                        className="btn-secondary h-7 px-2.5 text-xs"
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
            return `[${item.project_stage_name}] 단계의 마감일이 다가왔습니다.`;
        case "NOTICE_SCHEDULE_UPDATED":
            return `[${item.project_stage_name}] 일정이 변경되었습니다.`;
        case "NOTICE_DELAY":
            return `[${item.project_stage_name}] 단계가 다음의 이유로 지연되었습니다: \n ${item.trigger_context}`;
        case "NOTICE_REASON_MISSING":
            return `지연 사유를 입력해주세요.`;
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