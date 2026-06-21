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
    },

    payForTicket: async (ticketId: number): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/tickets/${ticketId}/pay`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Payment failed.");
        }

        return data;
    },

    // wewnątrz TicketApi
    downloadTicketPdf: async (ticketId: number) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/tickets/${ticketId}/pdf`, {
            method: "GET",
            headers: {
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Failed to download PDF" }));
            throw new Error(errorData.message || "Failed to download PDF");
        }

        // Pobranie pliku jako Blob
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bilet_${ticketId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    },

    cancelTicket: async (ticketId: number): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/tickets/${ticketId}/cancel`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to cancel ticket.");
        }

        return data;
    },



};