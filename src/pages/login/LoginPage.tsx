import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Box, Button, Typography, Paper, Container, TextField, IconButton,
    CircularProgress, Snackbar, Alert
} from '@mui/material';
import {Eye, EyeOff} from 'lucide-react';
import {colors} from '../../constants/theme';
import HeaderLogin from "../../components/HeaderLogin";
import {
    LoginSafeAreaContainer, LoginCenterArea, LoginFormWrapper,
    LoginFormScroll, LoginFormScrollContent,
    LoginDescription, LoginFormContainer, LoginInputLabel,
    LoginInput, LoginLabelRow, LoginForgotInline,
    LoginPasswordInputWrapper, LoginPasswordInputField, LoginPasswordToggleAbsolute,
    LoginValidationContainer, LoginValidationError, LoginSignInButton,
    LoginSignInButtonDisabled, LoginSignInButtonText, LoginDividerContainer,
    LoginDividerLine, LoginDividerText, LoginDevButtonsCol, LoginTitle
} from '../../styles/LoginStyles';
import {
    LoginTitle as LoginTitleString, LoginDescription as LoginDescriptionText,
    EmailLabel, EmailPlaceholder, PasswordLabel,
    PasswordPlaceholder, ValidationError,
    SignInButton, SignInDevUser, SignInDevAdmin,
    DevModeDivider, ShowPasswordLabel, HidePasswordLabel
} from '../../strings/loginStrings';
import {handleSignIn, handleAdminSignIn, handleDevUserSignIn} from '../../helper/LoginHelper';
import {emailRegex} from "../../helper/SharedHeper";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showValidationError, setShowValidationError] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const isFormValid = emailRegex.test(email) && password.length >= 8;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSignIn(email, password, isFormValid, setLoading, setShowValidationError, setApiError, navigate);
    };

    return (
        <Box sx={{...LoginSafeAreaContainer(), flexDirection: 'column'}}>
            <Container maxWidth={false} disableGutters sx={LoginCenterArea()}>
                <Paper elevation={3} sx={{...LoginFormWrapper(), marginTop: '8px'}}>
                    <Box sx={{...LoginFormScroll(), ...LoginFormScrollContent(), overflowY: 'auto'}}>

                        <HeaderLogin/>

                        <Typography variant="h5" component="h2" sx={LoginTitle()}>
                            {LoginTitleString}
                        </Typography>
                        <Typography variant="body2" sx={LoginDescription()}>
                            {LoginDescriptionText}
                        </Typography>

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={LoginFormContainer()}>

                            <Typography sx={LoginInputLabel()}>{EmailLabel}</Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                type="email"
                                placeholder={EmailPlaceholder}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setApiError(null);
                                }}
                                disabled={loading}
                                inputProps={{maxLength: 50}}
                                InputProps={{disableUnderline: true}}
                                sx={LoginInput()}
                            />

                            <Box sx={LoginLabelRow()}>
                                <Typography sx={LoginInputLabel()}>{PasswordLabel}</Typography>
                                <Box
                                    component="span"
                                    onClick={() => navigate('/forgot-password')}
                                    sx={{...LoginForgotInline(), cursor: 'pointer'}}
                                >
                                </Box>
                            </Box>

                            <Box sx={{...LoginPasswordInputWrapper(), display: 'flex', alignItems: 'center'}}>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder={PasswordPlaceholder}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setShowValidationError(false);
                                        setApiError(null);
                                    }}
                                    disabled={loading}
                                    inputProps={{maxLength: 40}}
                                    InputProps={{disableUnderline: true}}
                                    sx={LoginPasswordInputField()}
                                />
                                <IconButton
                                    onClick={() => setIsPasswordVisible(v => !v)}
                                    aria-label={isPasswordVisible ? HidePasswordLabel : ShowPasswordLabel}
                                    sx={{...LoginPasswordToggleAbsolute(), position: 'absolute', right: '8px'}}
                                >
                                    {isPasswordVisible ? (
                                        <Eye size={20} color={colors.darkgrey}/>
                                    ) : (
                                        <EyeOff size={20} color={colors.darkgrey}/>
                                    )}
                                </IconButton>
                            </Box>

                            <Box sx={LoginValidationContainer()}>
                                {(!isFormValid && (email.length > 0 || password.length > 0) || showValidationError) ? (
                                    <Typography sx={LoginValidationError()}>{ValidationError}</Typography>
                                ) : null}
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading || !isFormValid}
                                sx={{
                                    ...LoginSignInButton(),
                                    ...LoginSignInButtonText(),
                                    textTransform: 'none',
                                    ...(loading || !isFormValid ? LoginSignInButtonDisabled() : {})
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{color: colors.white}}/>
                                ) : (
                                    SignInButton
                                )}
                            </Button>
                            <Box sx={LoginDividerContainer()}>
                                <Box sx={LoginDividerLine()}/>
                                <Typography sx={LoginDividerText()}>{DevModeDivider}</Typography>
                                <Box sx={LoginDividerLine()}/>
                            </Box>

                            <Box sx={LoginDevButtonsCol()}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    fullWidth
                                    disabled={loading}
                                    onClick={() => handleDevUserSignIn(setLoading, setApiError, navigate)}
                                    sx={{
                                        ...LoginSignInButton(),
                                        ...LoginSignInButtonText(),
                                        textTransform: 'none',
                                        backgroundColor: colors.lightgrey,
                                        color: colors.black,
                                        '&:hover': {backgroundColor: colors.borderGrey}
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} sx={{color: colors.white}}/> : SignInDevUser}
                                </Button>

                                <Button
                                    type="button"
                                    variant="contained"
                                    fullWidth
                                    disabled={loading}
                                    onClick={() => handleAdminSignIn(setLoading, setApiError, navigate)}
                                    sx={{
                                        ...LoginSignInButton(),
                                        ...LoginSignInButtonText(),
                                        textTransform: 'none',
                                        marginTop: '12px',
                                        backgroundColor: colors.lightgrey,
                                        color: colors.black,
                                        '&:hover': {backgroundColor: colors.borderGrey}
                                    }}
                                >
                                    {loading ?
                                        <CircularProgress size={24} sx={{color: colors.white}}/> : SignInDevAdmin}
                                </Button>
                            </Box>

                        </Box>
                    </Box>
                </Paper>
            </Container>

            <Snackbar
                open={apiError !== null}
                autoHideDuration={6000}
                onClose={() => setApiError(null)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            >
                <Alert
                    onClose={() => setApiError(null)}
                    severity="error"
                    sx={{width: '100%', borderRadius: '8px', fontWeight: '500'}}
                    elevation={6}
                    variant="filled"
                >
                    {apiError}
                </Alert>
            </Snackbar>
        </Box>
    );
}