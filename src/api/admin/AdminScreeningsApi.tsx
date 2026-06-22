import {BASE_URL} from "../ApiHttp";

export interface AdminScreeningRequest {
    movieId: number;
    hallId: number;
    screeningTime: string;
    ticketPrice: number;
}

export interface ScreeningResponse {
    id: number;
    hallId: number;
    hallName?: string;
    screeningTime: string;
    ticketPrice: number;
}

export interface MovieDetailsResponse {
    id: number;
    title: string;
    description: string;
    duration: number;
    imageUrl: string;
    screenings: ScreeningResponse[];
}

export const AdminScreeningApi = {
    addScreening: async (request: AdminScreeningRequest): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/screenings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to add screening.");
        return data;
    },

    getScreeningsForMovie: async (movieId: number): Promise<MovieDetailsResponse> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/screenings/${movieId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch screenings.");
        return data as MovieDetailsResponse;
    },

    editScreening: async (id: number, request: AdminScreeningRequest): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/screenings/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update screening.");
        return data;
    },

    deleteScreening: async (id: number): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/screenings/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to delete screening.");
        return data;
    }
};