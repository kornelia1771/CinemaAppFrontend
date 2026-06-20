import { BASE_URL } from "./ApiHttp";

export interface TicketReservationRequest {
    movieId: number;
    screeningId: number;
    seatCounter: number;
}

export const TicketApi = {
    reserveTickets: async (request: TicketReservationRequest): Promise<string> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/tickets/reserve`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to reserve tickets.");
        }

        return data.message;
    }
};