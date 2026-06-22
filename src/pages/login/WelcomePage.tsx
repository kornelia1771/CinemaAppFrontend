import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Box, Button, Typography, Paper, Container} from '@mui/material';
import {TvMinimalPlay} from 'lucide-react';
import {colors} from '../../constants/theme';
import LanguageSwitcher from "../../components/LanguageSwitcher";
import {
    LoginSafeAreaContainer, LoginCenterArea, LoginFormWrapper,
    LoginInnerContent, LoginTitleRow, LoginTitleText,
    LoginDescription, LoginButtonContainer, LoginButton,
    LoginButtonText
} from '../../styles/LoginStyles';

export default function WelcomePage() {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <Box sx={{...LoginSafeAreaContainer(), position: 'relative'}}>
            <LanguageSwitcher/>

            <Container maxWidth={false} disableGutters sx={LoginCenterArea()}>
                <Paper elevation={3} sx={LoginFormWrapper()}>
                    <Box sx={LoginInnerContent()}>

                        <Box sx={LoginTitleRow()}>
                            <TvMinimalPlay size={34} color={colors.black}/>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={LoginTitleText()}
                            >
                                {t('welcome.title')}
                            </Typography>
                        </Box>

                        <Typography
                            variant="body1"
                            sx={LoginDescription()}
                        >
                            {t('welcome.description')}
                        </Typography>

                        <Box sx={LoginButtonContainer()}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => navigate('/login')}
                                sx={{
                                    ...LoginButton(),
                                    ...LoginButtonText()
                                }}
                            >
                                {t('welcome.signInButton')}
                            </Button>

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => navigate('/register')}
                                sx={{
                                    ...LoginButton(),
                                    ...LoginButtonText()
                                }}
                            >
                                {t('welcome.signUpButton')}
                            </Button>
                        </Box>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}