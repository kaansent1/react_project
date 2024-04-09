import React, { useState } from "react";
import Header from "./HeaderPage.tsx";
import { Typography, Box, Paper, Avatar, Button, TextField } from "@mui/material";
import Footer from "../components/Footer.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserDetailPage: React.FC = () => {
    const { authenticated, username: initialUsername, email: initialEmail, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(initialUsername);
    const [email, setEmail] = useState(initialEmail);

    const handleSaveChanges = () => {
        updateUser({ username, email });
        setIsEditing(false);
    };

    return (
        <div>
            <Header />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    mt: 4,
                }}
            >
                <Typography variant="h4" align="center" sx={{ mb: 2 }}>
                    Account Info
                </Typography>
                {authenticated && (
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            width: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ width: 150, height: 150, mb: 2 }}>
                            <AccountCircleIcon sx={{ width: 80, height: 80 }} />
                        </Avatar>
                        {isEditing ? (
                            <>
                                <TextField
                                    label="Username"
                                    variant="outlined"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <Button variant="contained" onClick={handleSaveChanges}>Speichern</Button>
                            </>
                        ) : (
                            <>
                                <Typography variant="h5" gutterBottom sx={{ fontSize: '1.5rem' }}>
                                    {username}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ fontSize: '1.2rem' }}>
                                    {email}
                                </Typography>
                                <Button variant="contained" onClick={() => setIsEditing(true)}>Bearbeiten</Button>
                            </>
                        )}
                    </Paper>
                )}
            </Box>
            <Footer />
        </div>
    );
};

export default UserDetailPage;
