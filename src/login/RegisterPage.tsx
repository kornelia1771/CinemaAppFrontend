import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Container, TextField, IconButton, CircularProgress } from '@mui/material';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { colors } from '../constants/theme';
import HeaderLogin from '../components/HeaderLogin';

// Import zewnętrznych stylów (wspólne z LoginPage)
import {
    LoginSafeAreaContainer, LoginCenterArea, LoginFormWrapper,
    LoginFormScroll, LoginFormScrollContent, LoginTitle,
    LoginDescription, LoginFormContainer, LoginInputLabel,
    LoginInput, LoginPasswordInputWrapper, LoginPasswordInputField,
    LoginPasswordToggleAbsolute, LoginValidationContainer,
    LoginSignInButton, LoginSignInButtonDisabled, LoginSignInButtonText,
    LoginFieldError, LoginPasswordRequirement, LoginPasswordRequirementRow
} from '../styles/LoginStyles';

// Import stringów rejestracji
import {
    RegisterTitle, RegisterDescription, NameLabel, NamePlaceholder,
    SurnameLabel, SurnamePlaceholder, EmailLabel, EmailPlaceholder,
    PasswordLabel, PasswordPlaceholder, ConfirmPasswordLabel,
    ConfirmPasswordPlaceholder, SignUpButton, SignUpDevUser,
    IncorrectDataFormat, PasswordsDoNotMatch, PasswordMinLength,
    PasswordUppercase, PasswordLowercase, PasswordNumber, PasswordSpecial
} from '../strings/loginStrings';

// Importy helperów i walidacji
import { handleSignUp, handleDevSignUp, capitalizeFirst } from '../helper/LoginHelper';
import {
    emailRegex, nameRegex, surnameRegex, passwordRegex,
    uppercaseRegex, lowercaseRegex, numberRegex, specialCharRegex, nameOnlyRegex
} from "../helper/SharedHeper";


