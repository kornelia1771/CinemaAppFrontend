import React, {useEffect, useState, useRef} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {Box, Container, Paper, Typography, CircularProgress, Button, Alert} from '@mui/material';
import {CheckCircle2, XCircle} from 'lucide-react';
import {colors} from '../../constants/theme';
import HeaderLogin from '../../components/HeaderLogin';
import {AuthApi} from '../../api/AuthApi';
import {
    LoginSafeAreaContainer, LoginCenterArea, LoginFormWrapper,
    LoginFormScroll, LoginFormScrollContent, LoginFormContainer,
    LoginTitle, LoginDescription, LoginSignInButton, LoginSignInButtonText
} from '../../styles/LoginStyles';

export default function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email address...');
    const verificationStarted = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing verification token.');
            return;
        }

        if (verificationStarted.current) {
            return;
        }

        verificationStarted.current = true;

        const verifyEmail = async () => {
            try {
                const response = await AuthApi.confirmEmail(token);
                setStatus('success');
                setMessage(response.message || 'Your account has been successfully activated!');
            } catch (error: any) {
                setStatus('error');
                setMessage(error.message || 'Verification failed. The link may be expired or invalid.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <Box sx={{...LoginSafeAreaContainer(), flexDirection: 'column'}}>
            <Container maxWidth={false} disableGutters sx={LoginCenterArea()}>
                <Paper elevation={3} sx={{...LoginFormWrapper(), marginTop: '8px'}}>
                    <Box sx={{...LoginFormScroll(), ...LoginFormScrollContent(), overflowY: 'auto'}}>

                        <HeaderLogin/>

                        <Box sx={LoginFormContainer()}>
                            {status === 'loading' && (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                    my: 4
                                }}>
                                    <CircularProgress size={40} sx={{color: colors.black}}/>
                                    <Typography variant="body1" sx={LoginDescription()}>
                                        {message}
                                    </Typography>
                                </Box>
                            )}

                            {status === 'success' && (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    my: 2
                                }}>
                                    <CheckCircle2 size={50} color={colors.green} style={{marginBottom: '12px'}}/>
                                    <Typography variant="h5"
                                                sx={{...LoginTitle(), color: colors.green, marginBottom: '8px'}}>
                                        Account Activated!
                                    </Typography>
                                    <Alert severity="success"
                                           sx={{width: '100%', borderRadius: '8px', marginBottom: '20px'}}>
                                        {message}
                                    </Alert>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            ...LoginSignInButton(),
                                            ...LoginSignInButtonText(),
                                            textTransform: 'none'
                                        }}
                                    >
                                        Proceed to Sign In
                                    </Button>
                                </Box>
                            )}

                            {status === 'error' && (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    my: 2
                                }}>
                                    <XCircle size={50} color={colors.red} style={{marginBottom: '12px'}}/>
                                    <Typography variant="h5"
                                                sx={{...LoginTitle(), color: colors.red, marginBottom: '8px'}}>
                                        Verification Failed
                                    </Typography>
                                    <Alert severity="error"
                                           sx={{width: '100%', borderRadius: '8px', marginBottom: '20px'}}>
                                        {message}
                                    </Alert>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => navigate('/register')}
                                        sx={{
                                            ...LoginSignInButton(),
                                            ...LoginSignInButtonText(),
                                            textTransform: 'none',
                                            backgroundColor: colors.lightgrey,
                                            color: colors.black,
                                            '&:hover': {backgroundColor: colors.borderGrey}
                                        }}
                                    >
                                        Back to Registration
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}