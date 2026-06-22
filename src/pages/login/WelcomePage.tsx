import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Typography, Paper, Container} from '@mui/material';
import {TvMinimalPlay} from 'lucide-react';
import {colors} from '../../constants/theme';
import {
    LoginSafeAreaContainer, LoginCenterArea, LoginFormWrapper,
    LoginInnerContent, LoginTitleRow, LoginTitleText,
    LoginDescription, LoginButtonContainer, LoginButton,
    LoginButtonText
} from '../../styles/LoginStyles';
import {
    WelcomeDescription, SignInButton,
    SignUpButton, HeaderDefaultTitle
} from '../../strings/loginStrings';


export default function WelcomePage() {
    const navigate = useNavigate();
    return (
        <Box sx={LoginSafeAreaContainer()}>
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
                                {HeaderDefaultTitle}
                            </Typography>
                        </Box>

                        <Typography
                            variant="body1"
                            sx={LoginDescription()}
                        >
                            {WelcomeDescription}
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
                                {SignInButton}
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
                                {SignUpButton}
                            </Button>
                        </Box>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}