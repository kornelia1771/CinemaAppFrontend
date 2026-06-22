import React from "react";
import {
    Box, Button, Container, Paper, Typography,
} from "@mui/material";
import {ShieldX} from "lucide-react";
import {useNavigate} from "react-router-dom";

const AccessDeniedPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        p: 5,
                        width: "100%",
                        textAlign: "center",
                        borderRadius: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 2,
                        }}
                    >
                        <ShieldX
                            size={80}
                            color="#d32f2f"
                            strokeWidth={1.8}
                        />
                    </Box>

                    <Typography
                        variant="h2"
                        color="error"
                        fontWeight={700}
                        gutterBottom
                    >
                        403
                    </Typography>

                    <Typography
                        variant="h5"
                        gutterBottom
                    >
                        Access denied
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{mb: 4}}
                    >
                        You do not have access to this page.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default AccessDeniedPage;