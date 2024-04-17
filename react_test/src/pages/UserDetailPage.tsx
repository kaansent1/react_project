import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "./HeaderPage.tsx";
import {Typography, Box, Paper, Avatar, TextField, Button, Stack} from "@mui/material";
import Footer from "../components/Footer.tsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useClient} from "../context/ClientContext.tsx";
import axios from "axios";

const UserDetailPage: React.FC = () => {
    const {client, setClient} = useClient();
    const [username, setUsername] = useState(client.username);
    const [email, setEmail] = useState(client.email);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setUsername(client.username);
        setEmail(client.email);
        setIsEditing(false);
    };

    const handleSaveChanges = async () => {
        const response = await axios.put(`http://192.168.1.113:8080/profile/${client.userId}`, {
            userId: client.userId,
            username: username,
            email: email,
        });
        if (response.data.success) {
            setClient({...client, username: username, email: email});
            setIsEditing(false);
        } else {
            console.error("Fehler beim Speichern der Änderungen:", response.data.message);
        }
    };

    const handleGoBack = () => {
        navigate("/home");
    };

    return (
        <div>
            <Header/>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    mt: 4,
                }}
            >
                <Typography variant="h4" align="center" sx={{mb: 2}}>
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
                    <Avatar sx={{width: 150, height: 150, mb: 2}}>
                        <AccountCircleIcon sx={{width: 80, height: 80}}/>
                    </Avatar>
                    {isEditing ? (
                        <>
                            <TextField
                                label="Benutzername"
                                value={username}
                                onChange={handleUsernameChange}
                                sx={{marginBottom: 2}}
                            />
                            <TextField
                                label="E-Mail"
                                value={email}
                                onChange={handleEmailChange}
                                sx={{marginBottom: 2}}
                            />
                        </>
                    ) : (
                        <>
                            <Typography variant="body1" sx={{marginBottom: 2}}>
                                Benutzername: {username}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: 2}}>
                                E-Mail: {email}
                            </Typography>
                        </>
                    )}
                    <Stack direction="row" spacing={2} sx={{marginBottom: 2}}>
                        {isEditing ? (
                            <>
                                <Button variant="contained" onClick={handleSaveChanges}
                                        sx={{bgcolor: 'success.main', color: 'white'}}>Speichern</Button>
                                <Button variant="contained" onClick={handleCancel}
                                        sx={{bgcolor: 'success.main', color: 'white'}}>Abbrechen</Button>
                            </>
                        ) : (
                            <Button variant="contained" onClick={handleEdit}
                                    sx={{bgcolor: 'primary.main', color: 'white'}}>Bearbeiten</Button>
                        )}
                        {!isEditing && <Button variant="contained" onClick={handleGoBack}>Zurück</Button>}
                    </Stack>
                </Paper>
            </Box>
            <Footer/>
        </div>
    );
};

export default UserDetailPage;
