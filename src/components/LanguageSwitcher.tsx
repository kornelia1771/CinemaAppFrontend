import React from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Button} from '@mui/material';
import {colors} from '../constants/theme';

export default function LanguageSwitcher() {
    const {i18n} = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const baseButtonStyle = (active: boolean) => ({
        minWidth: 'auto',
        padding: '6px 10px',
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 600,
        boxShadow: active ? '0 2px 4px rgba(0,0,0,0.18)' : 'none',
        backgroundColor: active ? colors.black : 'transparent',
        color: active ? colors.white : colors.black,
        border: active ? 'none' : `1px solid ${colors.black}`,
        '&:hover': {
            backgroundColor: colors.darkgrey,
            color: colors.white,
            borderColor: colors.darkgrey,
        }
    });

    return (
        <Box sx={{position: 'absolute', top: 16, right: 16, zIndex: 1000}}>
            <Button
                variant="contained"
                onClick={() => changeLanguage('en')}
                sx={baseButtonStyle(i18n.language.startsWith('en'))}
            >
                EN
            </Button>

            <Button
                variant="contained"
                onClick={() => changeLanguage('pl')}
                sx={{
                    ...baseButtonStyle(i18n.language.startsWith('pl')),
                    ml: 1
                }}
            >
                PL
            </Button>
        </Box>
    );
}