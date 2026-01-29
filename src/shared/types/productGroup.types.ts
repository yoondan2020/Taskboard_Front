
export type ProductGroupOut = {
    id: number;
    name: string;
    is_active: boolean;
}

export type ProductGroupCreate = {
    name: string;
}

export type ProductGroupUpdate = {
    name?: string;
    is_active?: boolean;
}