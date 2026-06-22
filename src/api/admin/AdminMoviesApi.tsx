import { BASE_URL } from "../ApiHttp";

export interface AdminMovieRequest {
    title: string;
    description: string;
    duration: number;
    imageUrl: string;
    available: boolean;
}

export interface AdminMovieResponse {
    id: number;
    title: string;
    description: string;
    duration: number;
    imageUrl: string;
    available: boolean;
}

export const AdminMovieApi = {
    addMovie: async (request: AdminMovieRequest): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/movies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to add movie.");
        return data;
    },

    getAllMovies: async (): Promise<AdminMovieResponse[]> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/movies`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch movies.");
        return data as AdminMovieResponse[];
    },

    editMovie: async (movieId: number, request: AdminMovieRequest): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/movies/${movieId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update movie.");
        return data;
    },

    deleteMovie: async (movieId: number): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/movies/${movieId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to delete movie.");
        return data;
    }
};