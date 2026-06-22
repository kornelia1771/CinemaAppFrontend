import React from 'react';
import {Box, Typography, IconButton} from '@mui/material';
import {TvMinimalPlay, ArrowLeft} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {colors} from '../constants/theme';
import {LoginTitleRow, LoginTitleText} from '../styles/LoginStyles';
import {HeaderDefaultTitle} from '../strings/loginStrings';

export default function HeaderLogin() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                ...LoginTitleRow(),
                width: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                marginTop: '14px',
                paddingBottom: '12px',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
            }}
        >
            <IconButton
                onClick={() => navigate(-1)}
                sx={{
                    position: 'absolute',
                    left: '4px',
                    padding: '4px',
                    color: colors.black,
                    '&:hover': {
                        backgroundColor: colors.lightgrey
                    }
                }}
            >
                <ArrowLeft size={20}/>
            </IconButton>

            <Box
                onClick={() => navigate('/')}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    '&:hover': {
                        opacity: 0.8
                    }
                }}
            >
                <TvMinimalPlay size={22} color={colors.black} style={{display: 'block'}}/>
                <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                        ...LoginTitleText(),
                        fontSize: '20px',
                        margin: 0,
                        lineHeight: 1,
                        fontWeight: '700'
                    }}
                >
                    {HeaderDefaultTitle}
                </Typography>
            </Box>
        </Box>
    );
}