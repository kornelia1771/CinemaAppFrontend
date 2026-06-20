import { BASE_URL } from "./ApiHttp";

export interface TicketReservationRequest {
    movieId: number;
    screeningId: number;
    seatCounter: number;
}

export interface TicketResponse {
    id: number;
    movieTitle: string;
    hallName: string;
    screeningTime: string;
    reservationTime: string;
    paymentTime: string | null;
    dateDuePay: string;
    status: string;
    seatCounter: number;
    ticketPrice: number;
    totalPrice: number;
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
    },

    // NOWA METODA: Pobieranie biletów użytkownika
    getUserTickets: async (): Promise<TicketResponse[]> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/tickets`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch tickets.");
        }

        return data as TicketResponse[];
    }
};