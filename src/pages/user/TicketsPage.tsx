import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Paper, Typography, CircularProgress, Alert, Chip, Divider,
    Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Ticket, MapPin, Users, Calendar, Wallet, Clock } from 'lucide-react';
import { colors, fontSizes } from '../../constants/theme';
import Header from '../../components/Header';
import { TicketApi, TicketResponse } from '../../api/TicketApi';

export default function TicketsPage() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<TicketResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // States for backend error/success handling
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);

    // States for cancel dialog
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [ticketToCancel, setTicketToCancel] = useState<TicketResponse | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchTickets = async () => {
            try {
                const data = await TicketApi.getUserTickets();
                setTickets(data);
            } catch (err: any) {
                setError(err.message || "Failed to load tickets.");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatOnlyDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const formatOnlyTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'UNPAID': return 'warning';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const sortedTickets = [...tickets].sort((a, b) => {
        const isBottomA =
            a.status === 'CANCELLED' ||
            new Date(a.screeningTime) < fourHoursAgo;

        const isBottomB =
            b.status === 'CANCELLED' ||
            new Date(b.screeningTime) < fourHoursAgo;

        if (isBottomA && !isBottomB) return 1;
        if (!isBottomA && isBottomB) return -1;

        // sortowanie po dacie utworzenia biletu
        return (
            new Date(b.reservationTime).getTime() -
            new Date(a.reservationTime).getTime()
        );
    });

    const handlePay = async (ticketId: number) => {
        try {
            await TicketApi.payForTicket(ticketId);
            setApiSuccess("Payment successful!");
            const data = await TicketApi.getUserTickets();
            setTickets(data);
        } catch (err: any) {
            setApiError(err.message || "Payment failed.");
        }
    };

    const handleDownloadPdf = async (ticketId: number) => {
        try {
            await TicketApi.downloadTicketPdf(ticketId);
            setApiSuccess("PDF downloaded successfully!");
        } catch (err: any) {
            setApiError(err.message || "Failed to download PDF.");
        }
    };

    // Obsługa otwierania/zamykania/akceptacji modala anulowania
    const handleOpenCancelDialog = (ticket: TicketResponse) => {
        setTicketToCancel(ticket);
        setCancelModalOpen(true);
    };

    const handleCloseCancelDialog = () => {
        setCancelModalOpen(false);
        setTicketToCancel(null);
    };

    const handleConfirmCancel = async () => {
        if (!ticketToCancel) return;
        try {
            await TicketApi.cancelTicket(ticketToCancel.id);
            setApiSuccess("Ticket cancelled successfully!");
            const data = await TicketApi.getUserTickets();
            setTickets(data);
        } catch (err: any) {
            setApiError(err.message || "Failed to cancel ticket.");
        } finally {
            handleCloseCancelDialog();
        }
    };

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="CinemaApp" onSignOut={handleSignOut} />

            <Container maxWidth="md" sx={{ mt: 6, mb: 4, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>

                    <Typography variant="h5" sx={{ fontWeight: '700', mb: 3, color: colors.black, textAlign: 'center' }}>
                        My Tickets
                    </Typography>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress color="inherit" sx={{ color: colors.black }} />
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 4, borderRadius: '8px' }}>
                            {error}
                        </Alert>
                    )}

                    {!loading && !error && tickets.length === 0 && (
                        <Typography variant="body1" sx={{ color: colors.darkgrey, textAlign: 'center', my: 4 }}>
                            You don't have any tickets yet.
                        </Typography>
                    )}

                    {!loading && !error && sortedTickets.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {sortedTickets.map((ticket) => (
                                <Box
                                    key={ticket.id}
                                    sx={{
                                        border: `1px solid ${colors.borderGrey || '#ddd'}`,
                                        borderRadius: '8px',
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="h6" sx={{ fontWeight: '700', color: colors.black }}>
                                            {ticket.movieTitle}
                                        </Typography>
                                        <Chip
                                            label={ticket.status}
                                            color={getStatusColor(ticket.status) as any}
                                            size="small"
                                            sx={{ fontWeight: 'bold', borderRadius: '6px' }}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={18} color={colors.darkgrey} />
                                            <Box><Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Hall</Typography><Typography variant="body2" sx={{ fontWeight: '600' }}>{ticket.hallName}</Typography></Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Users size={18} color={colors.darkgrey} />
                                            <Box><Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Seats</Typography><Typography variant="body2" sx={{ fontWeight: '600' }}>{ticket.seatCounter}x</Typography></Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Calendar size={18} color={colors.darkgrey} />
                                            <Box><Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Date</Typography><Typography variant="body2" sx={{ fontWeight: '600' }}>{formatOnlyDate(ticket.screeningTime)}</Typography></Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Ticket size={18} color={colors.darkgrey} />
                                            <Box><Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Single Ticket Price</Typography><Typography variant="body2" sx={{ fontWeight: '700' }}>{Number(ticket.ticketPrice).toFixed(2)} PLN</Typography></Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={18} color={colors.darkgrey} />
                                            <Box><Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Time</Typography><Typography variant="body2" sx={{ fontWeight: '600' }}>{formatOnlyTime(ticket.screeningTime)}</Typography></Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Wallet size={18} color={colors.darkgrey} />
                                            <Box><Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Total Price</Typography><Typography variant="body2" sx={{ fontWeight: '700' }}>{Number(ticket.totalPrice).toFixed(2)} PLN</Typography></Box>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ mt: 1 }} />

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                        {/* Informacje tekstowe po lewej */}
                                        <Box>
                                            {ticket.status === 'UNPAID' ? (
                                                <Typography variant="caption" sx={{ color: colors.darkgrey, fontStyle: 'italic' }}>
                                                    Please pay by: {formatOnlyTime(ticket.dateDuePay)}, {formatOnlyDate(ticket.dateDuePay)} or the reservation will be cancelled.
                                                </Typography>
                                            ) : ticket.status === 'PAID' ? (
                                                <Typography variant="caption" sx={{ color: colors.darkgrey, fontStyle: 'italic' }}>
                                                    Paid: {ticket.paymentTime ? `${formatOnlyTime(ticket.paymentTime)}, ${formatOnlyDate(ticket.paymentTime)}` : 'N/A'}
                                                </Typography>
                                            ) : null}
                                        </Box>

                                        {/* Przyciski po prawej (Flex do ułożenia Cancel i Pay/PDF) */}
                                        <Box sx={{ display: 'flex', gap: '8px' }}>
                                            {ticket.status !== 'CANCELLED' && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleOpenCancelDialog(ticket)}
                                                    sx={{
                                                        borderColor: colors.red || '#d32f2f',
                                                        color: colors.red || '#d32f2f',
                                                        px: 3, py: 1, borderRadius: '8px',
                                                        '&:hover': { borderColor: '#b71c1c', backgroundColor: 'rgba(211, 47, 47, 0.04)' }
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            )}

                                            {ticket.status === 'UNPAID' ? (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handlePay(ticket.id)}
                                                    sx={{
                                                        backgroundColor: colors.black,
                                                        px: 4, py: 1, borderRadius: '8px',
                                                        '&:hover': { backgroundColor: colors.darkgrey }
                                                    }}
                                                >
                                                    Pay
                                                </Button>
                                            ) : ticket.status === 'PAID' ? (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleDownloadPdf(ticket.id)}
                                                    sx={{
                                                        borderColor: colors.black,
                                                        color: colors.black,
                                                        px: 4, py: 1, borderRadius: '8px',
                                                        '&:hover': { borderColor: colors.darkgrey, backgroundColor: 'rgba(0,0,0,0.04)' }
                                                    }}
                                                >
                                                    PDF
                                                </Button>
                                            ) : null}
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Paper>
            </Container>

            {/* Cancel Modal with styling from Profile page */}
            <Dialog
                open={cancelModalOpen}
                onClose={handleCloseCancelDialog}
                fullWidth
                maxWidth="xs"
                PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: '700', color: colors.black }}>
                    Cancel Ticket
                </DialogTitle>
                <DialogContent sx={{ pt: '12px !important' }}>
                    {ticketToCancel && (
                        <Typography variant="body1" sx={{ color: colors.black }}>
                            Are you sure you want to cancel ticket for <strong>{ticketToCancel.movieTitle}</strong> at <strong>{formatOnlyDate(ticketToCancel.screeningTime)}</strong> and <strong>{formatOnlyTime(ticketToCancel.screeningTime)}</strong> for <strong>{ticketToCancel.seatCounter}</strong> seats?
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', width: '100%', gap: '12px' }}>
                        <Button
                            onClick={handleCloseCancelDialog}
                            sx={{
                                flex: 1,
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                borderColor: colors.black,
                                color: colors.black,
                                fontSize: fontSizes?.medium || '1rem',
                                fontWeight: '600',
                                '&:hover': {
                                    borderColor: colors.darkgrey,
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                }
                            }}
                            variant="outlined"
                        >
                            No
                        </Button>
                        <Button
                            onClick={handleConfirmCancel}
                            sx={{
                                flex: 1,
                                backgroundColor: colors.black,
                                color: colors.white,
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)',
                                fontSize: fontSizes?.medium || '1rem',
                                fontWeight: '600',
                                '&:hover': {
                                    backgroundColor: colors.darkgrey,
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)'
                                }
                            }}
                            variant="contained"
                        >
                            Yes
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* Error Snackbar */}
            <Snackbar open={apiError !== null} autoHideDuration={3000} onClose={() => setApiError(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <Alert onClose={() => setApiError(null)} severity="error" sx={{ width: '100%', borderRadius: '8px', fontWeight: '500' }} elevation={6} variant="filled">{apiError}</Alert>
            </Snackbar>

            {/* Success Snackbar */}
            <Snackbar open={apiSuccess !== null} autoHideDuration={3000} onClose={() => setApiSuccess(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <Alert onClose={() => setApiSuccess(null)} severity="success" sx={{ width: '100%', borderRadius: '8px', fontWeight: '500' }} elevation={6} variant="filled">{apiSuccess}</Alert>
            </Snackbar>
        </Box>
    );
}