export type Me = {
    id: number;
    name: string;
    email: string;
    department: string | null;
    position: string | null;
    role: string;
    is_active?: boolean;
};