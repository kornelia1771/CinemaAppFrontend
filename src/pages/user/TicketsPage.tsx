import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, CircularProgress, Alert, Chip, Divider } from '@mui/material';
import {Ticket, CalendarDays, MapPin, Users, Calendar, Wallet} from 'lucide-react';
import { colors } from '../../constants/theme';
import Header from '../../components/Header';
import { TicketApi, TicketResponse } from '../../api/TicketApi';

export default function TicketsPage() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<TicketResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Pomocnicza funkcja do formatowania daty "yyyy-MM-dd'T'HH:mm:ss" na czytelniejszą
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Helper do stylowania statusu biletu
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'UNPAID': return 'warning';
            case 'CANCELLED': return 'error';
            default: return 'default';
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

                    {/* Lista biletów */}
                    {!loading && !error && tickets.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {tickets.map((ticket) => (
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
                                    {/* Nagłówek biletu: Tytuł i Status */}
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

                                    {/* Szczegóły seansu */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                                        {/* Data i czas */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Calendar size={18} color={colors.darkgrey} />
                                            <Box>
                                                <Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Date & Time</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: '600' }}>{formatDate(ticket.screeningTime)}</Typography>
                                            </Box>
                                        </Box>

                                        {/* Sala */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={18} color={colors.darkgrey} />
                                            <Box>
                                                <Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Hall</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: '600' }}>{ticket.hallName}</Typography>
                                            </Box>
                                        </Box>

                                        {/* Liczba miejsc */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Users size={18} color={colors.darkgrey} />
                                            <Box>
                                                <Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Seats</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: '600' }}>{ticket.seatCounter}x</Typography>
                                            </Box>
                                        </Box>

                                        {/* Cena końcowa */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Wallet size={18} color={colors.darkgrey} />
                                            <Box>
                                                <Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Total Price</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: '700' }}>{Number(ticket.totalPrice).toFixed(2)} PLN</Typography>
                                            </Box>
                                        </Box>

                                    </Box>

                                    {/* Informacja o czasie zapłaty dla nieopłaconych biletów */}
                                    {ticket.status === 'UNPAID' && (
                                        <Typography variant="caption" sx={{ color: colors.darkgrey, mt: 1, fontStyle: 'italic' }}>
                                            Please pay by: {formatDate(ticket.dateDuePay)} or the reservation will be cancelled.
                                        </Typography>
                                    )}

                                </Box>
                            ))}
                        </Box>
                    )}

                </Paper>
            </Container>
        </Box>
    );
}