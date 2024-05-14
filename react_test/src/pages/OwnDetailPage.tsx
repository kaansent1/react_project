import React, {useEffect, useState} from 'react';
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import {Avatar, Box, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import axios from "axios";
import {useClient} from '../context/ClientContext';
import Footer from "../components/Footer.tsx";
import Header from "./HeaderPage.tsx";
import {useNavigate} from "react-router-dom";

interface ProfileFormData {
    userId: string;
    username: string;
    email: string;
    image?: string
}

const OwnDetailPage = () => {
    const {handleSubmit, register, reset} = useForm<ProfileFormData>();
    const {client} = useClient();
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (client.userId == 0) {
            navigate("/")
        }
    }, [client.userId, navigate]);

    async function onSubmit(data: ProfileFormData) {
        const formData = new FormData();
        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }
        formData.append('profile_data', JSON.stringify({
            email: data.email,
            userId: client.userId,
            username: data.username
        }));

        const response = await axios.put('http://192.168.1.125:8080/profile/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response)

        reset();
        setEditMode(false);
    }

    const toggleEditMode = () => {
        setEditMode(prevMode => !prevMode);
    };

    const handleEditButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toggleEditMode();
    };

    return (
        <>
            <Header/>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minHeight: "40vh",
                    marginTop: "20px",
                }}
            >
                <Box sx={{display: "flex", flexDirection: "column", gap: 2, alignItems: "center"}}>
                    <Avatar alt="Profilbild" src={client.image} sx={{width: 120, height: 120}}/>
                    <Typography variant="h5">{client.username}</Typography>
                    <Typography variant="body1">{client.email}</Typography>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, width: "40vh"}}>
                        <TextField
                            label="Username"
                            {...register("username")}
                            multiline
                            rows={1}
                            variant="outlined"
                            defaultValue={client.username}
                            sx={{marginBottom: 2, height: "auto"}}
                            disabled={!editMode}
                        />
                        <TextField
                            label="Email"
                            {...register("email")}
                            multiline
                            rows={1}
                            variant="outlined"
                            defaultValue={client.email}
                            sx={{marginBottom: 2, height: "auto"}}
                            disabled={!editMode}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            disabled={!editMode}
                        />
                        <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                            {editMode ? (
                                <Button color="primary" type="submit">
                                    Speichern
                                </Button>
                            ) : (
                                <Button color="success" startIcon={<AddIcon/>} onClick={handleEditButtonClick}>
                                    {editMode ? "Speichern" : "Bearbeiten"}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </form>
            </Box>
            <Footer/>
        </>
    );
};

export default OwnDetailPage;
