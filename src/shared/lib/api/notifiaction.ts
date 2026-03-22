import { request } from "./client";

import type { NotificationOut } from "@/shared/types/notification.types";

const BASE = "/notification";

export const notificationApi = {
    // Create

    // Read
    // 내 알림
    myNotifiactions: () =>
        request<NotificationOut[]>(BASE),

    // Update
}