import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Container, Paper, Typography, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Snackbar, Alert,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import { Pencil, Ban } from "lucide-react";
import HeaderAdmin from "../../components/HeaderAdmin";
import { colors } from "../../constants/theme";
import { AdminTicketsApi, AdminTicketResponse, AdminTicketRequest } from "../../api/admin/AdminTicketsApi";

export default function AdminTicketsPage() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState<AdminTicketResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);

    // Stany Modali
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [ticketToCancel, setTicketToCancel] = useState<AdminTicketResponse | null>(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [ticketToEdit, setTicketToEdit] = useState<AdminTicketResponse | null>(null);

    // Formularz zawierający wyłącznie pole obsługiwane przez backend przy edycji
    const [editForm, setEditForm] = useState<AdminTicketRequest>({
        seatCounter: 1
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        fetchTickets();
    }, [navigate]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await AdminTicketsApi.getAllTickets();
            setTickets(data);
        } catch (err: any) {
            setApiError(err.message || "Failed to load tickets.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // --- CANCEL LOGIC ---
    const handleOpenCancel = (ticket: AdminTicketResponse) => {
        setTicketToCancel(ticket);
        setCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!ticketToCancel) return;
        try {
            await AdminTicketsApi.cancelTicket(ticketToCancel.id);
            setApiSuccess("Ticket cancelled successfully.");
            fetchTickets();
        } catch (err: any) {
            setApiError(err.message || "Failed to cancel ticket.");
        } finally {
            setCancelModalOpen(false);
            setTicketToCancel(null);
        }
    };

    // --- EDIT LOGIC ---
    const handleOpenEdit = (ticket: AdminTicketResponse) => {
        if (ticket.status === 'CANCELLED') {
            setApiError("Cannot edit a cancelled ticket.");
            return;
        }
        setTicketToEdit(ticket);
        setEditForm({
            seatCounter: ticket.seatCounter
        });
        setEditModalOpen(true);
    };

    const handleConfirmEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketToEdit) return;
        try {
            await AdminTicketsApi.editTicket(ticketToEdit.id, {
                seatCounter: Number(editForm.seatCounter)
            });
            setApiSuccess("Ticket updated successfully.");
            fetchTickets();
            setEditModalOpen(false);
        } catch (err: any) {
            setApiError(err.message || "Failed to update ticket.");
        }
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleString("en-GB", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PAID': return 'success';
            case 'CANCELLED': return 'error';
            case 'UNPAID': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <HeaderAdmin title="CinemaApp - Admin" onSignOut={handleSignOut} />

            <Container maxWidth="lg" sx={{ mt: 6, mb: 4, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.black }}>
                            Tickets Management
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                            <CircularProgress sx={{ color: colors.black }} />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.borderGrey || "#ddd"}`, borderRadius: "8px" }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>User Email</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Movie & Hall</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Screening Time</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Seats</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Single Price</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Total Price</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {tickets.map((ticket) => (
                                        <TableRow key={ticket.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "& td": { verticalAlign: "middle" } }}>
                                            <TableCell>#{ticket.id}</TableCell>
                                            <TableCell>{ticket.userEmail}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>{ticket.movieTitle}</Typography>
                                                <Typography variant="caption" color="textSecondary">{ticket.hallName}</Typography>
                                            </TableCell>
                                            <TableCell>{formatDateTime(ticket.screeningTime)}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>{ticket.seatCounter}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                {Number(ticket.ticketPrice).toFixed(2)} PLN
                                            </TableCell>
                                            <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                                                {Number(ticket.totalPrice).toFixed(2)} PLN
                                            </TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                <Chip
                                                    label={ticket.status}
                                                    color={getStatusColor(ticket.status)}
                                                    size="small"
                                                    sx={{ fontWeight: "bold", borderRadius: "6px" }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                {ticket.status !== 'CANCELLED' ? (
                                                    <>
                                                        <IconButton
                                                            onClick={() => handleOpenEdit(ticket)}
                                                            sx={{ color: colors.darkgrey, "&:hover": { color: colors.black } }}
                                                        >
                                                            <Pencil size={18} />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleOpenCancel(ticket)}
                                                            sx={{ color: colors.red || "#d32f2f", "&:hover": { color: "#b71c1c" } }}
                                                        >
                                                            <Ban size={18} />
                                                        </IconButton>
                                                    </>
                                                ) : (
                                                    <Typography variant="caption" color="textSecondary">-</Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {tickets.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9} sx={{ textAlign: "center", py: 3, color: colors.darkgrey }}>
                                                No tickets found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>

            {/* --- EDIT TICKET MODAL --- */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
                {editModalOpen && (
                    <form onSubmit={handleConfirmEdit}>
                        <DialogTitle sx={{ fontWeight: '700', color: colors.black }}>Edit Ticket #{ticketToEdit?.id}</DialogTitle>
                        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px', pt: '12px !important' }}>

                            <Typography variant="body2" color="textSecondary">
                                You are changing the number of seats for this ticket. The system will automatically recalculate the total price and update availability in the cinema hall.
                            </Typography>

                            <TextField
                                label="Seat Counter"
                                type="number"
                                required
                                fullWidth
                                inputProps={{ min: 1 }}
                                value={editForm.seatCounter}
                                onChange={(e) => setEditForm({ seatCounter: Number(e.target.value) })}
                            />

                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
                            <Box sx={{ display: 'flex', width: '100%', gap: '12px' }}>
                                <Button onClick={() => setEditModalOpen(false)} variant="outlined" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', borderColor: colors.black, color: colors.black, fontWeight: '600', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>Cancel</Button>
                                <Button type="submit" variant="contained" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', backgroundColor: colors.black, color: 'white', fontWeight: '600', '&:hover': { backgroundColor: colors.darkgrey } }}>Save</Button>
                            </Box>
                        </DialogActions>
                    </form>
                )}
            </Dialog>

            {/* --- CANCEL TICKET MODAL --- */}
            <Dialog open={cancelModalOpen} onClose={() => setCancelModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
                <DialogTitle sx={{ fontWeight: '700', color: colors.black }}>Cancel Ticket</DialogTitle>
                <DialogContent sx={{ pt: '12px !important' }}>
                    <Typography variant="body1" sx={{ color: colors.black }}>
                        Are you sure you want to cancel ticket #{ticketToCancel?.id} for user {ticketToCancel?.userEmail}?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', width: '100%', gap: '12px' }}>
                        {/* Zmiana tekstu na "No" */}
                        <Button onClick={() => setCancelModalOpen(false)} variant="outlined" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', borderColor: colors.black, color: colors.black, fontWeight: '600', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>
                            No
                        </Button>
                        {/* Zmiana tekstu na "Yes" oraz koloru na czarny */}
                        <Button onClick={handleConfirmCancel} variant="contained" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', backgroundColor: colors.black, color: 'white', fontWeight: '600', '&:hover': { backgroundColor: colors.darkgrey } }}>
                            Yes
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* Snackbars */}
            <Snackbar open={apiError !== null} autoHideDuration={4000} onClose={() => setApiError(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={() => setApiError(null)} severity="error" variant="filled" sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}>
                    {apiError}
                </Alert>
            </Snackbar>

            <Snackbar open={apiSuccess !== null} autoHideDuration={4000} onClose={() => setApiSuccess(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={() => setApiSuccess(null)} severity="success" variant="filled" sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}>
                    {apiSuccess}
                </Alert>
            </Snackbar>
        </Box>
    );
}