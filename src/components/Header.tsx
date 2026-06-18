// import React from 'react';
// import { Box, Typography } from '@mui/material';
// import { TvMinimalPlay } from 'lucide-react';
// import { colors } from '../constants/theme';
// import { HeaderContainer, HeaderLogoRow, HeaderLogoText } from '../styles/ComponentsStyles';
// import { HeaderDefaultTitle } from '../strings/loginStrings';
//
// type HeaderProps = {
//     title?: string;
// };
//
// const Header: React.FC<HeaderProps> = ({ title = HeaderDefaultTitle }) => {
//     return (
//         <Box sx={HeaderContainer()}>
//             <Box sx={HeaderLogoRow()}>
//                 <TvMinimalPlay size={24} color={colors.black} />
//                 <Typography sx={HeaderLogoText()}>
//                     {title}
//                 </Typography>
//             </Box>
//         </Box>
//     );
// };
//
// export default Header;

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { TvMinimalPlay, LogOut, Home, User, Ticket } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // Dodano useLocation
import { colors } from '../constants/theme';
import { HeaderContainer, HeaderLogoRow, HeaderLogoText } from '../styles/ComponentsStyles';
import { HeaderDefaultTitle } from '../strings/loginStrings';

type HeaderProps = {
    title?: string;
    onSignOut?: () => void; // Funkcja przekazywana do obsługi wylogowania
};

const Header: React.FC<HeaderProps> = ({ title = HeaderDefaultTitle, onSignOut }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Pobranie aktualnej ścieżki (np. '/home')

    // Funkcja pomocnicza zwracająca style dla przycisku w zależności od tego, czy jest aktywny
    const getButtonStyles = (path: string) => {
        const isActive = location.pathname === path;

        return {
            textTransform: 'none' as const,
            fontWeight: '600',
            borderRadius: '8px', // Lekko zaokrąglone rogi dla lepszego wyglądu
            padding: '6px 16px',
            backgroundColor: isActive ? colors.black : 'transparent',
            color: isActive ? colors.white : colors.black,
            '&:hover': {
                backgroundColor: isActive ? '#333333' : 'rgba(0,0,0,0.04)',
                color: isActive ? colors.white : colors.black,
            },
            // Zapewnienie płynnego przejścia kolorów
            transition: 'all 0.2s ease-in-out',
        };
    };

    return (
        <Box
            sx={{
                ...HeaderContainer(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // Rozpycha logo do lewej, a nawigację do prawej
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 24px'
            }}
        >
            {/* Lewa strona: Logo i Tytuł */}
            <Box sx={{ ...HeaderLogoRow(), cursor: 'pointer' }} onClick={() => navigate('/home')}>
                <TvMinimalPlay size={24} color={colors.black} />
                <Typography sx={HeaderLogoText()}>
                    {title}
                </Typography>
            </Box>

            {/* Prawa strona: Menu nawigacyjne z ikonami (ujednolicony styl) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Przycisk Home */}
                <Button
                    variant="text"
                    startIcon={<Home size={18} />}
                    onClick={() => navigate('/home')}
                    sx={getButtonStyles('/home')}
                >
                    Home
                </Button>

                {/* Przycisk Tickets */}
                <Button
                    variant="text"
                    startIcon={<Ticket size={18} />}
                    onClick={() => navigate('/tickets')}
                    sx={getButtonStyles('/tickets')}
                >
                    Tickets
                </Button>

                {/* Przycisk Profile */}
                <Button
                    variant="text"
                    startIcon={<User size={18} />}
                    onClick={() => navigate('/profile')}
                    sx={getButtonStyles('/profile')}
                >
                    Profile
                </Button>

                {/* Przycisk Sign Out */}
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
                                backgroundColor: 'rgba(0,0,0,0.04)'
                            }
                        }}
                    >
                        Sign Out
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Header;