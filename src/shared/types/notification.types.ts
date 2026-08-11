export type NotificationOut = {
    id: number;
    notification_id: number;
    project_id: number;
    project_stage_id?: number;
    code: string;
    channel: string;
    triggered_at: string;
    trigger_context: string;
    is_read: boolean;
    project_title?: string;
    project_stage_name?: string;
    message?: string;
}

export type NotiData = {
    projectId: number;
    stageId?: number;
}