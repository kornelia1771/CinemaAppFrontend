import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Container, TextField, IconButton, CircularProgress } from '@mui/material';
import {Eye, EyeOff} from 'lucide-react';
import Header from '../components/Header';
import { colors } from '../constants/theme';

// Import zewnętrznych stylów (dokładnie tak jak w WelcomePage)
import {
    LoginSafeAreaContainer, LoginCenterArea, LoginFormWrapper,
    LoginFormScroll, LoginFormScrollContent,
    LoginDescription, LoginFormContainer, LoginInputLabel,
    LoginInput, LoginLabelRow, LoginForgotInline,
    LoginPasswordInputWrapper, LoginPasswordInputField, LoginPasswordToggleAbsolute,
    LoginValidationContainer, LoginValidationError, LoginSignInButton,
    LoginSignInButtonDisabled, LoginSignInButtonText, LoginDividerContainer,
    LoginDividerLine, LoginDividerText, LoginDevButtonsCol, LoginTitleRow, LoginTitleText, LoginTitle
} from '../styles/LoginStyles';

// Import stringów
import {
    LoginTitle as LoginTitleString, LoginDescription as LoginDescriptionText,
    EmailLabel, EmailPlaceholder, PasswordLabel,
    PasswordPlaceholder, ForgotPasswordLink, ValidationError,
    SignInButton, SignInDevUser, SignInDevAdmin,
    DevModeDivider, ShowPasswordLabel, HidePasswordLabel, HeaderDefaultTitle
} from '../strings/loginStrings';

// Importy helperów
import { handleSignIn, handleAdminSignIn, handleDevUserSignIn } from '../helper/LoginHelper';
import { emailRegex } from "../helper/SharedHeper";
import HeaderLogin from "../components/HeaderLogin";


export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showValidationError, setShowValidationError] = useState(false);

    const isFormValid = emailRegex.test(email) && password.length >= 8;

    return (
        // Struktura kontenerów zbieżna z WelcomePage, dodany Header na górze
        <Box sx={{ ...LoginSafeAreaContainer(), flexDirection: 'column' }}>
            {/*<Header />*/}

            <Container maxWidth={false} disableGutters sx={LoginCenterArea()}>
                <Paper elevation={3} sx={{ ...LoginFormWrapper(), marginTop: '8px' }}>

                    {/* Zastępujemy ScrollView kontenerem Box z właściwościami przewijania ze stylów */}
                    <Box sx={{ ...LoginFormScroll(), ...LoginFormScrollContent(), overflowY: 'auto' }}>
                        <HeaderLogin />

                        <Typography variant="h5" component="h2" sx={LoginTitle()}>
                            {LoginTitleString}
                        </Typography>

                        <Typography variant="body2" sx={LoginDescription()}>
                            {LoginDescriptionText}
                        </Typography>

                        <Box component="form" noValidate sx={LoginFormContainer()}>

                            {/* Pole Email */}
                            <Typography sx={LoginInputLabel()}>{EmailLabel}</Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder={EmailPlaceholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                inputProps={{ maxLength: 50 }} // POPRAWIONE: Zmiana ze slotProps na kompatybilne inputProps
                                InputProps={{ disableUnderline: true }} // Usuwa domyślną kreskę MUI
                                sx={LoginInput()}
                            />

                            {/* Wiersz etykiety hasła z linkiem */}
                            <Box sx={LoginLabelRow()}>
                                <Typography sx={LoginInputLabel()}>{PasswordLabel}</Typography>
                                <Box
                                    component="span"
                                    onClick={() => navigate('/forgot-password')}
                                    sx={{ ...LoginForgotInline(), cursor: 'pointer' }}
                                >
                                    {ForgotPasswordLink}
                                </Box>
                            </Box>

                            {/* Pole Hasła z ikoną oka */}
                            <Box sx={{ ...LoginPasswordInputWrapper(), display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder={PasswordPlaceholder}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setShowValidationError(false);
                                    }}
                                    disabled={loading}
                                    inputProps={{ maxLength: 40 }} // POPRAWIONE: Zmiana ze slotProps na kompatybilne inputProps
                                    InputProps={{ disableUnderline: true }}
                                    sx={LoginPasswordInputField()}
                                />
                                <IconButton
                                    onClick={() => setIsPasswordVisible(v => !v)}
                                    aria-label={isPasswordVisible ? HidePasswordLabel : ShowPasswordLabel}
                                    sx={{ ...LoginPasswordToggleAbsolute(), position: 'absolute', right: '8px' }}
                                >
                                    {isPasswordVisible ? (
                                        <Eye size={20} color={colors.darkgrey} />
                                    ) : (
                                        <EyeOff size={20} color={colors.darkgrey} />
                                    )}
                                </IconButton>
                            </Box>

                            {/* Kontener błędu walidacji */}
                            <Box sx={LoginValidationContainer()}>
                                {(!isFormValid && (email.length > 0 || password.length > 0) || showValidationError) ? (
                                    <Typography sx={LoginValidationError()}>{ValidationError}</Typography>
                                ) : null}
                            </Box>

                            {/* Przycisk Zaloguj (Główny) */}
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={loading || !isFormValid}
                                onClick={() => handleSignIn(email, password, isFormValid, setLoading, setShowValidationError, navigate)}
                                sx={{
                                    ...LoginSignInButton(),
                                    ...LoginSignInButtonText(),
                                    textTransform: 'none',
                                    ...(loading || !isFormValid ? LoginSignInButtonDisabled() : {})
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: colors.white }} />
                                ) : (
                                    SignInButton
                                )}
                            </Button>

                            {/* Divider dla sekcji deweloperskiej */}
                            <Box sx={LoginDividerContainer()}>
                                <Box sx={LoginDividerLine()} />
                                <Typography sx={LoginDividerText()}>{DevModeDivider}</Typography>
                                <Box sx={LoginDividerLine()} />
                            </Box>

                            {/* Przyciski deweloperskie */}
                            <Box sx={LoginDevButtonsCol()}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={loading}
                                    onClick={() => handleDevUserSignIn(setLoading, navigate)}
                                    sx={{
                                        ...LoginSignInButton(),
                                        ...LoginSignInButtonText(),
                                        textTransform: 'none',
                                        backgroundColor: colors.lightgrey,
                                        color: colors.black,
                                        '&:hover': { backgroundColor: colors.borderGrey }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} /> : SignInDevUser}
                                </Button>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={loading}
                                    onClick={() => handleAdminSignIn(setLoading, navigate)}
                                    sx={{
                                        ...LoginSignInButton(),
                                        ...LoginSignInButtonText(),
                                        textTransform: 'none',
                                        marginTop: '12px',
                                        backgroundColor: colors.lightgrey,
                                        color: colors.black,
                                        '&:hover': { backgroundColor: colors.borderGrey }
                                    }}
                                >
                                    {SignInDevAdmin}
                                </Button>
                            </Box>

                        </Box>
                    </Box>

                </Paper>
            </Container>
        </Box>
    );
}