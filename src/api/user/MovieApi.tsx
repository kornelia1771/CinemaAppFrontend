import {BASE_URL} from "../ApiHttp";

export interface MovieResponse {
    id: number;
    title: string;
    duration: number;
    imageUrl: string | null;
}

export interface ScreeningResponse {
    id: number;
    hallName: string;
    totalSeats: number;
    freeSeats: number;
    takenSeats: number;
    screeningTime: string;
    ticketPrice: number;
}

export interface MovieDetailsResponse {
    id: number;
    title: string;
    description: string;
    duration: number;
    imageUrl: string | null;
    screenings: ScreeningResponse[];
}

export const MovieApi = {
    getAllMovies: async (): Promise<MovieResponse[]> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/movies`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch movies.");
        return data as MovieResponse[];
    },

    getMovieWithScreenings: async (movieId: string | number): Promise<MovieDetailsResponse> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/movies/${movieId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {})
            }
        });
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Movie details loading failed.");
            } else {
                throw new Error(`Server Error (Status ${response.status}).`);
            }
        }

        return await response.json() as MovieDetailsResponse;
    }
};