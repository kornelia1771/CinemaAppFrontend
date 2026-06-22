import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {TvMinimalPlay, LogOut, Users, Film, Ticket, Building2} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../constants/theme';
import {
    HeaderContainer,
    HeaderLogoRow,
    HeaderLogoText
} from '../styles/ComponentsStyles';
import { HeaderDefaultTitle } from '../strings/loginStrings';

type HeaderAdminProps = {
    title?: string;
    onSignOut?: () => void;
};

const HeaderAdmin: React.FC<HeaderAdminProps> = ({
                                                     title = HeaderDefaultTitle,
                                                     onSignOut
                                                 }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const getButtonStyles = (path: string) => {
        const isActive = location.pathname === path;

        return {
            textTransform: 'none' as const,
            fontWeight: '600',
            borderRadius: '8px',
            padding: '6px 16px',
            backgroundColor: isActive ? colors.black : 'transparent',
            color: isActive ? colors.white : colors.black,
            '&:hover': {
                backgroundColor: isActive ? '#333333' : 'rgba(0,0,0,0.04)',
                color: isActive ? colors.white : colors.black,
            },
            transition: 'all 0.2s ease-in-out',
        };
    };

    return (
        <Box
            sx={{
                ...HeaderContainer(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 24px',
            }}
        >
            {/* Logo */}
            <Box
                sx={{ ...HeaderLogoRow(), cursor: 'pointer' }}
                onClick={() => navigate('/users')}
            >
                <TvMinimalPlay size={24} color={colors.black} />
                <Typography sx={HeaderLogoText()}>
                    {title}
                </Typography>
            </Box>

            {/* Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                    variant="text"
                    startIcon={<Users size={18} />}
                    onClick={() => navigate('/adminHome')}
                    sx={getButtonStyles('/adminHome')}
                >
                    Users
                </Button>


                <Button
                    variant="text"
                    startIcon={<Building2 size={18} />}
                    // onClick={() => navigate('/halls')}
                    // sx={getButtonStyles('/adminHalls')}
                    onClick={() => navigate('/adminHalls')}
                    sx={getButtonStyles('/adminHalls')}
                >
                    Halls
                </Button>

                <Button
                    variant="text"
                    startIcon={<Film size={18} />}
                    onClick={() => navigate('/adminMovies')}
                    sx={getButtonStyles('/adminMovies')}
                >
                    Movies
                </Button>

                <Button
                    variant="text"
                    startIcon={<Ticket size={18} />}
                    onClick={() => navigate('/adminTickets')}
                    sx={getButtonStyles('/adminTickets')}
                >
                    Tickets
                </Button>

                {onSignOut && (
                    <Button
                        variant="text"
                        startIcon={<LogOut size={18} />}
                        onClick={onSignOut}
                        sx={{
                            textTransform: 'none',
                            color: colors.black,
                            fontWeight: '600',
                            borderRadius: '8px',
                            padding: '6px 16px',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.04)',
                            },
                        }}
                    >
                        Sign Out
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default HeaderAdmin;