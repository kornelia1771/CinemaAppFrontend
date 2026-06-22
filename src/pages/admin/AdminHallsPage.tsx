import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Container, Paper, Typography, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import { Trash2, Pencil, Plus } from "lucide-react";
import HeaderAdmin from "../../components/HeaderAdmin";
import { colors } from "../../constants/theme";
import { AdminHallsApi, AdminHallResponse, AdminHallRequest } from "../../api/AdminHallsApi";

export default function AdminHallsPage() {
    const navigate = useNavigate();

    const [halls, setHalls] = useState<AdminHallResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);

    // Stany Modali
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [hallToDelete, setHallToDelete] = useState<AdminHallResponse | null>(null);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState<AdminHallRequest>({ name: "", totalSeats: 0 });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [hallToEdit, setHallToEdit] = useState<AdminHallResponse | null>(null);
    const [editForm, setEditForm] = useState<AdminHallRequest>({ name: "", totalSeats: 0 });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        fetchHalls();
    }, [navigate]);

    const fetchHalls = async () => {
        try {
            setLoading(true);
            const data = await AdminHallsApi.getAllHalls();
            setHalls(data);
        } catch (err: any) {
            setApiError(err.message || "Failed to load halls.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // --- DELETE LOGIC ---
    const handleOpenDelete = (hall: AdminHallResponse) => {
        setHallToDelete(hall);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!hallToDelete) return;
        try {
            await AdminHallsApi.deleteHall(hallToDelete.id);
            setApiSuccess("Hall deleted successfully.");
            fetchHalls();
        } catch (err: any) {
            setApiError(err.message || "Failed to delete hall.");
        } finally {
            setDeleteModalOpen(false);
            setHallToDelete(null);
        }
    };

    // --- ADD LOGIC ---
    const handleOpenAdd = () => {
        setAddForm({ name: "", totalSeats: "" as any });
        setAddModalOpen(true);
    };

    const handleConfirmAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AdminHallsApi.addHall({
                name: addForm.name,
                totalSeats: Number(addForm.totalSeats)
            });
            setApiSuccess("Hall added successfully.");
            fetchHalls();
            setAddModalOpen(false);
        } catch (err: any) {
            setApiError(err.message || "Failed to add hall.");
        }
    };

    // --- EDIT LOGIC ---
    const handleOpenEdit = (hall: AdminHallResponse) => {
        setHallToEdit(hall);
        setEditForm({
            name: hall.name,
            totalSeats: hall.totalSeats
        });
        setEditModalOpen(true);
    };

    const handleConfirmEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hallToEdit) return;
        try {
            await AdminHallsApi.editHall(hallToEdit.id, {
                name: editForm.name,
                totalSeats: Number(editForm.totalSeats)
            });
            setApiSuccess("Hall updated successfully.");
            fetchHalls();
            setEditModalOpen(false);
        } catch (err: any) {
            setApiError(err.message || "Failed to update hall.");
        }
    };

    return (
        <Box sx={{ backgroundColor: colors.lightgrey, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <HeaderAdmin title="CinemaApp - Admin" onSignOut={handleSignOut} />

            <Container maxWidth="lg" sx={{ mt: 6, mb: 4, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>

                    {/* TOP BAR */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.black }}>
                            Halls Management
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
                            Add Hall
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
                                        <TableCell sx={{ fontWeight: "bold" }}>Hall Name</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Total Seats</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {halls.map((hall) => (
                                        <TableRow key={hall.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "& td": { verticalAlign: "middle" } }}>
                                            <TableCell>{hall.name}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>{hall.totalSeats}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                <IconButton onClick={() => handleOpenEdit(hall)} sx={{ color: colors.darkgrey, "&:hover": { color: colors.black } }}>
                                                    <Pencil size={18} />
                                                </IconButton>
                                                <IconButton onClick={() => handleOpenDelete(hall)} sx={{ color: colors.red || "#d32f2f", "&:hover": { color: "#b71c1c" } }}>
                                                    <Trash2 size={18} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {halls.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} sx={{ textAlign: "center", py: 3, color: colors.darkgrey }}>
                                                No halls found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>

            {/* --- ADD HALL MODAL --- */}
            <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
                <form onSubmit={handleConfirmAdd}>
                    <DialogTitle sx={{ fontWeight: '700', color: colors.black }}>Add New Hall</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px', pt: '12px !important' }}>
                        <TextField label="Hall Name" required fullWidth value={addForm.name} onChange={(e) => setAddForm({...addForm, name: e.target.value})} />
                        <TextField label="Total Seats" type="number" required fullWidth value={addForm.totalSeats} onChange={(e) => setAddForm({...addForm, totalSeats: e.target.value as any})} inputProps={{ min: 1 }} />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', width: '100%', gap: '12px' }}>
                            <Button onClick={() => setAddModalOpen(false)} variant="outlined" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', borderColor: colors.black, color: colors.black, fontWeight: '600', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>Cancel</Button>
                            <Button type="submit" variant="contained" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', backgroundColor: colors.black, color: 'white', fontWeight: '600', '&:hover': { backgroundColor: colors.darkgrey } }}>Save</Button>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>

            {/* --- EDIT HALL MODAL --- */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
                <form onSubmit={handleConfirmEdit}>
                    <DialogTitle sx={{ fontWeight: '700', color: colors.black }}>Edit Hall</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px', pt: '12px !important' }}>
                        <TextField label="Hall Name" required fullWidth value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                        <TextField label="Total Seats" type="number" required fullWidth value={editForm.totalSeats} onChange={(e) => setEditForm({...editForm, totalSeats: e.target.value as any})} inputProps={{ min: 1 }} />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', width: '100%', gap: '12px' }}>
                            <Button onClick={() => setEditModalOpen(false)} variant="outlined" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', borderColor: colors.black, color: colors.black, fontWeight: '600', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>Cancel</Button>
                            <Button type="submit" variant="contained" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', backgroundColor: colors.black, color: 'white', fontWeight: '600', '&:hover': { backgroundColor: colors.darkgrey } }}>Save</Button>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>

            {/* --- DELETE HALL MODAL --- */}
            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
                <DialogTitle sx={{ fontWeight: '700', color: colors.black }}>Delete Hall</DialogTitle>
                <DialogContent sx={{ pt: '12px !important' }}>
                    <Typography variant="body1" sx={{ color: colors.black }}>
                        Are you sure you want to delete hall: <strong>{hallToDelete?.name}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', width: '100%', gap: '12px' }}>
                        <Button onClick={() => setDeleteModalOpen(false)} variant="outlined" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', borderColor: colors.black, color: colors.black, fontWeight: '600', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} variant="contained" sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', backgroundColor: colors.black, color: 'white', fontWeight: '600', '&:hover': { backgroundColor: colors.darkgrey } }}>Delete</Button>
                    </Box>
                </DialogActions>
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