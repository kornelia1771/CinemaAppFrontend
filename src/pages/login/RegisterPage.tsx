import React, {useState, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Box, Button, Typography, Paper, Container, TextField, IconButton,
    CircularProgress, Snackbar, Alert
} from '@mui/material';
import {Eye, EyeOff, Check, X} from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import {colors} from '../../constants/theme';
import HeaderLogin from '../../components/HeaderLogin';
import {
    LoginSafeAreaContainer, LoginCenterArea, LoginFormWrapper,
    LoginFormScroll, LoginFormScrollContent, LoginTitle,
    LoginDescription, LoginFormContainer, LoginInputLabel,
    LoginInput, LoginPasswordInputWrapper, LoginPasswordInputField,
    LoginPasswordToggleAbsolute, LoginValidationContainer,
    LoginSignInButton, LoginSignInButtonDisabled, LoginSignInButtonText,
    LoginFieldError, LoginPasswordRequirement, LoginPasswordRequirementRow
} from '../../styles/LoginStyles';
import {
    RegisterTitle, RegisterDescription, NameLabel, NamePlaceholder,
    SurnameLabel, SurnamePlaceholder, EmailLabel, EmailPlaceholder,
    PasswordLabel, PasswordPlaceholder, ConfirmPasswordLabel,
    ConfirmPasswordPlaceholder, SignUpButton,
    IncorrectDataFormat, PasswordsDoNotMatch, PasswordMinLength,
    PasswordUppercase, PasswordLowercase, PasswordNumber, PasswordSpecial
} from '../../strings/loginStrings';
import {capitalizeFirst} from '../../helper/LoginHelper';
import {
    emailRegex, nameRegex, surnameRegex, passwordRegex,
    uppercaseRegex, lowercaseRegex, numberRegex, specialCharRegex, nameOnlyRegex
} from "../../helper/SharedHeper";
import {AuthApi} from '../../api/AuthApi';
import {recaptchaKey} from "../../config/ReCaptchaKey";

