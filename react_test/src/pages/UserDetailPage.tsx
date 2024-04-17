import React, { useState } from "react";
import Header from "./HeaderPage.tsx";
import { Typography, Box, Paper, Avatar, TextField, Button } from "@mui/material";
import Footer from "../components/Footer.tsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useClient } from "../context/ClientContext.tsx";
import axios from "axios";

const UserDetailPage: React.FC = () => {
    const { client, setClient } = useClient();
    const [username, setUsername] = useState(client.username);
    const [email, setEmail] = useState(client.email);
    const [isEditing, setIsEditing] = useState(false);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        const response = await axios.put(`http://192.168.1.113:8080/profile/${client.userId}`, {
            userId: client.userId,
            username: username,
            email: email,
        });
        if (response.data.success) {
            setClient({ ...client, username: username, email: email });
            setIsEditing(false);
        } else {
            console.error("Fehler beim Speichern der Änderungen:", response.data.message);
        }
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
                    <input type="file" style={{ display: "none" }} />
                    <TextField
                        label="Benutzername"
                        value={username}
                        onChange={handleUsernameChange}
                        sx={{ marginBottom: 2 }}
                        disabled={!isEditing}
                    />
                    <TextField
                        label="E-Mail"
                        value={email}
                        onChange={handleEmailChange}
                        sx={{ marginBottom: 2 }}
                        disabled={!isEditing}
                    />
                    {isEditing ? (
                        <Button variant="contained" onClick={handleSaveChanges}>Speichern</Button>
                    ) : (
                        <Button variant="contained" onClick={handleEdit}>Bearbeiten</Button>
                    )}
                </Paper>
            </Box>
            <Footer />
        </div>
    );
};

export default UserDetailPage;
