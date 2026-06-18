import {BASE_URL} from "./ApiHttp";

export interface MovieResponse {
    id: number;
    title: string;
    duration: number;
    imageUrl: string | null;
}

export const MovieApi = {
    getAllMovies: async (): Promise<MovieResponse[]> => {
        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/cinema/movies`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Przekazujemy token JWT w nagłówku, jeśli Spring Security tego wymaga
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // Mapowanie błędu MessageResponse.builder().message(e.getMessage()) z Twojego backendu
            throw new Error(data.message || "Failed to fetch movies.");
        }

        return data as MovieResponse[];
    }
};