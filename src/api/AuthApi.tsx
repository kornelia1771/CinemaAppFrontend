import {BASE_URL} from "./ApiHttp";

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    captchaToken: string;
}

export interface RegisterResponse {
    message: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const AuthApi = {
    register: async (request: RegisterRequest): Promise<RegisterResponse> => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An unexpected error occurred during registration.');
        }
        return data as RegisterResponse;
    },

    confirmEmail: async (token: string): Promise<RegisterResponse> => {
        const response = await fetch(`${BASE_URL}/auth/confirm-email?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to verify email address.');
        }
        return data as RegisterResponse;
    },

    login: async (request: LoginRequest): Promise<LoginResponse> => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An unexpected error occurred during sign in.');
        }
        return data as LoginResponse;
    }
};