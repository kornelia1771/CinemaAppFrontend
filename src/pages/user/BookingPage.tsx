import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, CircularProgress, IconButton, Snackbar, Alert, Divider } from '@mui/material';
import { ArrowLeft, Minus, Plus, MapPin, Wallet, Calendar, Clock, Users, UserCheck } from 'lucide-react';
import { colors } from '../../constants/theme';
import Header from '../../components/Header';
import { MovieApi, MovieDetailsResponse, ScreeningResponse } from '../../api/user/MovieApi';
import { TicketApi } from '../../api/user/TicketApi';

export default function BookingPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const screeningId = searchParams.get('screeningId');
    const urlDate = searchParams.get('date');
    const urlTime = searchParams.get('time');

    const [movieData, setMovieData] = useState<MovieDetailsResponse | null>(null);
    const [currentScreening, setCurrentScreening] = useState<ScreeningResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // States for backend error/success handling
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);

    const [numberOfPeople, setNumberOfPeople] = useState<number>(1);

    // Stan blokady przycisku na 5 sekund
    const [isReserving, setIsReserving] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        if (!movieId || !screeningId) {
            setApiError("Data error.");
            setLoading(false);
            return;
        }

        MovieApi.getMovieWithScreenings(movieId)
            .then((data) => {
                setMovieData(data);
                const screening = data.screenings.find(s => String(s.id) === String(screeningId));
                if (screening) setCurrentScreening(screening);
                else setApiError("Showtime not found.");
                setLoading(false);
            })
            .catch((err) => { setApiError(err.message); setLoading(false); });
    }, [movieId, screeningId, navigate]);

    const handleSignOut = () => { localStorage.removeItem('token'); navigate('/login'); };

    const handleConfirmReservation = async () => {
        if (!movieId || !screeningId || isReserving) return;

        // Natychmiastowe włączenie blokady
        setIsReserving(true);

        // Uruchomienie licznika 5 sekund, po którym przycisk zostanie odblokowany (np. w razie błędu)
        const cooldown = setTimeout(() => {
            setIsReserving(false);
        }, 5000);

        try {
            await TicketApi.reserveTickets({
                movieId: Number(movieId),
                screeningId: Number(screeningId),
                seatCounter: numberOfPeople
            });

            setApiSuccess("Reservation successful!");

            setTimeout(() => {
                clearTimeout(cooldown); // Czyszczenie timeoutu przed opuszczeniem strony
                navigate('/tickets');
            }, 2000);

        } catch (err: any) {
            setApiError(err.message || "Reservation failed.");
            // Nie wyłączamy tutaj `setIsReserving(false)`, dzięki czemu blokada trwa pełne 5 sekund z timeoutu
        }
    };

    if (loading) return <CircularProgress />;
    if (!movieData || !currentScreening) return <Typography color="error">{apiError}</Typography>;

    const ticketPrice = currentScreening.ticketPrice ? Number(currentScreening.ticketPrice) : 0;
    const totalSeats = currentScreening.totalSeats || 100;
    const freeSeats = currentScreening.freeSeats || 101;

    const maxPeople = Math.max(1, freeSeats);
    const totalCost = numberOfPeople * ticketPrice;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="CinemaApp" onSignOut={handleSignOut} />

            <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', textAlign: 'center', position: 'relative' }}>

                    <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', left: 16, top: 16, color: colors.black }} disabled={isReserving}>
                        <ArrowLeft size={20} />
                    </IconButton>

                    <Typography variant="h4" sx={{ fontWeight: '700', mb: 4, mt: 2 }}>{movieData.title}</Typography>

                    <Box sx={{
                        border: `1px solid ${colors.borderGrey || '#ddd'}`,
                        borderRadius: '8px',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        textAlign: 'left'
                    }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
                                <MapPin size={18} color={colors.darkgrey} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Hall</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: '600' }}>{currentScreening.hallName}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                <Wallet size={18} color={colors.darkgrey} />
                                <Box sx={{ textAlign: 'left', width: '90px' }}>
                                    <Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Price</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: '600' }}>{ticketPrice.toFixed(2)} PLN</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
                                <Calendar size={18} color={colors.darkgrey} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Date</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: '600' }}>{formatDate(urlDate || '')}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                <Users size={18} color={colors.darkgrey} />
                                <Box sx={{ textAlign: 'left', width: '90px' }}>
                                    <Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Total seats</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: '600' }}>{totalSeats}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
                                <Clock size={18} color={colors.darkgrey} />
                                <Box sx={{ textAlign: 'left', width: '90px' }}>
                                    <Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Time</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: '600' }}>{urlTime}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                <UserCheck size={18} color={colors.darkgrey} />
                                <Box sx={{ textAlign: 'left', width: '90px' }}>
                                    <Typography variant="caption" sx={{ color: colors.darkgrey, display: 'block' }}>Free seats</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: '600' }}>{freeSeats}</Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                            mt: 0
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setNumberOfPeople(p => Math.max(1, p - 1))}
                                    disabled={numberOfPeople <= 1 || isReserving}
                                    sx={{
                                        borderRadius: '8px', minWidth: '40px', height: '40px',
                                        color: colors.black, borderColor: colors.black,
                                        '&:hover': { borderColor: colors.darkgrey, backgroundColor: 'rgba(0,0,0,0.04)' },
                                        '&.Mui-disabled': { borderColor: '#ccc', color: '#ccc' }
                                    }}
                                >
                                    <Minus size={18} />
                                </Button>

                                <Box sx={{ textAlign: 'center', minWidth: '40px' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{numberOfPeople}</Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    onClick={() => setNumberOfPeople(p => Math.min(maxPeople, p + 1))}
                                    disabled={numberOfPeople >= maxPeople || isReserving}
                                    sx={{
                                        borderRadius: '8px', minWidth: '40px', height: '40px',
                                        color: colors.black, borderColor: colors.black,
                                        '&:hover': { borderColor: colors.darkgrey, backgroundColor: 'rgba(0,0,0,0.04)' },
                                        '&.Mui-disabled': { borderColor: '#ccc', color: '#ccc' }
                                    }}
                                >
                                    <Plus size={18} />
                                </Button>
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: colors.darkgrey, mb: 0.5 }}>
                                    {numberOfPeople} x {ticketPrice.toFixed(2)} PLN
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: '800' }}>
                                    Total: {totalCost.toFixed(2)} PLN
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        disabled={isReserving}
                        sx={{
                            backgroundColor: colors.black,
                            px: 4,
                            py: 1.5,
                            mt: 4,
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: '600',
                            width: '100%',
                            '&:hover': { backgroundColor: colors.darkgrey },
                            '&:disabled': {
                                backgroundColor: colors.darkgrey,
                                color: 'rgba(255, 255, 255, 0.7)',
                                cursor: 'not-allowed',
                                opacity: 0.6,
                                boxShadow: 'none'
                            }
                        }}
                        onClick={handleConfirmReservation}
                    >
                        {isReserving ? "Processing..." : "Confirm Reservation"}
                    </Button>
                </Paper>
            </Container>

            {/* Error Notification Toast */}
            <Snackbar
                open={apiError !== null}
                autoHideDuration={3000}
                onClose={() => setApiError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={() => setApiError(null)}
                    severity="error"
                    sx={{ width: '100%', borderRadius: '8px', fontWeight: '500' }}
                    elevation={6}
                    variant="filled"
                >
                    {apiError}
                </Alert>
            </Snackbar>

            {/* Success Notification Toast */}
            <Snackbar
                open={apiSuccess !== null}
                autoHideDuration={3000}
                onClose={() => setApiSuccess(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={() => setApiSuccess(null)}
                    severity="success"
                    sx={{ width: '100%', borderRadius: '8px', fontWeight: '500' }}
                    elevation={6}
                    variant="filled"
                >
                    {apiSuccess}
                </Alert>
            </Snackbar>
        </Box>
    );
}