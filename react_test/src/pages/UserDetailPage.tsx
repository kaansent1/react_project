import React from "react";
import Header from "./HeaderPage.tsx";
import { Typography, Box, Paper, Avatar} from "@mui/material";
import Footer from "../components/Footer.tsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useClient} from "../context/ClientContext.tsx";

const UserDetailPage: React.FC = () => {

    const { client } = useClient()


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
                            <>
                                <Typography variant="h5" gutterBottom sx={{ fontSize: '1.5rem' }}>
                                    {client.username}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ fontSize: '1.2rem' }}>
                                    {client.email}
                                </Typography>
                            </>
                    </Paper>
            </Box>
            <Footer />
        </div>
    );
};

export default UserDetailPage;
