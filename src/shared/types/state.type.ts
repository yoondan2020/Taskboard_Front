export type StateOut = {
    id: number;
    name: string;
    is_active: boolean;
}

export type StateCreate = {
    name: string;
}

export type StateUpdate = {
    id?: number;
    name?: string;
}