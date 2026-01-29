import type { Me } from "@/shared/types/user.types";

export type LoginRequest = {
    email: string;
    password: string;
    remember?: boolean;
};

export type LoginResponse = {
    access_token: string;
    user: Me;
};
