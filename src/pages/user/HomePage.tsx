import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Container, Paper, Typography, CircularProgress, Alert} from '@mui/material';
import {Ticket} from 'lucide-react';
import {colors} from '../../constants/theme';
import {decodeJWT} from '../../helper/LoginHelper';
import Header from '../../components/Header';
import {MovieApi, MovieResponse} from '../../api/user/MovieApi';


export default function HomePage() {
    const navigate = useNavigate();
    const [userFirstName, setUserFirstName] = useState('');
    const [movies, setMovies] = useState<MovieResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const claims = decodeJWT(token);
        if (claims && claims.firstName) {
            setUserFirstName(claims.firstName);
        }

        const fetchMoviesData = async () => {
            try {
                setLoading(true);
                setApiError(null);
                const moviesData = await MovieApi.getAllMovies();
                setMovies(moviesData);
            } catch (error: any) {
                setApiError(error.message || "Something went wrong while loading movies.");
            } finally {
                setLoading(false);
            }
        };

        fetchMoviesData();
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Box sx={{backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <Header title="CinemaApp" onSignOut={handleSignOut}/>

            <Container maxWidth="md" sx={{mt: 6, mb: 4, flexGrow: 1}}>
                <Paper elevation={3} sx={{p: 4, borderRadius: '12px', textAlign: 'center'}}>
                    <Typography variant="h5" component="h1"
                                sx={{fontWeight: '700', marginBottom: '8px', color: colors.black}}>
                        Welcome in CinemaApp!
                    </Typography>
                    <Typography variant="body1" sx={{color: colors.darkgrey, marginBottom: '32px'}}>
                        Choose your movie.
                    </Typography>

                    {loading && (
                        <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}>
                            <CircularProgress color="inherit" sx={{color: colors.black}}/>
                        </Box>
                    )}
                    {apiError && (
                        <Alert severity="error" sx={{mb: 4, textAlign: 'left'}}>
                            {apiError}
                        </Alert>
                    )}
                    {!loading && !apiError && (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '24px',
                                width: '100%'
                            }}
                        >
                            {movies.map((movie) => (
                                <Box
                                    key={movie.id}
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'stretch',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out',
                                        userSelect: 'none',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            '& .movie-poster': {
                                                backgroundColor: '#e0e0e0',
                                                boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
                                            },
                                            '& .fake-button': {
                                                backgroundColor: '#333333'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>

                                        <Box
                                            className="movie-poster"
                                            sx={{
                                                backgroundColor: '#eeeeee',
                                                height: '220px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)',
                                                transition: 'all 0.2s ease-in-out',
                                                marginBottom: '10px',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {movie.imageUrl ? (
                                                <img
                                                    src={movie.imageUrl}
                                                    alt={movie.title}
                                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                />
                                            ) : (
                                                <Typography variant="body2" sx={{fontWeight: '600', color: '#b0b0b0'}}>
                                                    No Image
                                                </Typography>
                                            )}
                                        </Box>

                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: '700',
                                                color: colors.black,
                                                whiteSpace: 'normal',
                                                wordBreak: 'break-word',
                                                lineHeight: '1.3',
                                                marginBottom: '2px',
                                                padding: '0 2px'
                                            }}
                                        >
                                            {movie.title}
                                        </Typography>
                                    </Box>

                                    <Box
                                        className="fake-button"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            backgroundColor: colors.black,
                                            color: colors.white,
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            borderRadius: '6px',
                                            py: '8px',
                                            transition: 'background-color 0.2s ease-in-out',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        <Ticket size={14}/>
                                        <span>Buy Ticket</span>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {!loading && !apiError && movies.length === 0 && (
                        <Typography variant="body1" sx={{color: colors.darkgrey, my: 4}}>
                            No movies available at the moment.
                        </Typography>
                    )}

                </Paper>
            </Container>
        </Box>
    );
}