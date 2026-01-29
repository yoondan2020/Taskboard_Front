
export type StageOut = {
    id: number;
    name: string;
    is_active: boolean;
}

export type StageCreate = {
    name: string;
}

export type StageUpdate = {
    id?: number;
    name?: string;
}
