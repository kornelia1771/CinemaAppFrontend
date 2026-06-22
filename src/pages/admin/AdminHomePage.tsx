import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Container, Paper, Typography, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Snackbar, Alert,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import { Trash2, Pencil, Plus } from "lucide-react";
import HeaderAdmin from "../../components/HeaderAdmin";
import { colors } from "../../constants/theme";
import { AdminUserApi, AdminUserResponse, AdminUserEditRequest, AdminRegisterRequest } from "../../api/AdminUserApi";

export default function AdminHomePage() {
    const navigate = useNavigate();

    const [users, setUsers] = useState<AdminUserResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);


    const [addModalOpen, setAddModalOpen] = useState(false);
    // Zmienione domyślne role na 'CLIENT'
    const [addForm, setAddForm] = useState<AdminRegisterRequest>({ firstName: '', lastName: '', email: '', password: '', roles: ['CLIENT'] });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<AdminUserResponse | null>(null);
    const [editForm, setEditForm] = useState<AdminUserEditRequest>({ firstName: '', lastName: '', email: '', enabled: true, roles: [] });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await AdminUserApi.getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setApiError(err.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    // --- ADD LOGIC ---
    const handleOpenAdd = () => {
        setAddForm({ firstName: '', lastName: '', email: '', password: '', roles: ['CLIENT'] });
        setAddModalOpen(true);
    };

    const handleConfirmAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AdminUserApi.registerAdmin(addForm);
            setApiSuccess("User registered successfully.");
            fetchUsers();
            setAddModalOpen(false);
        } catch (err: any) {
            setApiError(err.message || "Failed to register user.");
        }
    };

    // --- EDIT LOGIC ---
    const handleOpenEdit = (user: AdminUserResponse) => {
        setUserToEdit(user);
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            enabled: user.enabled,
            roles: user.roles || [],
            password: ''
        });
        setEditModalOpen(true);
    };

    const handleConfirmEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userToEdit) return;
        try {
            const payload = { ...editForm };
            if (!payload.password) delete payload.password;

            await AdminUserApi.editUser(userToEdit.id, payload);
            setApiSuccess("User updated successfully.");
            fetchUsers();
            setEditModalOpen(false);
        } catch (err: any) {
            setApiError(err.message || "Failed to update user.");
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <HeaderAdmin title="CinemaApp - Admin" onSignOut={handleSignOut} />

            <Container maxWidth="lg" sx={{ mt: 6, mb: 4, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>

                    {/* TOP BAR */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.black }}>
                            Users Management
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Plus size={18} />}
                            onClick={handleOpenAdd}
                            sx={{
                                backgroundColor: colors.black,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { backgroundColor: colors.darkgrey }
                            }}
                        >
                            Add User
                        </Button>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                            <CircularProgress sx={{ color: colors.black }} />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.borderGrey || "#ddd"}`, borderRadius: "8px" }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Roles</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "& td": { verticalAlign: "middle" } }}>
                                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                <Chip
                                                    label={user.enabled ? "Active" : "Disabled"}
                                                    color={user.enabled ? "success" : "default"}
                                                    size="small"
                                                    sx={{ fontWeight: "bold", borderRadius: "6px" }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 0.5 }}>
                                                    {user.roles?.map((role) => (
                                                        // Usunięte .replace("ROLE_", "") -> czysty CLIENT / ADMIN z backendu
                                                        <Chip key={role} label={role} size="small" variant="outlined" sx={{ borderRadius: "4px" }} />
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                <IconButton onClick={() => handleOpenEdit(user)} sx={{ color: colors.darkgrey, "&:hover": { color: colors.black } }}>
                                                    <Pencil size={18} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {users.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ textAlign: "center", py: 3, color: colors.darkgrey }}>
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>

            {/* --- ADD USER MODAL --- */}
            <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
                <form onSubmit={handleConfirmAdd}>
                    <DialogTitle sx={{ fontWeight: '700', color: colors.black }}>Add New User</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px', pt: '12px !important' }}>
                        <TextField label="First Name" required fullWidth value={addForm.firstName} onChange={(e) => setAddForm({...addForm, firstName: e.target.value})} />
                        <TextField label="Last Name" required fullWidth value={addForm.lastName} onChange={(e) => setAddForm({...addForm, lastName: e.target.value})} />
                        <TextField label="Email" type="email" required fullWidth value={addForm.email} onChange={(e) => setAddForm({...addForm, email: e.target.value})} />
                        <TextField label="Password" type="password" required fullWidth value={addForm.password} onChange={(e) => setAddForm({...addForm, password: e.target.value})} />

                        <FormControl fullWidth>
                            <InputLabel>Roles</InputLabel>
                            <Select multiple value={addForm.roles || []} label="Roles" onChange={(e) => setAddForm({...addForm, roles: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value})}>
                                <MenuItem value="CLIENT">CLIENT</MenuItem>
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                            </Select>
                        </FormControl>

                       </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', width: '100%', gap: '12px' }}>
                            <Button onClick={() => setAddModalOpen(false)} variant="outlined" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', borderColor: colors.black, color: colors.black, fontWeight: '600', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>Cancel</Button>
                            <Button type="submit" variant="contained" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', backgroundColor: colors.black, color: 'white', fontWeight: '600', '&:hover': { backgroundColor: colors.darkgrey } }}>Save</Button>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>

            {/* --- EDIT USER MODAL --- */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
                <form onSubmit={handleConfirmEdit}>
                    <DialogTitle sx={{ fontWeight: '700', color: colors.black }}>Edit User</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px', pt: '12px !important' }}>
                        <TextField label="First Name" required fullWidth value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} />
                        <TextField label="Last Name" required fullWidth value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} />
                        <TextField label="Email" type="email" required fullWidth value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
                        <TextField label="New Password (leave blank to keep current)" type="password" fullWidth value={editForm.password} onChange={(e) => setEditForm({...editForm, password: e.target.value})} />

                        <FormControl fullWidth>
                            <InputLabel>Roles</InputLabel>
                            <Select multiple value={editForm.roles || []} label="Roles" onChange={(e) => setEditForm({...editForm, roles: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value})}>
                                <MenuItem value="CLIENT">CLIENT</MenuItem>
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControlLabel control={<Switch checked={editForm.enabled} onChange={(e) => setEditForm({...editForm, enabled: e.target.checked})} color="primary" />} label="Account Enabled" />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', width: '100%', gap: '12px' }}>
                            <Button onClick={() => setEditModalOpen(false)} variant="outlined" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', borderColor: colors.black, color: colors.black, fontWeight: '600', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>Cancel</Button>
                            <Button type="submit" variant="contained" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', backgroundColor: colors.black, color: 'white', fontWeight: '600', '&:hover': { backgroundColor: colors.darkgrey } }}>Save</Button>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Snackbars */}
            <Snackbar open={apiError !== null} autoHideDuration={4000} onClose={() => setApiError(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={() => setApiError(null)} severity="error" variant="filled" sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}>
                    {apiError}
                </Alert>
            </Snackbar>

            <Snackbar open={apiSuccess !== null} autoHideDuration={4000} onClose={() => setApiSuccess(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={() => setApiSuccess(null)} severity="success" variant="filled" sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}>
                    {apiSuccess}
                </Alert>
            </Snackbar>
        </Box>
    );
}