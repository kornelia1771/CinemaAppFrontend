import { BASE_URL } from "../ApiHttp";

export interface AdminTicketRequest {
    seatCounter: number;
}

export interface AdminTicketResponse {
    id: number;
    userEmail: string;
    movieTitle: string;
    hallName: string;
    screeningTime: string;
    reservationTime: string;
    paymentTime: string;
    dateDuePay: string;
    status: string;
    seatCounter: number;
    ticketPrice: number;
    totalPrice: number;
}

export const AdminTicketsApi = {
    getAllTickets: async (): Promise<AdminTicketResponse[]> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/tickets`, {
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

        return data as AdminTicketResponse[];
    },

    editTicket: async (id: number, request: AdminTicketRequest): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/tickets/${id}`, {
            method: "PUT", // Zmieniono z PATCH na PUT
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update ticket.");
        }

        return data;
    },

    cancelTicket: async (id: number): Promise<any> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/admin/tickets/${id}/cancel`, {
            method: "PATCH",
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
    }
};