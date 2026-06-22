import {BASE_URL} from "../ApiHttp";

export interface AdminHallRequest {
    name: string;
    totalSeats: number;
}

export interface AdminHallResponse {
    id: number;
    name: string;
    totalSeats: number;
}

export const AdminHallsApi = {
    addHall: async (request: AdminHallRequest): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/halls`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to add hall.");
        return data;
    },

    getAllHalls: async (): Promise<AdminHallResponse[]> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/halls`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch halls.");
        return data as AdminHallResponse[];
    },

    editHall: async (hallId: number, request: AdminHallRequest): Promise<any> => {
        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/admin/halls/${hallId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update hall.");
        return data;
    },

    deleteHall: async (hallId: number): Promise<any> => {
        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/admin/halls/${hallId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to delete hall.");
        return data;
    }
};