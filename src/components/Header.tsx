import React from 'react';
import {Box, Typography, Button} from '@mui/material';
import {TvMinimalPlay, LogOut, Home, User, Ticket} from 'lucide-react';
import {useNavigate, useLocation} from 'react-router-dom';
import {colors} from '../constants/theme';
import {HeaderContainer, HeaderLogoRow, HeaderLogoText} from '../styles/ComponentsStyles';
import {HeaderDefaultTitle} from '../strings/loginStrings';

type HeaderProps = {
    title?: string;
    onSignOut?: () => void;
};

const Header: React.FC<HeaderProps> = ({title = HeaderDefaultTitle, onSignOut}) => {
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
                padding: '10px 24px'
            }}
        >
            <Box sx={{...HeaderLogoRow(), cursor: 'pointer'}} onClick={() => navigate('/home')}>
                <TvMinimalPlay size={24} color={colors.black}/>
                <Typography sx={HeaderLogoText()}>
                    {title}
                </Typography>
            </Box>

            <Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <Button
                    variant="text"
                    startIcon={<Home size={18}/>}
                    onClick={() => navigate('/home')}
                    sx={getButtonStyles('/home')}
                >
                    Home
                </Button>

                <Button
                    variant="text"
                    startIcon={<Ticket size={18}/>}
                    onClick={() => navigate('/tickets')}
                    sx={getButtonStyles('/tickets')}
                >
                    Tickets
                </Button>

                <Button
                    variant="text"
                    startIcon={<User size={18}/>}
                    onClick={() => navigate('/profile')}
                    sx={getButtonStyles('/profile')}
                >
                    Profile
                </Button>

                {onSignOut && (
                    <Button
                        variant="text"
                        startIcon={<LogOut size={18}/>}
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