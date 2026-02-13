export interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'gym_owner' | 'admin';
    created_at: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
