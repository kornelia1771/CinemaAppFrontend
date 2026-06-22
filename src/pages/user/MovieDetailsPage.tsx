import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import { Clock, ArrowLeft, Calendar } from 'lucide-react';
import { colors, fontSizes } from '../../constants/theme';
import Header from '../../components/Header';
import { MovieApi, MovieDetailsResponse, ScreeningResponse } from '../../api/user/MovieApi';

interface GroupedScreenings {
    [dateKey: string]: {
        label: string;
        screenings: ScreeningResponse[];
    };
}

// Funkcja pomocnicza: Bezpiecznie zamienia format z backendu (String lub Tablica numerów) na obiekt Date
const parseBackendDate = (screeningTime: any): Date => {
    if (!screeningTime) return new Date();

    // Jeśli backend wysłał tablicę [2026, 6, 20, 14, 0] zamiast Stringa
    if (Array.isArray(screeningTime)) {
        const [year, month, day, hour, minute, second] = screeningTime;
        // W JS miesiące są indeksowane od 0 (styczeń = 0, czerwiec = 5)
        return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
    }

    // Jeśli to jest prawidłowy String "2026-06-20T14:00:00"
    return new Date(screeningTime);
};

export default function MovieDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dateInputRef = useRef<HTMLInputElement>(null);

    const [movieData, setMovieData] = useState<MovieDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [groupedScreenings, setGroupedScreenings] = useState<GroupedScreenings>({});
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!id) return;

        MovieApi.getMovieWithScreenings(id)
            .then((data) => {
                setMovieData(data);
                processScreenings(data.screenings);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Something went wrong.");
                setLoading(false);
            });
    }, [id, navigate]);

    const processScreenings = (screenings: ScreeningResponse[]) => {
        if (!screenings || screenings.length === 0) return;

        const groups: GroupedScreenings = {};
        const locale = 'en-US';

        screenings.forEach((scr) => {
            const dateObj = parseBackendDate(scr.screeningTime);

            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;

            if (!groups[dateKey]) {
                const weekday = dateObj.toLocaleDateString(locale, { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString(locale, { month: 'short' });

                groups[dateKey] = {
                    label: `${weekday}, ${dayNum} ${monthName}`,
                    screenings: []
                };
            }
            groups[dateKey].screenings.push(scr);
        });

        Object.keys(groups).forEach(key => {
            groups[key].screenings.sort((a, b) => {
                return parseBackendDate(a.screeningTime).getTime() - parseBackendDate(b.screeningTime).getTime();
            });
        });

        const sortedDates = Object.keys(groups).sort();

        setGroupedScreenings(groups);
        setAvailableDates(sortedDates);

        if (sortedDates.length > 0) {
            setSelectedDate(sortedDates[0]);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const pickedDate = e.target.value;
        if (!pickedDate) return;

        if (availableDates.includes(pickedDate)) {
            setSelectedDate(pickedDate);
        } else {
            alert("No screenings available for the selected date.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress color="inherit" sx={{ color: colors.black }} />
            </Box>
        );
    }

    if (error || !movieData) {
        return (
            <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header title="CinemaApp" onSignOut={handleSignOut} />
                <Container sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="error">{error || "Movie not found."}</Typography>
                </Container>
            </Box>
        );
    }

    const currentDayData = groupedScreenings[selectedDate];
    const currentScreenings = currentDayData ? currentDayData.screenings : [];

    const minDate = availableDates.length > 0 ? availableDates[0] : '';
    const maxDate = availableDates.length > 0 ? availableDates[availableDates.length - 1] : '';

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="CinemaApp" onSignOut={handleSignOut} />

            <Container maxWidth="md" sx={{ mt: 6, mb: 4, flexGrow: 1 }}>
                {/*<Paper elevation={3} sx={{ p: 4, borderRadius: '12px', position: 'relative' }}>*/}
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: '12px',
                        position: 'relative'
                    }}
                >
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            position: 'absolute',
                            left: '16px',
                            top: '16px',
                            padding: '6px',
                            color: colors.black,
                            zIndex: 10,
                            '&:hover': { backgroundColor: colors.lightgrey }
                        }}
                    >
                        <ArrowLeft size={20} />
                    </IconButton>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '32px', pt: { xs: 6, md: 4 }, mb: 4 }}>

                        <Box
                            sx={{
                                width: { xs: '100%', md: '300px' },
                                height: '420px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                flexShrink: 0,
                                backgroundColor: '#eee'
                            }}
                        >
                            {movieData.imageUrl ? (
                                <img src={movieData.imageUrl} alt={movieData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ color: colors.darkgrey }}>No image</Typography>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left' }}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: '700', color: colors.black, mb: 1 }}>
                                {movieData.title}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: '16px', mb: 3, mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={16} color={colors.darkgrey} />
                                    <Typography variant="body2" sx={{ color: colors.darkgrey, fontWeight: '500' }}>
                                        {movieData.duration} min
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="subtitle1" sx={{ fontWeight: '700', color: colors.black, mb: 0.5 }}>
                                Description
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.6 }}>
                                {movieData.description || "No description available."}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', pt: 3, textAlign: 'left' }}>

                        {/* WYBÓR DATY Z IKONĄ KALENDARZA */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 1.5 }}>
                            <Calendar size={18} color={colors.black} />
                            <Typography variant="subtitle1" sx={{ fontWeight: '700', color: colors.black }}>
                                Select Date
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: 4, flexWrap: 'wrap' }}>
                            {availableDates.map((dateKey) => {
                                const isSelected = dateKey === selectedDate;
                                return (
                                    <Button
                                        key={dateKey}
                                        variant={isSelected ? "contained" : "outlined"}
                                        onClick={() => setSelectedDate(dateKey)}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            padding: '8px 14px',
                                            backgroundColor: isSelected ? colors.black : 'transparent',
                                            color: isSelected ? colors.white : colors.black,
                                            borderColor: colors.black,
                                            boxShadow: isSelected ? '0 2px 4px rgba(0, 0, 0, 0.15)' : 'none',
                                            '&:hover': {
                                                backgroundColor: isSelected ? colors.darkgrey : 'rgba(0, 0, 0, 0.04)',
                                                borderColor: colors.darkgrey
                                            }
                                        }}
                                    >
                                        {groupedScreenings[dateKey].label}
                                    </Button>
                                );
                            })}

                            {availableDates.length > 0 && (
                                <Box sx={{ position: 'relative' }}>
                                    <IconButton
                                        onClick={() => dateInputRef.current?.showPicker()}
                                        sx={{
                                            border: `1px solid ${colors.black}`,
                                            borderRadius: '8px',
                                            padding: '8px',
                                            color: colors.black,
                                            backgroundColor: 'transparent',
                                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                                        }}
                                    >
                                        <Calendar size={20} />
                                    </IconButton>

                                    <input
                                        type="date"
                                        ref={dateInputRef}
                                        min={minDate}
                                        max={maxDate}
                                        onChange={handleCalendarChange}
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>

                        {/* WYBÓR GODZINY Z IKONĄ ZEGARA */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 1.5 }}>
                            <Clock size={18} color={colors.black} />
                            <Typography variant="subtitle1" sx={{ fontWeight: '700', color: colors.black }}>
                                Available Showtimes
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {currentScreenings.length > 0 ? (
                                currentScreenings.map((screening) => {
                                    const dateObj = parseBackendDate(screening.screeningTime);

                                    const timeLabel = dateObj.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    });

                                    return (
                                        <Button
                                            key={screening.id}
                                            variant="contained"
                                            // onClick={() => navigate(`/booking/${movieData.id}?screeningId=${screening.id}&date=${selectedDate}&time=${timeLabel}`)}
                                            onClick={() => navigate(`/booking/${movieData.id}?screeningId=${screening.id}&date=${selectedDate}&time=${timeLabel}`)}
                                            sx={{
                                                backgroundColor: colors.black,
                                                // ZAKTUALIZOWANO: Taki sam padding jak buttony z datą ('8px')
                                                padding: '8px 24px',
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)',
                                                color: colors.white,
                                                fontSize: fontSizes?.medium || '1rem',
                                                fontWeight: '600',
                                                '&:hover': {
                                                    backgroundColor: colors.darkgrey,
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)'
                                                }
                                            }}
                                        >
                                            {timeLabel}
                                        </Button>
                                    );
                                })
                            ) : (
                                <Typography variant="body2" sx={{ color: colors.darkgrey }}>
                                    No screenings scheduled for this day.
                                </Typography>
                            )}
                        </Box>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}