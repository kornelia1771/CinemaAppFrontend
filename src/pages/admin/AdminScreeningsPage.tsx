import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Box, Container, Paper, Typography, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import {Trash2, Pencil, Plus, ArrowLeft} from "lucide-react";
import HeaderAdmin from "../../components/HeaderAdmin";
import {colors} from "../../constants/theme";
import {
    AdminScreeningApi,
    MovieDetailsResponse,
    AdminScreeningRequest,
    ScreeningResponse
} from "../../api/admin/AdminScreeningsApi";
import {AdminHallsApi, AdminHallResponse} from "../../api/admin/AdminHallsApi";

export default function AdminScreeningsPage() {
    const {movieId} = useParams<{ movieId: string }>();
    const navigate = useNavigate();

    const [movieData, setMovieData] = useState<MovieDetailsResponse | null>(null);
    const [halls, setHalls] = useState<AdminHallResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [screeningToDelete, setScreeningToDelete] = useState<ScreeningResponse | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState<AdminScreeningRequest>({
        movieId: Number(movieId),
        hallId: '' as any, screeningTime: '', ticketPrice: '' as any
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [screeningToEdit, setScreeningToEdit] = useState<ScreeningResponse | null>(null);
    const [editForm, setEditForm] = useState<AdminScreeningRequest>({
        movieId: Number(movieId),
        hallId: '' as any, screeningTime: '', ticketPrice: '' as any
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        if (!movieId) {
            navigate("/admin/movies");
            return;
        }

        fetchData();
    }, [movieId, navigate]);

    const now = new Date();

    const minDateTime = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    )
        .toISOString()
        .slice(0, 16);

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const maxDateTime = new Date(
        maxDate.getTime() - maxDate.getTimezoneOffset() * 60000
    )
        .toISOString()
        .slice(0, 16);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [movieRes, hallsRes] = await Promise.all([
                AdminScreeningApi.getScreeningsForMovie(Number(movieId)),
                AdminHallsApi.getAllHalls()
            ]);
            setMovieData(movieRes);
            setHalls(hallsRes);
        } catch (err: any) {
            setApiError(err.message || "Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleOpenDelete = (screening: ScreeningResponse) => {
        setScreeningToDelete(screening);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!screeningToDelete) return;
        try {
            await AdminScreeningApi.deleteScreening(screeningToDelete.id);
            setApiSuccess("Screening deleted successfully.");
            fetchData();
        } catch (err: any) {
            setApiError(err.message || "Failed to delete screening.");
        } finally {
            setDeleteModalOpen(false);
            setScreeningToDelete(null);
        }
    };

    const handleOpenAdd = () => {
        setAddForm({
            movieId: Number(movieId),
            hallId: halls.length > 0 ? Number(halls[0].id) : ('' as any),
            screeningTime: '',
            ticketPrice: '' as any
        });
        setAddModalOpen(true);
    };

    const handleConfirmAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AdminScreeningApi.addScreening({
                movieId: Number(movieId),
                hallId: Number(addForm.hallId),
                screeningTime: addForm.screeningTime,
                ticketPrice: Number(addForm.ticketPrice)
            });
            setApiSuccess("Screening added successfully.");
            fetchData();
            setAddModalOpen(false);
        } catch (err: any) {
            setApiError(err.message || "Failed to add screening.");
        }
    };

    const handleOpenEdit = (screening: ScreeningResponse) => {
        setScreeningToEdit(screening);

        let currentHallId = screening.hallId ?? (screening as any).hall?.id;

        if (!currentHallId && screening.hallName) {
            const matchedHall = halls.find(h => h.name === screening.hallName);
            if (matchedHall) {
                currentHallId = matchedHall.id;
            }
        }

        setEditForm({
            movieId: Number(movieId),
            hallId: currentHallId ? Number(currentHallId) : ('' as any),
            screeningTime: screening.screeningTime ? screening.screeningTime.substring(0, 16) : '',
            ticketPrice: screening.ticketPrice
        });
        setEditModalOpen(true);
    };

    const handleConfirmEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!screeningToEdit) return;
        try {
            await AdminScreeningApi.editScreening(screeningToEdit.id, {
                movieId: Number(movieId),
                hallId: Number(editForm.hallId),
                screeningTime: editForm.screeningTime,
                ticketPrice: Number(editForm.ticketPrice)
            });
            setApiSuccess("Screening updated successfully.");
            fetchData();
            setEditModalOpen(false);
        } catch (err: any) {
            setApiError(err.message || "Failed to update screening.");
        }
    };

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString("en-GB", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    return (
        <Box sx={{backgroundColor: colors.lightgrey, minHeight: "100vh", display: "flex", flexDirection: "column"}}>
            <HeaderAdmin title="CinemaApp - Admin" onSignOut={handleSignOut}/>

            <Container maxWidth="lg" sx={{mt: 6, mb: 4, flexGrow: 1}}>
                <Paper elevation={3} sx={{p: 4, borderRadius: "12px", position: "relative"}}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{position: 'absolute', left: 16, top: 16, color: colors.black}}
                    >
                        <ArrowLeft size={20}/>
                    </IconButton>
                    {loading ? (
                        <Box sx={{display: "flex", justifyContent: "center", my: 4}}>
                            <CircularProgress sx={{color: colors.black}}/>
                        </Box>
                    ) : (
                        <>
                            {movieData && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                    mb: 4,
                                    pb: 3,
                                    pt: 2,
                                    borderBottom: `1px solid ${colors.borderGrey}`
                                }}>
                                    {movieData.imageUrl && (
                                        <Box component="img" src={movieData.imageUrl} alt={movieData.title}
                                             sx={{width: 80, height: 120, borderRadius: '8px', objectFit: 'cover'}}/>
                                    )}
                                    <Box>
                                        <Typography variant="h5" sx={{fontWeight: 800, color: colors.black}}>
                                            {movieData.title}
                                        </Typography>
                                        <Typography variant="body2"
                                                    sx={{color: colors.darkgrey, mt: 0.5, maxWidth: 600}}>
                                            {movieData.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                                <Typography variant="h6" sx={{fontWeight: 700, color: colors.black}}>
                                    Screenings
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Plus size={18}/>}
                                    onClick={handleOpenAdd}
                                    disabled={halls.length === 0}
                                    sx={{
                                        backgroundColor: colors.black,
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {backgroundColor: colors.darkgrey}
                                    }}
                                >
                                    Add Screening
                                </Button>
                            </Box>

                            <TableContainer component={Paper} elevation={0} sx={{
                                border: `1px solid ${colors.borderGrey || "#ddd"}`,
                                borderRadius: "8px"
                            }}>
                                <Table sx={{minWidth: 650}}>
                                    <TableHead sx={{backgroundColor: "rgba(0,0,0,0.02)"}}>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: "bold"}}>Date & Time</TableCell>
                                            <TableCell sx={{fontWeight: "bold"}}>Hall</TableCell>
                                            <TableCell sx={{fontWeight: "bold", textAlign: "center"}}>Ticket
                                                Price</TableCell>
                                            <TableCell
                                                sx={{fontWeight: "bold", textAlign: "center"}}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {movieData?.screenings?.map((screening) => (
                                            <TableRow key={screening.id}
                                                      sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                                                <TableCell
                                                    sx={{fontWeight: 500}}>{formatDateTime(screening.screeningTime)}</TableCell>
                                                <TableCell>
                                                    {screening.hallName || halls.find(h => Number(h.id) === Number(screening.hallId))?.name || `Hall ID: ${screening.hallId}`}
                                                </TableCell>
                                                <TableCell sx={{textAlign: "center", fontWeight: "bold"}}>
                                                    {Number(screening.ticketPrice).toFixed(2)} PLN
                                                </TableCell>
                                                <TableCell sx={{textAlign: "center"}}>
                                                    <IconButton onClick={() => handleOpenEdit(screening)} sx={{
                                                        color: colors.darkgrey,
                                                        "&:hover": {color: colors.black}
                                                    }}>
                                                        <Pencil size={18}/>
                                                    </IconButton>
                                                    <IconButton onClick={() => handleOpenDelete(screening)} sx={{
                                                        color: colors.red || "#d32f2f",
                                                        "&:hover": {color: "#b71c1c"}
                                                    }}>
                                                        <Trash2 size={18}/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {(!movieData?.screenings || movieData.screenings.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={4}
                                                           sx={{textAlign: "center", py: 4, color: colors.darkgrey}}>
                                                    No screenings scheduled for this movie.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </Paper>
            </Container>

            <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} fullWidth maxWidth="xs"
                    PaperProps={{sx: {borderRadius: '12px', p: 1}}}>
                {addModalOpen && (
                    <form onSubmit={handleConfirmAdd}>
                        <DialogTitle sx={{fontWeight: '700', color: colors.black}}>Add Screening</DialogTitle>
                        <DialogContent
                            sx={{display: 'flex', flexDirection: 'column', gap: '16px', pt: '12px !important'}}>

                            <FormControl fullWidth required>
                                <InputLabel id="add-hall-select-label">Hall</InputLabel>
                                <Select
                                    labelId="add-hall-select-label"
                                    value={addForm.hallId ? Number(addForm.hallId) : ''}
                                    label="Hall"
                                    onChange={(e) => setAddForm({...addForm, hallId: Number(e.target.value)})}
                                >
                                    {halls.map((hall) => (
                                        <MenuItem key={hall.id}
                                                  value={Number(hall.id)}>{hall.name} ({hall.totalSeats} seats)</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Screening Time"
                                type="datetime-local"
                                required
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                value={addForm.screeningTime}
                                onChange={(e) => setAddForm({...addForm, screeningTime: e.target.value})}
                                inputProps={{
                                    min: minDateTime,
                                    max: maxDateTime
                                }}
                            />

                            <TextField
                                label="Ticket Price (PLN)"
                                type="number"
                                required
                                fullWidth
                                inputProps={{min: 0, step: "0.01"}}
                                value={addForm.ticketPrice}
                                onChange={(e) => setAddForm({...addForm, ticketPrice: e.target.value as any})}
                            />

                        </DialogContent>
                        <DialogActions sx={{px: 3, pb: 2, mt: 1}}>
                            <Box sx={{display: 'flex', width: '100%', gap: '12px'}}>
                                <Button onClick={() => setAddModalOpen(false)} variant="outlined" sx={{
                                    flex: 1,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    borderColor: colors.black,
                                    color: colors.black,
                                    fontWeight: '600'
                                }}>Cancel</Button>
                                <Button type="submit" variant="contained" sx={{
                                    flex: 1,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    backgroundColor: colors.black,
                                    color: 'white',
                                    fontWeight: '600'
                                }}>Save</Button>
                            </Box>
                        </DialogActions>
                    </form>
                )}
            </Dialog>

            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="xs"
                    PaperProps={{sx: {borderRadius: '12px', p: 1}}}>
                {editModalOpen && (
                    <form onSubmit={handleConfirmEdit}>
                        <DialogTitle sx={{fontWeight: '700', color: colors.black}}>Edit Screening</DialogTitle>
                        <DialogContent
                            sx={{display: 'flex', flexDirection: 'column', gap: '16px', pt: '12px !important'}}>

                            <FormControl fullWidth required>
                                <InputLabel id="edit-hall-select-label">Hall</InputLabel>
                                <Select
                                    labelId="edit-hall-select-label"
                                    value={editForm.hallId ? Number(editForm.hallId) : ''}
                                    label="Hall"
                                    onChange={(e) => setEditForm({...editForm, hallId: Number(e.target.value)})}
                                >
                                    {halls.map((hall) => (
                                        <MenuItem key={hall.id}
                                                  value={Number(hall.id)}>{hall.name} ({hall.totalSeats} seats)</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Screening Time"
                                type="datetime-local"
                                required
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                value={editForm.screeningTime}
                                onChange={(e) => setEditForm({...editForm, screeningTime: e.target.value})}
                                inputProps={{
                                    min: minDateTime,
                                    max: maxDateTime
                                }}
                            />

                            <TextField
                                label="Ticket Price (PLN)"
                                type="number"
                                required
                                fullWidth
                                inputProps={{min: 0, step: "0.01"}}
                                value={editForm.ticketPrice}
                                onChange={(e) => setEditForm({...editForm, ticketPrice: e.target.value as any})}
                            />

                        </DialogContent>
                        <DialogActions sx={{px: 3, pb: 2, mt: 1}}>
                            <Box sx={{display: 'flex', width: '100%', gap: '12px'}}>
                                <Button onClick={() => setEditModalOpen(false)} variant="outlined" sx={{
                                    flex: 1,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    borderColor: colors.black,
                                    color: colors.black,
                                    fontWeight: '600'
                                }}>Cancel</Button>
                                <Button type="submit" variant="contained" sx={{
                                    flex: 1,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    backgroundColor: colors.black,
                                    color: 'white',
                                    fontWeight: '600'
                                }}>Save</Button>
                            </Box>
                        </DialogActions>
                    </form>
                )}
            </Dialog>

            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} fullWidth maxWidth="xs"
                    PaperProps={{sx: {borderRadius: '12px', p: 1}}}>
                <DialogTitle sx={{fontWeight: '700', color: colors.black}}>Delete Screening</DialogTitle>
                <DialogContent sx={{pt: '12px !important'}}>
                    <Typography variant="body1" sx={{color: colors.black}}>
                        Are you sure you want to delete the screening scheduled
                        for <strong>{screeningToDelete ? formatDateTime(screeningToDelete.screeningTime) : ''}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 2, mt: 1}}>
                    <Box sx={{display: 'flex', width: '100%', gap: '12px'}}>
                        <Button onClick={() => setDeleteModalOpen(false)} variant="outlined" sx={{
                            flex: 1,
                            borderRadius: '8px',
                            textTransform: 'none',
                            borderColor: colors.black,
                            color: colors.black,
                            fontWeight: '600'
                        }}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} variant="contained" sx={{
                            flex: 1,
                            borderRadius: '8px',
                            textTransform: 'none',
                            backgroundColor: colors.black,
                            color: 'white',
                            fontWeight: '600',
                            '&:hover': {backgroundColor: colors.darkgrey}
                        }}>Delete</Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Snackbar open={apiError !== null} autoHideDuration={4000} onClose={() => setApiError(null)}
                      anchorOrigin={{vertical: "bottom", horizontal: "left"}}>
                <Alert onClose={() => setApiError(null)} severity="error" variant="filled"
                       sx={{width: "100%", borderRadius: "8px", fontWeight: 500}}>
                    {apiError}
                </Alert>
            </Snackbar>

            <Snackbar open={apiSuccess !== null} autoHideDuration={4000} onClose={() => setApiSuccess(null)}
                      anchorOrigin={{vertical: "bottom", horizontal: "left"}}>
                <Alert onClose={() => setApiSuccess(null)} severity="success" variant="filled"
                       sx={{width: "100%", borderRadius: "8px", fontWeight: 500}}>
                    {apiSuccess}
                </Alert>
            </Snackbar>
        </Box>
    );
}