import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import { ArrowLeft, Armchair, CheckCircle } from 'lucide-react';
import { colors, fontSizes } from '../../constants/theme';
import Header from '../../components/Header';
import { MovieApi, MovieDetailsResponse, ScreeningResponse } from '../../api/MovieApi';

interface Seat {
    id: number;
    rowName: string;
    seatNumber: number;
    label: string;
}

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
    const [error, setError] = useState<string | null>(null);

    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!movieId || !screeningId) {
            setError("Missing movie or screening information.");
            setLoading(false);
            return;
        }

        MovieApi.getMovieWithScreenings(movieId)
            .then((data) => {
                setMovieData(data);

                const screening = data.screenings.find(s => String(s.id) === String(screeningId));
                if (screening) {
                    setCurrentScreening(screening);
                } else {
                    setError("Selected showtime not found.");
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Failed to load booking details.");
                setLoading(false);
            });
    }, [movieId, screeningId, navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress color="inherit" sx={{ color: colors.black }} />
            </Box>
        );
    }

    if (error || !movieData || !currentScreening) {
        return (
            <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header title="CinemaApp" onSignOut={handleSignOut} />
                <Container sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="error">{error || "Data error."}</Typography>
                    <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2, backgroundColor: colors.black }}>
                        Go Back
                    </Button>
                </Container>
            </Box>
        );
    }

    const totalSeats = currentScreening.totalSeats || 45;
    const seatsPerRow = 10;
    const seats: Seat[] = [];

    for (let i = 0; i < totalSeats; i++) {
        const seatNumber = i + 1;
        const rowIndex = Math.floor(i / seatsPerRow);
        const rowName = String.fromCharCode(65 + rowIndex);

        seats.push({
            id: seatNumber,
            rowName,
            seatNumber,
            label: `Row ${rowName} (#${seatNumber})`
        });
    }

    const rows: { [key: string]: Seat[] } = {};
    seats.forEach(seat => {
        if (!rows[seat.rowName]) {
            rows[seat.rowName] = [];
        }
        rows[seat.rowName].push(seat);
    });

    const handleSeatClick = (seat: Seat) => {
        const isAlreadySelected = selectedSeats.some(s => s.id === seat.id);
        if (isAlreadySelected) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const ticketPrice = currentScreening.ticketPrice ? Number(currentScreening.ticketPrice) : 0;
    const totalCost = selectedSeats.length * ticketPrice;

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="CinemaApp" onSignOut={handleSignOut} />

            <Container maxWidth="md" sx={{ mt: 6, mb: 4, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', position: 'relative', textAlign: 'center' }}>

                    {/* Przycisk powrotu */}
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            position: 'absolute',
                            left: '16px',
                            top: '16px',
                            color: colors.black,
                            '&:hover': { backgroundColor: colors.lightgrey }
                        }}
                    >
                        <ArrowLeft size={20} />
                    </IconButton>

                    {/* Nagłówek filmu */}
                    <Typography variant="h4" sx={{ fontWeight: '700', color: colors.black, mb: 2, mt: 2 }}>
                        {movieData.title}
                    </Typography>
                    {/* UKŁAD: Hall/Date/Seats po lewej, Price/Time na środku */}
                    {/* UKŁAD: Hall/Date/Seats po lewej, Price/Time na środku */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        mb: 4,
                        pl: { xs: 2, md: 4 }, // Margines lewy dla elementów po lewej
                        textAlign: 'left'
                    }}>
                        {/* Linia 1: Hall (lewo) i Price (środek) */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '40%' }}>
                                <Typography variant="body1" sx={{ color: colors.darkgrey, fontWeight: '500' }}>
                                    <strong>Hall:</strong> {currentScreening.hallName || 'Standard Hall'}
                                </Typography>
                            </Box>
                            <Box sx={{ width: '20%', textAlign: 'center' }}>
                                <Typography variant="body1" sx={{ color: colors.darkgrey, fontWeight: '500' }}>
                                    <strong>Price:</strong> {ticketPrice.toFixed(2)} PLN
                                </Typography>
                            </Box>
                        </Box>

                        {/* Linia 2: Date (lewo) i Time (środek) */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '40%' }}>
                                <Typography variant="body1" sx={{ color: colors.darkgrey, fontWeight: '500' }}>
                                    <strong>Date:</strong> {urlDate}
                                </Typography>
                            </Box>
                            <Box sx={{ width: '15%', textAlign: 'center' }}>
                                <Typography variant="body1" sx={{ color: colors.darkgrey, fontWeight: '500' }}>
                                    <strong>Time:</strong> {urlTime}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Linia 3: Total Seats (lewo) */}
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="body1" sx={{ color: colors.darkgrey, fontWeight: '500' }}>
                                <strong>Total seats:</strong> {totalSeats}
                            </Typography>
                        </Box>
                    </Box>

                    <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)', marginBottom: '32px' }} />

                    {/* WIZUALIZACJA SALI KINOWEJ */}
                    <Box sx={{ maxWidth: '640px', margin: '0 auto', p: 2 }}>

                        {/* EKRAN KINOWY */}
                        <Box sx={{ mb: 6, position: 'relative' }}>
                            <Box
                                sx={{
                                    height: '6px',
                                    backgroundColor: colors.darkgrey,
                                    borderRadius: '4px',
                                    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                                    width: '80%',
                                    margin: '0 auto'
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    textTransform: 'uppercase',
                                    letterSpacing: '3px',
                                    fontWeight: '700',
                                    color: colors.darkgrey,
                                    mt: 1
                                }}
                            >
                                SCREEN / EKRAN
                            </Typography>
                        </Box>

                        {/* RZĘDY I MIEJSCA */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', mb: 5 }}>
                            {Object.keys(rows).map((rowName) => (
                                <Box key={rowName} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>

                                    <Typography variant="body2" sx={{ fontWeight: '700', width: '20px', color: colors.darkgrey }}>
                                        {rowName}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: '6px' }}>
                                        {rows[rowName].map((seat) => {
                                            const isSelected = selectedSeats.some(s => s.id === seat.id);
                                            return (
                                                <Box
                                                    key={seat.id}
                                                    onClick={() => handleSeatClick(seat)}
                                                    sx={{
                                                        width: '42px',
                                                        height: '38px',
                                                        borderRadius: '6px',
                                                        backgroundColor: isSelected ? colors.black : '#fff',
                                                        color: isSelected ? colors.white : colors.black,
                                                        border: `1px solid ${colors.black}`,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        userSelect: 'none',
                                                        transition: 'all 0.15s ease-in-out',
                                                        boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.3)' : 'none',
                                                        '&:hover': {
                                                            backgroundColor: isSelected ? colors.darkgrey : 'rgba(0,0,0,0.05)',
                                                            transform: 'scale(1.05)'
                                                        }
                                                    }}
                                                >
                                                    {seat.seatNumber}
                                                </Box>
                                            );
                                        })}
                                    </Box>

                                    <Typography variant="body2" sx={{ fontWeight: '700', width: '20px', color: colors.darkgrey }}>
                                        {rowName}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                    </Box>

                    {/* SEKCJA PODSUMOWANIA - WYŚWIETLA SIĘ TYLKO GDY WYBRANO COŚ */}
                    {selectedSeats.length > 0 && (
                        <Box>
                            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)', marginTop: '32px', marginBottom: '32px' }} />

                            <Box sx={{ textBreak: 'break-word', textAlign: 'center' }}>
                                {/* Wyświetlanie samych boksów z wybranymi miejscami */}
                                <Box sx={{ mb: 2 }}>
                                    {selectedSeats.map(s => (
                                        <Box
                                            component="span"
                                            key={s.id}
                                            sx={{
                                                display: 'inline-block',
                                                backgroundColor: 'rgba(0,0,0,0.06)',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontWeight: '700',
                                                mx: '4px',
                                                my: '4px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {s.label}
                                        </Box>
                                    ))}
                                </Box>

                                {/* Zapis typu: Ilość x Cena */}
                                <Typography variant="body1" sx={{ color: colors.darkgrey, fontWeight: '600', mb: 1 }}>
                                    {selectedSeats.length} x {ticketPrice.toFixed(2)} PLN
                                </Typography>

                                {/* Cena końcowa */}
                                <Typography variant="h5" sx={{ fontWeight: '800', color: colors.black, mb: 3 }}>
                                    Total Price: {totalCost.toFixed(2)} PLN
                                </Typography>

                                <Button
                                    variant="contained"
                                    startIcon={<CheckCircle size={18} />}
                                    sx={{
                                        backgroundColor: colors.black,
                                        color: colors.white,
                                        padding: '12px 36px',
                                        fontWeight: '700',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        '&:hover': {
                                            backgroundColor: colors.darkgrey,
                                        }
                                    }}
                                    onClick={() => alert(`Reserved seats: ${selectedSeats.map(s => s.label).join(', ')}`)}
                                >
                                    Confirm Reservation
                                </Button>
                            </Box>
                        </Box>
                    )}

                </Paper>
            </Container>
        </Box>
    );
}