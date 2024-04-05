import React from "react";
import Header from "./HeaderPage.tsx";
import { Typography, Box, Paper, Avatar } from "@mui/material";
import Footer from "../components/Footer.tsx";
import { useAuth } from "../components/AuthContext.tsx";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserDetailPage: React.FC = () => {
    const { authenticated, username, email } = useAuth();

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
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ width: 150, height: 150, mb: 2 }}>
                            <AccountCircleIcon sx={{ width: 80, height: 80 }} />
                        </Avatar>
                        <Typography variant="h5" gutterBottom sx={{ fontSize: '1.5rem' }}>
                            {username}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ fontSize: '1.2rem' }}>
                            {email}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ fontSize: '1.2rem' }}>
                            Status: Active
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>
                            Member since: April 2024
                        </Typography>
                    </Paper>
                )}
            </Box>
            <Footer />
        </div>
    );
};

export default UserDetailPage;