export default function RegisterPage() {
    const navigate = useNavigate();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [touchedName, setTouchedName] = useState(false);
    const [touchedSurname, setTouchedSurname] = useState(false);
    const [touchedEmail, setTouchedEmail] = useState(false);
    const [touchedPassword, setTouchedPassword] = useState(false);
    const [touchedConfirm, setTouchedConfirm] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const isFormValid = (
        nameRegex.test(name) &&
        surnameRegex.test(surname) &&
        emailRegex.test(email) &&
        passwordRegex.test(password) &&
        password === confirm &&
        captchaToken !== null
    );

    const passwordRequirements = {
        minLength: password.length >= 8,
        hasUppercase: uppercaseRegex.test(password),
        hasLowercase: lowercaseRegex.test(password),
        hasNumber: numberRegex.test(password),
        hasSpecial: specialCharRegex.test(password),
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || !captchaToken) return;

        setLoading(true);

        try {
            const response = await AuthApi.register({
                firstName: name,
                lastName: surname,
                email: email,
                password: password,
                captchaToken: captchaToken
            });

            setSnackbarSeverity('success');
            setSnackbarMessage(response.message || "Registration successful! Please check your email to activate your account.");
            setSnackbarOpen(true);

            setName('');
            setSurname('');
            setEmail('');
            setPassword('');
            setConfirm('');
            setCaptchaToken(null);
            recaptchaRef.current?.reset();

            setTouchedName(false);
            setTouchedSurname(false);
            setTouchedEmail(false);
            setTouchedPassword(false);
            setTouchedConfirm(false);
            setIsPasswordVisible(false);
            setIsConfirmPasswordVisible(false);

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error: any) {
            setSnackbarSeverity('error');
            setSnackbarMessage(error.message || "An error occurred during communication with the server.");
            setSnackbarOpen(true);

            setCaptchaToken(null);
            recaptchaRef.current?.reset();
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{...LoginSafeAreaContainer(), flexDirection: 'column'}}>
            <Container maxWidth={false} disableGutters sx={LoginCenterArea()}>
                <Paper elevation={3} sx={{...LoginFormWrapper(), marginTop: '8px'}}>
                    <Box sx={{...LoginFormScroll(), ...LoginFormScrollContent(), overflowY: 'auto'}}>

                        <HeaderLogin/>

                        <Typography variant="h5" component="h2" sx={LoginTitle()}>
                            {RegisterTitle}
                        </Typography>

                        <Typography variant="body2" sx={LoginDescription()}>
                            {RegisterDescription}
                        </Typography>

                        <Box component="form" noValidate onSubmit={handleRegisterSubmit} sx={LoginFormContainer()}>

                            <Typography sx={LoginInputLabel()}>{NameLabel}</Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder={NamePlaceholder}
                                value={name}
                                onChange={(e) => {
                                    const sanitized = e.target.value.replace(nameOnlyRegex, '');
                                    setName(capitalizeFirst(sanitized));
                                    setTouchedName(true);
                                }}
                                onBlur={() => setTouchedName(true)}
                                disabled={loading}
                                inputProps={{maxLength: 30}}
                                InputProps={{disableUnderline: true}}
                                sx={LoginInput()}
                            />
                            {touchedName && (name.trim().length === 0 || !nameRegex.test(name)) && (
                                <Typography sx={LoginFieldError()}>{IncorrectDataFormat}</Typography>
                            )}

                            <Typography sx={LoginInputLabel()}>{SurnameLabel}</Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder={SurnamePlaceholder}
                                value={surname}
                                onChange={(e) => {
                                    const sanitized = e.target.value.replace(nameOnlyRegex, '');
                                    setSurname(capitalizeFirst(sanitized));
                                    setTouchedSurname(true);
                                }}
                                onBlur={() => setTouchedSurname(true)}
                                disabled={loading}
                                inputProps={{maxLength: 40}}
                                InputProps={{disableUnderline: true}}
                                sx={LoginInput()}
                            />
                            {touchedSurname && (surname.trim().length === 0 || !surnameRegex.test(surname)) && (
                                <Typography sx={LoginFieldError()}>{IncorrectDataFormat}</Typography>
                            )}

                            <Typography sx={LoginInputLabel()}>{EmailLabel}</Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                type="email"
                                placeholder={EmailPlaceholder}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setTouchedEmail(true);
                                }}
                                onBlur={() => setTouchedEmail(true)}
                                disabled={loading}
                                inputProps={{maxLength: 50}}
                                InputProps={{disableUnderline: true}}
                                sx={LoginInput()}
                            />
                            {touchedEmail && email.length > 0 && !emailRegex.test(email) && (
                                <Typography sx={LoginFieldError()}>{IncorrectDataFormat}</Typography>
                            )}

                            <Typography sx={LoginInputLabel()}>{PasswordLabel}</Typography>
                            <Box sx={{...LoginPasswordInputWrapper(), display: 'flex', alignItems: 'center'}}>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder={PasswordPlaceholder}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setTouchedPassword(true);
                                    }}
                                    onBlur={() => setTouchedPassword(true)}
                                    disabled={loading}
                                    inputProps={{maxLength: 40}}
                                    InputProps={{disableUnderline: true}}
                                    sx={LoginPasswordInputField()}
                                />
                                <IconButton
                                    onClick={() => setIsPasswordVisible(v => !v)}
                                    sx={{...LoginPasswordToggleAbsolute(), position: 'absolute', right: '8px'}}
                                >
                                    {isPasswordVisible ? (
                                        <Eye size={20} color={colors.darkgrey}/>
                                    ) : (
                                        <EyeOff size={20} color={colors.darkgrey}/>
                                    )}
                                </IconButton>
                            </Box>

                            {(touchedPassword || password.length > 0) && (
                                <Box sx={{marginBottom: '4px', marginTop: '4px'}}>
                                    <Box sx={LoginPasswordRequirementRow()}>
                                        {passwordRequirements.minLength ? <Check color={colors.green} size={16}/> :
                                            <X color={colors.red} size={16}/>}
                                        <Typography
                                            sx={LoginPasswordRequirement(passwordRequirements.minLength)}>{PasswordMinLength}</Typography>
                                    </Box>
                                    <Box sx={LoginPasswordRequirementRow()}>
                                        {passwordRequirements.hasUppercase ? <Check color={colors.green} size={16}/> :
                                            <X color={colors.red} size={16}/>}
                                        <Typography
                                            sx={LoginPasswordRequirement(passwordRequirements.hasUppercase)}>{PasswordUppercase}</Typography>
                                    </Box>
                                    <Box sx={LoginPasswordRequirementRow()}>
                                        {passwordRequirements.hasLowercase ? <Check color={colors.green} size={16}/> :
                                            <X color={colors.red} size={16}/>}
                                        <Typography
                                            sx={LoginPasswordRequirement(passwordRequirements.hasLowercase)}>{PasswordLowercase}</Typography>
                                    </Box>
                                    <Box sx={LoginPasswordRequirementRow()}>
                                        {passwordRequirements.hasNumber ? <Check color={colors.green} size={16}/> :
                                            <X color={colors.red} size={16}/>}
                                        <Typography
                                            sx={LoginPasswordRequirement(passwordRequirements.hasNumber)}>{PasswordNumber}</Typography>
                                    </Box>
                                    <Box sx={LoginPasswordRequirementRow()}>
                                        {passwordRequirements.hasSpecial ? <Check color={colors.green} size={16}/> :
                                            <X color={colors.red} size={16}/>}
                                        <Typography
                                            sx={LoginPasswordRequirement(passwordRequirements.hasSpecial)}>{PasswordSpecial}</Typography>
                                    </Box>
                                </Box>
                            )}

                            <Typography
                                sx={{...LoginInputLabel(), marginTop: '12px'}}>{ConfirmPasswordLabel}</Typography>
                            <Box sx={{...LoginPasswordInputWrapper(), display: 'flex', alignItems: 'center'}}>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    type={isConfirmPasswordVisible ? "text" : "password"}
                                    placeholder={ConfirmPasswordPlaceholder}
                                    value={confirm}
                                    onChange={(e) => {
                                        setConfirm(e.target.value);
                                        setTouchedConfirm(true);
                                    }}
                                    onBlur={() => setTouchedConfirm(true)}
                                    disabled={loading}
                                    inputProps={{maxLength: 40}}
                                    InputProps={{disableUnderline: true}}
                                    sx={LoginPasswordInputField()}
                                />
                                <IconButton
                                    onClick={() => setIsConfirmPasswordVisible(v => !v)}
                                    sx={{...LoginPasswordToggleAbsolute(), position: 'absolute', right: '8px'}}
                                >
                                    {isConfirmPasswordVisible ? (
                                        <Eye size={20} color={colors.darkgrey}/>
                                    ) : (
                                        <EyeOff size={20} color={colors.darkgrey}/>
                                    )}
                                </IconButton>
                            </Box>
                            {touchedConfirm && confirm.length > 0 && confirm !== password && (
                                <Typography
                                    sx={{...LoginFieldError(), marginTop: '6px'}}>{PasswordsDoNotMatch}</Typography>
                            )}

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '10px',
                                marginBottom: '10px'
                            }}>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={recaptchaKey}
                                    onChange={(token) => setCaptchaToken(token)}
                                    onExpired={() => setCaptchaToken(null)}
                                />
                            </Box>

                            <Box sx={LoginValidationContainer()}/>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={!isFormValid || loading}
                                sx={{
                                    ...LoginSignInButton(),
                                    ...LoginSignInButtonText(),
                                    textTransform: 'none',
                                    marginTop: '12px',
                                    ...(!isFormValid || loading ? LoginSignInButtonDisabled() : {})
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{color: colors.white}}/>
                                ) : (
                                    SignUpButton
                                )}
                            </Button>

                        </Box>
                    </Box>
                </Paper>
            </Container>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{width: '100%', borderRadius: '8px', fontWeight: '500'}}
                    elevation={6}
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}