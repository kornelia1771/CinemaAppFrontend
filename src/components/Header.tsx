import React from 'react';
import { Box, Typography } from '@mui/material';
import { TvMinimalPlay } from 'lucide-react';
import { colors } from '../constants/theme';
import { HeaderContainer, HeaderLogoRow, HeaderLogoText } from '../styles/ComponentsStyles';
import { HeaderDefaultTitle } from '../strings/loginStrings';

type HeaderProps = {
    title?: string;
};

const Header: React.FC<HeaderProps> = ({ title = HeaderDefaultTitle }) => {
    return (
        <Box sx={HeaderContainer()}>
            <Box sx={HeaderLogoRow()}>
                <TvMinimalPlay size={24} color={colors.black} />
                <Typography sx={HeaderLogoText()}>
                    {title}
                </Typography>
            </Box>
        </Box>
    );
};

export default Header;