import React from 'react';
import { Box, Typography } from '@mui/material';
import { TvMinimalPlay } from 'lucide-react';
import { colors } from '../constants/theme';
import { LoginTitleRow, LoginTitleText } from '../styles/LoginStyles';
import { HeaderDefaultTitle } from '../strings/loginStrings';

export default function HeaderLogin() {
    return (
        <Box
            sx={{
                ...LoginTitleRow(),
                width: '100%',
                justifyContent: 'center',
                marginBottom: '12px',
                paddingBottom: '12px',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
            }}
        >
            <TvMinimalPlay size={22} color={colors.black} style={{ display: 'block' }} />
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
    );
}