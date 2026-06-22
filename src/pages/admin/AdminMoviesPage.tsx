import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Box, Container, Paper, Typography, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Switch, FormControlLabel, Chip
} from "@mui/material";
import {Trash2, Pencil, Plus, Image as ImageIcon} from "lucide-react";
import HeaderAdmin from "../../components/HeaderAdmin";
import {colors} from "../../constants/theme";
import {AdminMovieApi, AdminMovieResponse, AdminMovieRequest} from "../../api/admin/AdminMoviesApi";

export default function AdminMoviesPage() {
    const navigate = useNavigate();

    const [movies, setMovies] = useState<AdminMovieResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState<AdminMovieResponse | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState<AdminMovieRequest>({
        title: "",
        description: "",
        duration: 0,
        imageUrl: "",
        available: true
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [movieToEdit, setMovieToEdit] = useState<AdminMovieResponse | null>(null);
    const [editForm, setEditForm] = useState<AdminMovieRequest>({
        title: "",
        description: "",
        duration: 0,
        imageUrl: "",
        available: true
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchMovies();
    }, [navigate]);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const data = await AdminMovieApi.getAllMovies();
            setMovies(data);
        } catch (err: any) {
            setApiError(err.message || "Failed to load movies.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleRowClick = (movieId: number) => {
        navigate(`/admin/screenings/${movieId}`);
    };

    const handleOpenDelete = (e: React.MouseEvent, movie: AdminMovieResponse) => {
        e.stopPropagation();
        setMovieToDelete(movie);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!movieToDelete) return;
        try {
            await AdminMovieApi.deleteMovie(movieToDelete.id);
            setApiSuccess("Movie deleted successfully.");
            fetchMovies();
        } catch (err: any) {
            setApiError(err.message || "Failed to delete movie.");
        } finally {
            setDeleteModalOpen(false);
            setMovieToDelete(null);
        }
    };

    const handleOpenAdd = () => {
        setAddForm({title: "", description: "", duration: "" as any, imageUrl: "", available: true});
        setAddModalOpen(true);
    };

    const handleConfirmAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AdminMovieApi.addMovie({
                title: addForm.title,
                description: addForm.description,
                duration: Number(addForm.duration),
                imageUrl: addForm.imageUrl,
                available: addForm.available
            });
            setApiSuccess("Movie added successfully.");
            fetchMovies();
            setAddModalOpen(false);
        } catch (err: any) {
            setApiError(err.message || "Failed to add movie.");
        }
    };

    const handleOpenEdit = (e: React.MouseEvent, movie: AdminMovieResponse) => {
        e.stopPropagation();
        setMovieToEdit(movie);
        setEditForm({
            title: movie.title,
            description: movie.description,
            duration: movie.duration,
            imageUrl: movie.imageUrl,
            available: movie.available
        });
        setEditModalOpen(true);
    };

    const handleConfirmEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!movieToEdit) return;
        try {
            await AdminMovieApi.editMovie(movieToEdit.id, {
                title: editForm.title,
                description: editForm.description,
                duration: Number(editForm.duration),
                imageUrl: editForm.imageUrl,
                available: editForm.available
            });
            setApiSuccess("Movie updated successfully.");
            fetchMovies();
            setEditModalOpen(false);
        } catch (err: any) {
            setApiError(err.message || "Failed to update movie.");
        }
    };

    return (
        <Box sx={{backgroundColor: colors.lightgrey, minHeight: "100vh", display: "flex", flexDirection: "column"}}>
            <HeaderAdmin title="CinemaApp - Admin" onSignOut={handleSignOut}/>

            <Container maxWidth="lg" sx={{mt: 6, mb: 4, flexGrow: 1}}>
                <Paper elevation={3} sx={{p: 4, borderRadius: "12px"}}>

                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                        <Typography variant="h5" sx={{fontWeight: 700, color: colors.black}}>
                            Movies Management
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Plus size={18}/>}
                            onClick={handleOpenAdd}
                            sx={{
                                backgroundColor: colors.black,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {backgroundColor: colors.darkgrey}
                            }}
                        >
                            Add Movie
                        </Button>
                    </Box>

                    {loading ? (
                        <Box sx={{display: "flex", justifyContent: "center", my: 4}}>
                            <CircularProgress sx={{color: colors.black}}/>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0}
                                        sx={{border: `1px solid ${colors.borderGrey || "#ddd"}`, borderRadius: "8px"}}>
                            <Table sx={{minWidth: 800}}>
                                <TableHead sx={{backgroundColor: "rgba(0,0,0,0.02)"}}>
                                    <TableRow>
                                        <TableCell sx={{
                                            fontWeight: "bold",
                                            width: '80px',
                                            textAlign: 'center'
                                        }}>Poster</TableCell>
                                        <TableCell sx={{fontWeight: "bold"}}>Title</TableCell>
                                        <TableCell sx={{fontWeight: "bold", textAlign: "center"}}>Duration</TableCell>
                                        <TableCell sx={{fontWeight: "bold", textAlign: "center"}}>Status</TableCell>
                                        <TableCell sx={{fontWeight: "bold", textAlign: "center"}}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {movies.map((movie) => (
                                        <TableRow
                                            key={movie.id}
                                            hover
                                            onClick={() => handleRowClick(movie.id)}
                                            sx={{
                                                cursor: 'pointer',
                                                "&:last-child td, &:last-child th": {border: 0},
                                                "& td": {verticalAlign: "middle"}
                                            }}
                                        >
                                            <TableCell sx={{textAlign: "center"}}>
                                                {movie.imageUrl ? (
                                                    <Box
                                                        component="img"
                                                        src={movie.imageUrl}
                                                        alt={movie.title}
                                                        sx={{
                                                            width: 50,
                                                            height: 75,
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                            display: 'block',
                                                            margin: '0 auto'
                                                        }}
                                                    />
                                                ) : (
                                                    <Box sx={{
                                                        width: 50,
                                                        height: 75,
                                                        backgroundColor: '#eee',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '4px',
                                                        margin: '0 auto'
                                                    }}>
                                                        <ImageIcon size={24} color="#ccc"/>
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{fontWeight: 600}}>{movie.title}</TableCell>
                                            <TableCell sx={{textAlign: "center"}}>{movie.duration} min</TableCell>
                                            <TableCell sx={{textAlign: "center"}}>
                                                <Chip
                                                    label={movie.available ? "Available" : "Hidden"}
                                                    color={movie.available ? "success" : "default"}
                                                    size="small"
                                                    sx={{fontWeight: "bold", borderRadius: "6px"}}
                                                />
                                            </TableCell>
                                            <TableCell sx={{textAlign: "center"}}>
                                                <IconButton onClick={(e) => handleOpenEdit(e, movie)} sx={{
                                                    color: colors.darkgrey,
                                                    "&:hover": {color: colors.black}
                                                }}>
                                                    <Pencil size={18}/>
                                                </IconButton>
                                                <IconButton onClick={(e) => handleOpenDelete(e, movie)} sx={{
                                                    color: colors.red || "#d32f2f",
                                                    "&:hover": {color: "#b71c1c"}
                                                }}>
                                                    <Trash2 size={18}/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {movies.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5}
                                                       sx={{textAlign: "center", py: 4, color: colors.darkgrey}}>
                                                No movies found. Click "Add Movie" to start.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>

            <Dialog
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{sx: {borderRadius: '12px', p: 1}}}
            >
                <form onSubmit={handleConfirmAdd}>
                    <DialogTitle sx={{fontWeight: '700', color: colors.black}}>
                        Add New Movie
                    </DialogTitle>

                    <DialogContent sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        pt: '12px !important'
                    }}>
                        <TextField
                            label="Movie Title"
                            required
                            fullWidth
                            value={addForm.title}
                            onChange={(e) => setAddForm({...addForm, title: e.target.value})}
                        />

                        <TextField
                            label="Description"
                            required
                            fullWidth
                            multiline
                            rows={4}
                            value={addForm.description}
                            onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                        />

                        <TextField
                            label="Duration (minutes)"
                            type="number"
                            required
                            fullWidth
                            value={addForm.duration}
                            onChange={(e) => setAddForm({...addForm, duration: e.target.value as any})}
                            inputProps={{min: 1}}
                        />

                        <TextField
                            label="Poster Image URL"
                            required
                            fullWidth
                            value={addForm.imageUrl}
                            onChange={(e) => setAddForm({...addForm, imageUrl: e.target.value})}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={addForm.available}
                                    onChange={(e) => setAddForm({
                                        ...addForm,
                                        available: e.target.checked
                                    })}
                                    color="primary"
                                />
                            }
                            label="Available to Users"
                        />
                    </DialogContent>

                    <DialogActions sx={{px: 3, pb: 2, mt: 1}}>
                        <Box sx={{display: 'flex', width: '100%', gap: '12px'}}>
                            <Button
                                onClick={() => setAddModalOpen(false)}
                                variant="outlined"
                                sx={{
                                    flex: 1,
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    borderColor: colors.black,
                                    color: colors.black,
                                    fontWeight: '600',
                                    '&:hover': {
                                        borderColor: colors.darkgrey,
                                        backgroundColor: 'rgba(0,0,0,0.04)',
                                    }
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    flex: 1,
                                    backgroundColor: colors.black,
                                    color: colors.white,
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                                    fontWeight: '600',
                                    '&:hover': {
                                        backgroundColor: colors.darkgrey,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                                    }
                                }}
                            >
                                Save
                            </Button>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{sx: {borderRadius: '12px', p: 1}}}
            >
                <form onSubmit={handleConfirmEdit}>
                    <DialogTitle sx={{fontWeight: '700', color: colors.black}}>
                        Edit Movie
                    </DialogTitle>

                    <DialogContent sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        pt: '12px !important'
                    }}>
                        <TextField
                            label="Movie Title"
                            required
                            fullWidth
                            value={editForm.title}
                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        />

                        <TextField
                            label="Description"
                            required
                            fullWidth
                            multiline
                            rows={4}
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        />

                        <TextField
                            label="Duration (minutes)"
                            type="number"
                            required
                            fullWidth
                            value={editForm.duration}
                            onChange={(e) => setEditForm({...editForm, duration: e.target.value as any})}
                            inputProps={{min: 1}}
                        />

                        <TextField
                            label="Poster Image URL"
                            required
                            fullWidth
                            value={editForm.imageUrl}
                            onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editForm.available}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        available: e.target.checked
                                    })}
                                    color="primary"
                                />
                            }
                            label="Available to Users"
                        />
                    </DialogContent>

                    <DialogActions sx={{px: 3, pb: 2, mt: 1}}>
                        <Box sx={{display: 'flex', width: '100%', gap: '12px'}}>
                            <Button
                                onClick={() => setEditModalOpen(false)}
                                variant="outlined"
                                sx={{
                                    flex: 1,
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    borderColor: colors.black,
                                    color: colors.black,
                                    fontWeight: '600',
                                    '&:hover': {
                                        borderColor: colors.darkgrey,
                                        backgroundColor: 'rgba(0,0,0,0.04)',
                                    }
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    flex: 1,
                                    backgroundColor: colors.black,
                                    color: colors.white,
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                                    fontWeight: '600',
                                    '&:hover': {
                                        backgroundColor: colors.darkgrey,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                                    }
                                }}
                            >
                                Save
                            </Button>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{sx: {borderRadius: '12px', p: 1}}}
            >
                <DialogTitle sx={{fontWeight: '700', color: colors.black}}>
                    Delete Movie
                </DialogTitle>

                <DialogContent sx={{pt: '12px !important'}}>
                    <Typography sx={{color: colors.black}}>
                        Are you sure you want to delete movie:{" "}
                        <strong>{movieToDelete?.title}</strong>?
                    </Typography>
                </DialogContent>

                <DialogActions sx={{px: 3, pb: 2, mt: 1}}>
                    <Box sx={{display: 'flex', width: '100%', gap: '12px'}}>
                        <Button
                            onClick={() => setDeleteModalOpen(false)}
                            variant="outlined"
                            sx={{
                                flex: 1,
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                borderColor: colors.black,
                                color: colors.black,
                                fontWeight: '600',
                                '&:hover': {
                                    borderColor: colors.darkgrey,
                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                }
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleConfirmDelete}
                            variant="contained"
                            sx={{
                                flex: 1,
                                backgroundColor: colors.black,
                                color: colors.white,
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                                fontWeight: '600',
                                '&:hover': {
                                    backgroundColor: colors.darkgrey,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                                }
                            }}
                        >
                            Delete
                        </Button>
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