import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import { User, IdCard, Mail, Pencil } from 'lucide-react';
import { colors, fontSizes } from '../../constants/theme';
import Header from '../../components/Header';

// Importy z UserAPI
import { getUserData, updateUserData } from '../../api/UserApi';

// Import walidacji i pomocników
import { capitalizeFirst } from '../../helper/LoginHelper';
import { nameRegex, surnameRegex, nameOnlyRegex } from "../../helper/SharedHeper";
import { IncorrectDataFormat } from '../../strings/loginStrings';
import { LoginFieldError, LoginSignInButton } from '../../styles/LoginStyles'; // Przywrócono LoginSignInButton

export default function ProfilePage() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ firstName: '', lastName: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '' });
    const [touchedName, setTouchedName] = useState(false);
    const [touchedSurname, setTouchedSurname] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData();
                setUser(data);
            } catch (err) {
                console.error("Błąd ładowania profilu", err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleOpenModal = () => {
        setEditForm({ firstName: user.firstName, lastName: user.lastName });
        setTouchedName(false);
        setTouchedSurname(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const isFormValid = (
        nameRegex.test(editForm.firstName) &&
        surnameRegex.test(editForm.lastName)
    );

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            await updateUserData(editForm.firstName, editForm.lastName);
            setUser((prev) => ({ ...prev, firstName: editForm.firstName, lastName: editForm.lastName }));
            setIsModalOpen(false);
        } catch (error) {
            console.error("Błąd aktualizacji", error);
            alert("Nie udało się zaktualizować danych.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="CinemaApp" onSignOut={handleSignOut} />

            <Container maxWidth="md" sx={{ mt: 6, mb: 4, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
                    {/* Reszta UI z Twoimi oryginalnymi stylami */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ backgroundColor: '#eeeeee', borderRadius: '50%', p: 2, display: 'inline-flex', marginBottom: '16px' }}>
                            <User size={40} color={colors.black} />
                        </Box>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: '700', color: colors.black }}>
                            Hello {user.firstName}!
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', textAlign: 'left' }}>
                        {/* Pola danych zachowujące oryginalny layout */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '2px' }}>
                                <User size={14} color={colors.darkgrey} />
                                <Typography variant="caption" sx={{ color: colors.darkgrey, fontWeight: '600', textTransform: 'uppercase' }}>Name</Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: '600', color: colors.black, pl: '20px' }}>{user.firstName}</Typography>
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '2px' }}>
                                <IdCard size={14} color={colors.darkgrey} />
                                <Typography variant="caption" sx={{ color: colors.darkgrey, fontWeight: '600', textTransform: 'uppercase' }}>Surname</Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: '600', color: colors.black, pl: '20px' }}>{user.lastName}</Typography>
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '2px' }}>
                                <Mail size={14} color={colors.darkgrey} />
                                <Typography variant="caption" sx={{ color: colors.darkgrey, fontWeight: '600', textTransform: 'uppercase' }}>Email</Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: '600', color: colors.black, pl: '20px' }}>{user.email}</Typography>
                        </Box>

                        {/* Przywrócono styl przycisku Edit Data */}
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<Pencil size={16} />}
                            onClick={handleOpenModal}
                            sx={{ ...LoginSignInButton(), mt: 2 }} // Użycie oryginalnego stylu przycisku
                        >
                            Edit Data
                        </Button>
                    </Box>
                </Paper>
            </Container>

            {/* Dialog z oryginalnymi stylami */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
                <form onSubmit={handleSave} noValidate>
                    <DialogTitle sx={{ fontWeight: '700', color: colors.black }}>Edit Profile Data</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px', pt: '12px !important' }}>
                        <TextField label="First Name" fullWidth required value={editForm.firstName} onChange={(e) => {
                            const sanitized = e.target.value.replace(nameOnlyRegex, '');
                            setEditForm({ ...editForm, firstName: capitalizeFirst(sanitized) });
                            setTouchedName(true);
                        }} />
                        {touchedName && !nameRegex.test(editForm.firstName) && <Typography sx={LoginFieldError()}>{IncorrectDataFormat}</Typography>}

                        <TextField label="Last Name" fullWidth required value={editForm.lastName} onChange={(e) => {
                            const sanitized = e.target.value.replace(nameOnlyRegex, '');
                            setEditForm({ ...editForm, lastName: capitalizeFirst(sanitized) });
                            setTouchedSurname(true);
                        }} />
                        {touchedSurname && !surnameRegex.test(editForm.lastName) && <Typography sx={LoginFieldError()}>{IncorrectDataFormat}</Typography>}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleCloseModal} sx={{ color: colors.black }}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={!isFormValid} sx={LoginSignInButton()}>Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}