export default function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showValidationError, setShowValidationError] = useState(false);
    const [touchedName, setTouchedName] = useState(false);
    const [touchedSurname, setTouchedSurname] = useState(false);
    const [touchedEmail, setTouchedEmail] = useState(false);
    const [touchedPassword, setTouchedPassword] = useState(false);
    const [touchedConfirm, setTouchedConfirm] = useState(false);

    // Sprawdzanie poprawności całego formularza
    const isFormValid = (
        nameRegex.test(name) &&
        surnameRegex.test(surname) &&
        emailRegex.test(email) &&
        passwordRegex.test(password) &&
        password === confirm
    );

    // Dynamiczne sprawdzanie kryteriów hasła
    const passwordRequirements = {
        minLength: password.length >= 8,
        hasUppercase: uppercaseRegex.test(password),
        hasLowercase: lowercaseRegex.test(password),
        hasNumber: numberRegex.test(password),
        hasSpecial: specialCharRegex.test(password),
    };

    return (
        <Box sx={{ ...LoginSafeAreaContainer(), flexDirection: 'column' }}>
            {/* Zewnętrzny mobilny Header ukrywamy na rzecz HeaderLogin wewnątrz Paper */}
            {/* <Header /> */}

            <Container maxWidth={false} disableGutters sx={LoginCenterArea()}>
                <Paper elevation={3} sx={{ ...LoginFormWrapper(), marginTop: '8px' }}>
                    <Box sx={{ ...LoginFormScroll(), ...LoginFormScrollContent(), overflowY: 'auto' }}>

                        {/* Nowy, spójny nagłówek z ikoną aplikacji */}
                        <HeaderLogin />

                        {/* Tytuł sekcji Rejestracji */}
                        <Typography variant="h5" component="h2" sx={LoginTitle()}>
                            {RegisterTitle}
                        </Typography>

                        <Typography variant="body2" sx={LoginDescription()}>
                            {RegisterDescription}
                        </Typography>

                        <Box component="form" noValidate sx={LoginFormContainer()}>

                            {/* Pole Imię */}
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
                                    setShowValidationError(false);
                                }}
                                onBlur={() => setTouchedName(true)}
                                disabled={loading}
                                inputProps={{ maxLength: 30 }}
                                InputProps={{ disableUnderline: true }}
                                sx={LoginInput()}
                            />
                            {touchedName && (name.trim().length === 0 || !nameRegex.test(name)) && (
                                <Typography sx={LoginFieldError()}>{IncorrectDataFormat}</Typography>
                            )}

                            {/* Pole Nazwisko */}
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
                                    setShowValidationError(false);
                                }}
                                onBlur={() => setTouchedSurname(true)}
                                disabled={loading}
                                inputProps={{ maxLength: 40 }}
                                InputProps={{ disableUnderline: true }}
                                sx={LoginInput()}
                            />
                            {touchedSurname && (surname.trim().length === 0 || !surnameRegex.test(surname)) && (
                                <Typography sx={LoginFieldError()}>{IncorrectDataFormat}</Typography>
                            )}

                            {/* Pole Email */}
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
                                    setShowValidationError(false);
                                }}
                                onBlur={() => setTouchedEmail(true)}
                                disabled={loading}
                                inputProps={{ maxLength: 50 }}
                                InputProps={{ disableUnderline: true }}
                                sx={LoginInput()}
                            />
                            {touchedEmail && email.length > 0 && !emailRegex.test(email) && (
                                <Typography sx={LoginFieldError()}>{IncorrectDataFormat}</Typography>
                            )}

                            {/* Pole Hasło */}
                            <Typography sx={LoginInputLabel()}>{PasswordLabel}</Typography>
                            <Box sx={{ ...LoginPasswordInputWrapper(), display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder={PasswordPlaceholder}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setTouchedPassword(true);
                                        setShowValidationError(false);
                                    }}
                                    onBlur={() => setTouchedPassword(true)}
                                    disabled={loading}
                                    inputProps={{ maxLength: 40 }}
                                    InputProps={{ disableUnderline: true }}
                                    sx={LoginPasswordInputField()}
                                />
                                <IconButton
                                    onClick={() => setIsPasswordVisible(v => !v)}
                                    sx={{ ...LoginPasswordToggleAbsolute(), position: 'absolute', right: '8px' }}
                                >
                                    {isPasswordVisible ? (
                                        <Eye size={20} color={colors.darkgrey} />
                                    ) : (
                                        <EyeOff size={20} color={colors.darkgrey} />
                                    )}
                                </IconButton>
                            </Box>

                            {/* Lista wymagań dotyczących hasła (walidacja na żywo) */}
                            {(touchedPassword || password.length > 0) && (
                                <Box sx={{ marginBottom: '4px', marginTop: '4px' }}>
                                    <Box sx={LoginPasswordRequirementRow()}>
                                        {passwordRequirements.minLength ? <Check color={colors.green} size={16} /> : <X color={colors.red} size={16} />}
                                        <Typography sx={LoginPasswordRequirement(passwordRequirements.minLength)}>{PasswordMinLength}</Typography>
                                    </Box>
                                    <Box sx={LoginPasswordRequirementRow()}>
                                        {passwordRequirements.hasUppercase ? <Check color={colors.green} size={16} /> : <X color={colors.red} size={16} />}
                                        <Typography sx={LoginPasswordRequirement(passwordRequirements.hasUppercase)}>{PasswordUppercase}</Typography>
                                    </Box>
                                    <Box sx={LoginPasswordRequirementRow()}>
                                        {passwordRequirements.hasLowercase ? <Check color={colors.green} size={16} /> : <X color={colors.red} size={16} />}
                                        <Typography sx={LoginPasswordRequirement(passwordRequirements.hasLowercase)}>{PasswordLowercase}</Typography>
                                    </Box>
                                    <Box sx={LoginPasswordRequirementRow()}>
                                        {passwordRequirements.hasNumber ? <Check color={colors.green} size={16} /> : <X color={colors.red} size={16} />}
                                        <Typography sx={LoginPasswordRequirement(passwordRequirements.hasNumber)}>{PasswordNumber}</Typography>
                                    </Box>
                                    <Box sx={LoginPasswordRequirementRow()}>
                                        {passwordRequirements.hasSpecial ? <Check color={colors.green} size={16} /> : <X color={colors.red} size={16} />}
                                        <Typography sx={LoginPasswordRequirement(passwordRequirements.hasSpecial)}>{PasswordSpecial}</Typography>
                                    </Box>
                                </Box>
                            )}

                            {/* Pole Potwierdź Hasło */}
                            <Typography sx={{ ...LoginInputLabel(), marginTop: '12px' }}>{ConfirmPasswordLabel}</Typography>
                            <Box sx={{ ...LoginPasswordInputWrapper(), display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder={ConfirmPasswordPlaceholder}
                                    value={confirm}
                                    onChange={(e) => {
                                        setConfirm(e.target.value);
                                        setTouchedConfirm(true);
                                        setShowValidationError(false);
                                    }}
                                    onBlur={() => setTouchedConfirm(true)}
                                    disabled={loading}
                                    inputProps={{ maxLength: 40 }}
                                    InputProps={{ disableUnderline: true }}
                                    sx={LoginPasswordInputField()}
                                />
                            </Box>
                            {touchedConfirm && confirm.length > 0 && confirm !== password && (
                                <Typography sx={LoginFieldError()}>{PasswordsDoNotMatch}</Typography>
                            )}

                            {/* Kontener pusty / błędu ogólnego walidacji */}
                            <Box sx={LoginValidationContainer()} />

                            {/* Przycisk Zarejestruj (Główny) */}
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={!isFormValid || loading}
                                onClick={() => handleSignUp(
                                    name, surname, email, password, isFormValid,
                                    setLoading, setTouchedName, setTouchedSurname, setTouchedEmail,
                                    setTouchedPassword, setTouchedConfirm, setShowValidationError, navigate
                                )}
                                sx={{
                                    ...LoginSignInButton(),
                                    ...LoginSignInButtonText(),
                                    textTransform: 'none',
                                    marginTop: '24px',
                                    ...(!isFormValid || loading ? LoginSignInButtonDisabled() : {})
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: colors.white }} />
                                ) : (
                                    SignUpButton
                                )}
                            </Button>

                            {/* Przycisk Deweloperski (Autouzupełnianie / Rejestracja dev) */}
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                onClick={() => handleDevSignUp(
                                    setName, setSurname, setEmail, setPassword, setConfirm,
                                    setLoading, navigate
                                )}
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
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    SignUpDevUser
                                )}
                            </Button>

                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}