export type StageFromData = {
    state_id: number | "";
    name: string;
    note: string;
    remark: string;

    due_date?: string;
    eta?: string;
    completed_date?: string;

    change_reason: string;
    stage_owner_id: number | "";
};

export type MissingReasonStage = {
    name: string;
    note: string;
    remark: string;

    due_date?: string;
    eta?: string;
    change_reason: string;
}