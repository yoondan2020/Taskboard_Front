export type NotificationOut = {
    id: number;
    projectId: number;
    projectStageId?: number;
    code: string;
    channel: string;
    triggeredAt: string;
    isRead: boolean;
    title?: string;
    message?: string;
}