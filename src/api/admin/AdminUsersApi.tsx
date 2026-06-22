import {BASE_URL} from "../ApiHttp";

export interface AdminRegisterRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    enabled?: boolean;
    roles?: string[];
}

export interface AdminUserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    enabled: boolean;
    roles: string[];
    createdAt: string;
}

export interface AdminUserEditRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    enabled?: boolean;
    roles?: string[];
}

export const AdminUsersApi = {
    registerAdmin: async (request: AdminRegisterRequest): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to register user.");
        return data;
    },

    getAllUsers: async (): Promise<AdminUserResponse[]> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch users.");
        }

        return data as AdminUserResponse[];
    },

    editUser: async (id: number, request: AdminUserEditRequest): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/user/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update user.");
        }

        return data;
    }
};