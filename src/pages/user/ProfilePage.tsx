import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { User, IdCard, Mail, Pencil } from 'lucide-react';
import { colors, fontSizes } from '../../constants/theme';
import { decodeJWT } from '../../helper/LoginHelper';
import Header from '../../components/Header';

// Import walidacji i pomocników z Twojego pliku rejestracji
import { capitalizeFirst } from '../../helper/LoginHelper';
import { nameRegex, surnameRegex, nameOnlyRegex } from "../../helper/SharedHeper";
import { IncorrectDataFormat } from '../../strings/loginStrings';
import { LoginFieldError } from '../../styles/LoginStyles';

export default function ProfilePage() {
    const navigate = useNavigate();

    // Główny stan użytkownika
    const [user, setUser] = useState({
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan@wp.pl'
    });

    // Stan odpowiedzialny za otwieranie/zamykanie modala
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Stany formularza edycji oraz walidacji (touched)
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: ''
    });
    const [touchedName, setTouchedName] = useState(false);
    const [touchedSurname, setTouchedSurname] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Otwieranie modala, ładowanie aktualnych danych i reset flag touched
    const handleOpenModal = () => {
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName
        });
        setTouchedName(false);
        setTouchedSurname(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Walidacja formularza po stronie klienta (identyczna z register)
    const isFormValid = (
        nameRegex.test(editForm.firstName) &&
        surnameRegex.test(editForm.lastName)
    );

    // Zapisywanie wprowadzonych zmian po pomyślnej walidacji
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setUser((prev) => ({
            ...prev,
            firstName: editForm.firstName,
            lastName: editForm.lastName
        }));
        setIsModalOpen(false);
    };

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="CinemaApp" onSignOut={handleSignOut} />

            <Container maxWidth="md" sx={{ mt: 6, mb: 4, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>

                    {/* Ikona profilu i Nagłówek */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                backgroundColor: '#eeeeee',
                                borderRadius: '50%',
                                p: 2,
                                display: 'inline-flex',
                                marginBottom: '16px'
                            }}
                        >
                            <User size={40} color={colors.black} />
                        </Box>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: '700', color: colors.black }}>
                            Hello {user.firstName}!
                        </Typography>
                    </Box>

                    {/* Kontener z danymi użytkownika */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            width: '100%',
                            textAlign: 'left'
                        }}
                    >
                        {/* Pole: Name */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '2px' }}>
                                <User size={14} color={colors.darkgrey} />
                                <Typography variant="caption" sx={{ color: colors.darkgrey, fontWeight: '600', textTransform: 'uppercase' }}>
                                    Name
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: '600', color: colors.black, pl: '20px' }}>
                                {user.firstName}
                            </Typography>
                        </Box>

                        {/* Pole: Surname */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '2px' }}>
                                <IdCard size={14} color={colors.darkgrey} />
                                <Typography variant="caption" sx={{ color: colors.darkgrey, fontWeight: '600', textTransform: 'uppercase' }}>
                                    Surname
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: '600', color: colors.black, pl: '20px' }}>
                                {user.lastName}
                            </Typography>
                        </Box>

                        {/* Pole: Email */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '2px' }}>
                                <Mail size={14} color={colors.darkgrey} />
                                <Typography variant="caption" sx={{ color: colors.darkgrey, fontWeight: '600', textTransform: 'uppercase' }}>
                                    Email
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: '600', color: colors.black, pl: '20px' }}>
                                {user.email}
                            </Typography>
                        </Box>

                        {/* Przycisk otwierający Modal */}
                        <Box sx={{ mt: 2, width: '100%' }}>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<Pencil size={16} color={colors.white} />}
                                onClick={handleOpenModal}
                                sx={{
                                    backgroundColor: colors.black,
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    paddingLeft: '24px',
                                    paddingRight: '24px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)',
                                    color: colors.white,
                                    fontSize: fontSizes?.medium || '1rem',
                                    fontWeight: '600',
                                    '&:hover': {
                                        backgroundColor: colors.darkgrey,
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)'
                                    }
                                }}
                            >
                                Edit Data
                            </Button>
                        </Box>
                    </Box>

                </Paper>
            </Container>

            {/* MODAL DO EDYCJI DANYCH Z INTEGRACJĄ WALIDACJI */}
            <Dialog
                open={isModalOpen}
                onClose={handleCloseModal}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: { borderRadius: '12px', p: 1 }
                }}
            >
                <form onSubmit={handleSave} noValidate>
                    <DialogTitle sx={{ fontWeight: '700', color: colors.black, pb: 1 }}>
                        Edit Profile Data
                    </DialogTitle>

                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px', pt: '12px !important' }}>
                        {/* Pole: First Name z walidacją */}
                        <Box>
                            <TextField
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                required
                                value={editForm.firstName}
                                inputProps={{ maxLength: 30 }}
                                onChange={(e) => {
                                    const sanitized = e.target.value.replace(nameOnlyRegex, '');
                                    setEditForm({ ...editForm, firstName: capitalizeFirst(sanitized) });
                                    setTouchedName(true);
                                }}
                                onBlur={() => setTouchedName(true)}
                                InputProps={{
                                    style: { fontWeight: 500 }
                                }}
                            />
                            {touchedName && (editForm.firstName.trim().length === 0 || !nameRegex.test(editForm.firstName)) && (
                                <Typography sx={{ ...LoginFieldError(), mt: '4px', mb: 0 }}>{IncorrectDataFormat}</Typography>
                            )}
                        </Box>

                        {/* Pole: Last Name z walidacją */}
                        <Box>
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                required
                                value={editForm.lastName}
                                inputProps={{ maxLength: 40 }}
                                onChange={(e) => {
                                    const sanitized = e.target.value.replace(nameOnlyRegex, '');
                                    setEditForm({ ...editForm, lastName: capitalizeFirst(sanitized) });
                                    setTouchedSurname(true);
                                }}
                                onBlur={() => setTouchedSurname(true)}
                                InputProps={{
                                    style: { fontWeight: 500 }
                                }}
                            />
                            {touchedSurname && (editForm.lastName.trim().length === 0 || !surnameRegex.test(editForm.lastName)) && (
                                <Typography sx={{ ...LoginFieldError(), mt: '4px', mb: 0 }}>{IncorrectDataFormat}</Typography>
                            )}
                        </Box>
                    </DialogContent>

                    {/* Przyciski operacyjne */}
                    <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', width: '100%', gap: '12px' }}>
                            {/* Przycisk Cancel */}
                            <Button
                                variant="outlined"
                                onClick={handleCloseModal}
                                sx={{
                                    flex: 1,
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    borderColor: colors.black,
                                    color: colors.black,
                                    fontSize: fontSizes?.medium || '1rem',
                                    fontWeight: '600',
                                    '&:hover': {
                                        borderColor: colors.darkgrey,
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    }
                                }}
                            >
                                Cancel
                            </Button>

                            {/* Przycisk Save - Blokowany przy złym formacie danych */}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!isFormValid}
                                sx={{
                                    flex: 1,
                                    backgroundColor: colors.black,
                                    color: colors.white,
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)',
                                    fontSize: fontSizes?.medium || '1rem',
                                    fontWeight: '600',
                                    '&:disabled': {
                                        backgroundColor: colors.darkgrey,
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        cursor: 'not-allowed',
                                        opacity: 0.6,
                                        boxShadow: 'none'
                                    },
                                    '&:hover': {
                                        backgroundColor: colors.darkgrey,
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)'
                                    }
                                }}
                            >
                                Save
                            </Button>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}