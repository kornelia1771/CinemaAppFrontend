import { BASE_URL } from "./ApiHttp";

export interface MovieResponse {
    id: number;
    title: string;
    duration: number;
    imageUrl: string | null;
}

// Odpowiednik Java: ScreeningResponse
export interface ScreeningResponse {
    id: number;
    hallName: string;
    totalSeats: number;
    screeningTime: string; // LocalDateTime przychodzi jako ISO String (np. "2026-06-18T18:00:00")
    ticketPrice: number;
}

// Odpowiednik Java: MovieDetailsResponse
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
        const response = await fetch(`${BASE_URL}/cinema/movies`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch movies.");
        return data as MovieResponse[];
    },

    // NOWA METODA: Pobieranie szczegółów wybranego filmu wraz z seansami
    // getMovieWithScreenings: async (movieId: string | number): Promise<MovieDetailsResponse> => {
    //     const token = localStorage.getItem("token");
    //     const response = await fetch(`${BASE_URL}/cinema/movies/${movieId}`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             ...(token ? { "Authorization": `Bearer ${token}` } : {})
    //         }
    //     });
    //     const data = await response.json();
    //     if (!response.ok) throw new Error(data.message || "Movie details loading failed.");
    //     return data as MovieDetailsResponse;
    // }

    getMovieWithScreenings: async (movieId: string | number): Promise<MovieDetailsResponse> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/cinema/movies/${movieId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });

        // 1. Jeśli status odpowiedzi NIE JEST OK (np. 404, 400, 500)
        if (!response.ok) {
            const contentType = response.headers.get("content-type");

            // Sprawdzamy, czy serwer zwrócił JSON, czy stronę HTML błędu
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Movie details loading failed.");
            } else {
                // Jeśli serwer rzucił surowym statusem 500 (HTML)
                throw new Error(`Server Error (Status ${response.status}). Zobacz logi backendu!`);
            }
        }

        // 2. Jeśli status jest OK (200), bezpiecznie parsujemy dane
        return await response.json() as MovieDetailsResponse;
    }
};