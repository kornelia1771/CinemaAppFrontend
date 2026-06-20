import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, CircularProgress, Alert, Chip, Divider, Button, Snackbar } from '@mui/material';
import { Ticket, MapPin, Users, Calendar, Wallet, Clock } from 'lucide-react';
import { colors } from '../../constants/theme';
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
        const timeA = new Date(a.screeningTime).getTime();
        const timeB = new Date(b.screeningTime).getTime();

        const isPastA = new Date(a.screeningTime) < fourHoursAgo || a.status === 'CANCELLED';
        const isPastB = new Date(b.screeningTime) < fourHoursAgo || b.status === 'CANCELLED';

        if (isPastA && !isPastB) return 1;
        if (!isPastA && isPastB) return -1;
        return timeB - timeA;
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
                                            sx={{ fontWeight: 'bold', borderRadius: '0px' }}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        {/* Details grid content remains identical as requested */}
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
                                        {/* Wyświetlanie informacji o płatności w zależności od statusu */}
                                        {ticket.status === 'UNPAID' ? (
                                            <Typography variant="caption" sx={{ color: colors.darkgrey, fontStyle: 'italic' }}>
                                                Please pay by: {formatOnlyTime(ticket.dateDuePay)}, {formatOnlyDate(ticket.dateDuePay)} or the reservation will be cancelled.
                                            </Typography>
                                        ) : ticket.status === 'PAID' ? (
                                            <Typography variant="caption" sx={{ color: colors.darkgrey, fontStyle: 'italic' }}>
                                                Paid: {ticket.paymentTime ? `${formatOnlyTime(ticket.paymentTime)}, ${formatOnlyDate(ticket.paymentTime)}` : 'N/A'}
                                            </Typography>
                                        ) : (
                                            <Box /> // Pusty box, jeśli bilet jest np. CANCELLED
                                        )}

                                        {/* Wyświetlanie odpowiedniego przycisku */}
                                        {ticket.status === 'UNPAID' ? (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handlePay(ticket.id)}
                                                sx={{
                                                    backgroundColor: colors.black,
                                                    px: 4, py: 1, borderRadius: '8px', ml: 2,
                                                    '&:hover': { backgroundColor: colors.darkgrey }
                                                }}
                                            >
                                                Pay
                                            </Button>
                                        ) : ticket.status === 'PAID' ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                // Tutaj dodaj obsługę pobierania PDF, np. onClick={() => downloadPdf(ticket.id)}
                                                sx={{
                                                    borderColor: colors.black,
                                                    color: colors.black,
                                                    px: 4, py: 1, borderRadius: '8px', ml: 2,
                                                    '&:hover': { borderColor: colors.darkgrey, backgroundColor: 'rgba(0,0,0,0.04)' }
                                                }}
                                            >
                                                PDF
                                            </Button>
                                        ) : null}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Paper>
            </Container>

            <Snackbar open={apiError !== null} autoHideDuration={3000} onClose={() => setApiError(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <Alert onClose={() => setApiError(null)} severity="error" sx={{ width: '100%', borderRadius: '8px', fontWeight: '500' }} elevation={6} variant="filled">{apiError}</Alert>
            </Snackbar>

            <Snackbar open={apiSuccess !== null} autoHideDuration={3000} onClose={() => setApiSuccess(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <Alert onClose={() => setApiSuccess(null)} severity="success" sx={{ width: '100%', borderRadius: '8px', fontWeight: '500' }} elevation={6} variant="filled">{apiSuccess}</Alert>
            </Snackbar>
        </Box>
    );
}