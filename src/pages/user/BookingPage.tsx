import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, CircularProgress, IconButton, Snackbar, Alert } from '@mui/material';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { colors } from '../../constants/theme';
import Header from '../../components/Header';
import { MovieApi, MovieDetailsResponse, ScreeningResponse } from '../../api/MovieApi';
import { TicketApi } from '../../api/TicketApi';

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
        if (!movieId || !screeningId) return;

        try {
            await TicketApi.reserveTickets({
                movieId: Number(movieId),
                screeningId: Number(screeningId),
                seatCounter: numberOfPeople
            });

            // Set success message and redirect after delay
            setApiSuccess("Reservation successful!");
            setTimeout(() => {
                navigate('/tickets');
            }, 2000);

        } catch (err: any) {
            // Replicate LoginPage's error handling by saving message to apiError state
            setApiError(err.message || "Reservation failed.");
        }
    };

    if (loading) return <CircularProgress />;
    if (!movieData || !currentScreening) return <Typography color="error">{apiError}</Typography>;

    const ticketPrice = currentScreening.ticketPrice ? Number(currentScreening.ticketPrice) : 0;
    const totalSeats = currentScreening.totalSeats || 100;
    const freeSeats = currentScreening.freeSeats || 101;

    const maxPeople = Math.max(1, freeSeats);
    const totalCost = numberOfPeople * ticketPrice;

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="CinemaApp" onSignOut={handleSignOut} />

            <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', textAlign: 'center', position: 'relative' }}>

                    <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', left: 16, top: 16, color: colors.black }}>
                        <ArrowLeft size={20} />
                    </IconButton>

                    <Typography variant="h4" sx={{ fontWeight: '700', mb: 4, mt: 2 }}>{movieData.title}</Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: 3, textAlign: 'left' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1"><strong>Hall:</strong> {currentScreening.hallName}</Typography>
                            <Typography variant="body1"><strong>Price:</strong> {ticketPrice.toFixed(2)} PLN</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1"><strong>Date:</strong> {urlDate}</Typography>
                            <Typography variant="body1"><strong>Time:</strong> {urlTime}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1"><strong>Total seats:</strong> {totalSeats}</Typography>
                            <Typography variant="body1"><strong>Free seats:</strong> {freeSeats}</Typography>
                        </Box>
                    </Box>

                    <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #eee' }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, my: 4 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setNumberOfPeople(p => Math.max(1, p - 1))}
                            disabled={numberOfPeople <= 1}
                            sx={{
                                borderRadius: '8px', minWidth: '48px', height: '48px',
                                color: colors.black, borderColor: colors.black,
                                '&:hover': { borderColor: colors.darkgrey, backgroundColor: 'rgba(0,0,0,0.04)' },
                                '&.Mui-disabled': { borderColor: '#ccc', color: '#ccc' }
                            }}
                        >
                            <Minus size={20} />
                        </Button>

                        <Box sx={{ textAlign: 'center', minWidth: '80px' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{numberOfPeople}</Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            onClick={() => setNumberOfPeople(p => Math.min(maxPeople, p + 1))}
                            disabled={numberOfPeople >= maxPeople}
                            sx={{
                                borderRadius: '8px', minWidth: '48px', height: '48px',
                                color: colors.black, borderColor: colors.black,
                                '&:hover': { borderColor: colors.darkgrey, backgroundColor: 'rgba(0,0,0,0.04)' },
                                '&.Mui-disabled': { borderColor: '#ccc', color: '#ccc' }
                            }}
                        >
                            <Plus size={20} />
                        </Button>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" sx={{ color: colors.darkgrey, mb: 1 }}>
                            {numberOfPeople} x {ticketPrice.toFixed(2)} PLN
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: '800' }}>
                            Total Price: {totalCost.toFixed(2)} PLN
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: colors.black, px: 4, py: 1.5, borderRadius: '8px',
                            '&:hover': { backgroundColor: colors.darkgrey }
                        }}
                        onClick={handleConfirmReservation}
                    >
                        Confirm Reservation
                    </Button>
                </Paper>
            </Container>

            {/* Error Notification Toast matching LoginPage */}
            <Snackbar
                open={apiError !== null}
                autoHideDuration={6000}
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
                autoHideDuration={6000}
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