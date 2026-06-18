import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { Clock, Film, Calendar, ArrowLeft } from 'lucide-react';
import { colors, fontSizes } from '../../constants/theme';
import Header from '../../components/Header';

// Przykładowy typ dla filmu
interface Movie {
    id: string;
    title: string;
    description: string;
    duration: string;
    genre: string;
    releaseDate: string;
    posterUrl: string;
}

export default function MovieDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Symulacja pobierania danych o filmie z API na podstawie ID
        // Docelowo zastąp to wywołaniem do Twojego MovieApi.getById(id)
        setTimeout(() => {
            setMovie({
                id: id || '3',
                title: 'Interstellar',
                description: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
                duration: '169 min',
                genre: 'Sci-Fi, Drama',
                releaseDate: '2014-11-07',
                posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80' // Przykładowy plakat
            });
            setLoading(false);
        }, 500);
    }, [id, navigate]);

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

    if (!movie) {
        return (
            <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header title="CinemaApp" onSignOut={handleSignOut} />
                <Container sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Movie not found.</Typography>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="CinemaApp" onSignOut={handleSignOut} />

            <Container maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                {/* Przycisk Powrotu */}
                <Button
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => navigate(-1)}
                    sx={{
                        textTransform: 'none',
                        color: colors.black,
                        fontWeight: '600',
                        mb: 2,
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                    }}
                >
                    Back to Movies
                </Button>

                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: '32px'
                        }}
                    >
                        {/* Lewa strona: Plakat */}
                        <Box
                            sx={{
                                width: { xs: '100%', md: '300px' },
                                height: '420px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                flexShrink: 0
                            }}
                        >
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>

                        {/* Prawa strona: Szczegóły filmu */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left' }}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: '700', color: colors.black, mb: 1 }}>
                                {movie.title}
                            </Typography>

                            {/* Metadane (Gatunek, Czas, Data) */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', mb: 3, mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Film size={16} color={colors.darkgrey} />
                                    <Typography variant="body2" sx={{ color: colors.darkgrey, fontWeight: '500' }}>
                                        {movie.genre}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={16} color={colors.darkgrey} />
                                    <Typography variant="body2" sx={{ color: colors.darkgrey, fontWeight: '500' }}>
                                        {movie.duration}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={16} color={colors.darkgrey} />
                                    <Typography variant="body2" sx={{ color: colors.darkgrey, fontWeight: '500' }}>
                                        {movie.releaseDate}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="subtitle1" sx={{ fontWeight: '700', color: colors.black, mb: 0.5 }}>
                                Storyline
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.6, mb: 4 }}>
                                {movie.description}
                            </Typography>

                            {/* Przycisk akcji (np. Przejście do zakupu biletów) - Spójny z Twoim przyciskiem Login */}
                            <Box sx={{ mt: 'auto' }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate(`/booking/${movie.id}`)} // Przekierowanie na rezerwację z tym samym ID
                                    sx={{
                                        backgroundColor: colors.black,
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
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
                                    Book Tickets
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}