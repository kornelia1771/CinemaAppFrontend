import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import { User, IdCard, Mail, Pencil } from 'lucide-react';
import { colors, fontSizes } from '../../constants/theme';
import Header from '../../components/Header';

// Importy z UserAPI
import { getUserData, updateUserData } from '../../api/user/UserApi';

// Import walidacji i pomocników
import { capitalizeFirst } from '../../helper/LoginHelper';
import { nameRegex, surnameRegex, nameOnlyRegex } from "../../helper/SharedHeper";
import { IncorrectDataFormat } from '../../strings/loginStrings';
import { LoginFieldError } from '../../styles/LoginStyles';

export default function ProfilePage() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ firstName: '', lastName: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '' });
    const [touchedName, setTouchedName] = useState(false);
    const [touchedSurname, setTouchedSurname] = useState(false);

    // Pobieranie danych z backendu
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

    const isFormValid = nameRegex.test(editForm.firstName) && surnameRegex.test(editForm.lastName);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            await updateUserData(editForm.firstName, editForm.lastName);
            setUser((prev) => ({ ...prev, firstName: editForm.firstName, lastName: editForm.lastName }));
            setIsModalOpen(false);
        } catch (error) {
            console.error("Błąd zapisu", error);
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ backgroundColor: '#eeeeee', borderRadius: '50%', p: 2, display: 'inline-flex', marginBottom: '16px' }}>
                            <User size={40} color={colors.black} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: '700', color: colors.black }}>Hello {user.firstName}!</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', textAlign: 'left' }}>
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

                        <Box sx={{ mt: 2, width: '100%' }}>
                            <Button
                                onClick={handleOpenModal}
                                sx={{
                                    width: '100%',
                                    backgroundColor: colors.black,
                                    color: colors.white,
                                    padding: '10px 24px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontSize: fontSizes?.medium || '1rem',
                                    fontWeight: '600',
                                    '&:hover': { backgroundColor: colors.darkgrey }
                                }}
                            >
                                Edit Data
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>

            {/* Dialog z Twoimi oryginalnymi stylami */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
                <form onSubmit={handleSave} noValidate>
                    <DialogTitle sx={{ fontWeight: '700', color: colors.black }}>Edit Profile Data</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px', pt: '12px !important' }}>
                        <TextField label="First Name" fullWidth value={editForm.firstName} onChange={(e) => {
                            const sanitized = e.target.value.replace(nameOnlyRegex, '');
                            setEditForm({ ...editForm, firstName: capitalizeFirst(sanitized) });
                            setTouchedName(true);
                        }} />
                        <TextField label="Last Name" fullWidth value={editForm.lastName} onChange={(e) => {
                            const sanitized = e.target.value.replace(nameOnlyRegex, '');
                            setEditForm({ ...editForm, lastName: capitalizeFirst(sanitized) });
                            setTouchedSurname(true);
                        }} />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', width: '100%', gap: '12px' }}>
                            <Button onClick={handleCloseModal} sx={{
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
                            }} variant="outlined">Cancel</Button>
                            <Button type="submit" disabled={!isFormValid} sx={{
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
                            }} variant="contained">Save</Button>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}