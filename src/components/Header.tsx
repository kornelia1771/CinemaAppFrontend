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
import { useNavigate } from 'react-router-dom';
import { colors } from '../constants/theme';
import { HeaderContainer, HeaderLogoRow, HeaderLogoText } from '../styles/ComponentsStyles';
import { HeaderDefaultTitle } from '../strings/loginStrings';

type HeaderProps = {
    title?: string;
    onSignOut?: () => void; // Funkcja przekazywana do obsługi wylogowania
};

const Header: React.FC<HeaderProps> = ({ title = HeaderDefaultTitle, onSignOut }) => {
    const navigate = useNavigate();

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Przycisk Home */}
                <Button
                    variant="text"
                    startIcon={<Home size={18} />}
                    onClick={() => navigate('/home')}
                    sx={{
                        textTransform: 'none',
                        color: colors.black,
                        fontWeight: '600',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                    }}
                >
                    Home
                </Button>

                {/* NOWY: Przycisk Tickets */}
                <Button
                    variant="text"
                    startIcon={<Ticket size={18} />}
                    onClick={() => navigate('/tickets')}
                    sx={{
                        textTransform: 'none',
                        color: colors.black,
                        fontWeight: '600',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                    }}
                >
                    Tickets
                </Button>

                {/* Przycisk Profile */}
                <Button
                    variant="text"
                    startIcon={<User size={18} />}
                    onClick={() => navigate('/profile')}
                    sx={{
                        textTransform: 'none',
                        color: colors.black,
                        fontWeight: '600',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                    }}
                >
                    Profile
                </Button>

                {/* Przycisk Sign Out (zmieniony na variant="text", spójny styl) */}
                {onSignOut && (
                    <Button
                        variant="text"
                        startIcon={<LogOut size={18} />}
                        onClick={onSignOut}
                        sx={{
                            textTransform: 'none',
                            color: colors.black,
                            fontWeight: '600',
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