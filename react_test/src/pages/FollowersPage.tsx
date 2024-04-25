import { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Container } from '@mui/material';
import { useClient } from '../context/ClientContext.tsx';
import axios from 'axios';
import { Follower } from "../api/follower.ts";
import Header from "./HeaderPage.tsx";
import Footer from "../components/Footer.tsx";
import '../styles/FollowersPage.css';

function FollowersPage() {
    const { client } = useClient();
    const [followers, setFollowers] = useState<Follower[]>([]);

    useEffect(() => {
        const loadFollowers = async () => {
            try {
                const response = await axios.get(`http://192.168.1.125:8080/follows/followers?userId=${client.userId}`);
                setFollowers(response.data.follows);
                console.log("Follower werden geladen")
            } catch (error) {
                console.error('Fehler beim Laden der Follower:', error);
            }
        };

        loadFollowers();
    }, [client.userId]);

    return (
        <div>
            <Header />
            <Container maxWidth="md">
                <Typography variant="h4" align="center" gutterBottom>
                    Deine Follower:
                </Typography>
                <List className="followers-list">
                    {followers.map((follower) => (
                        <ListItem key={follower.userId} alignItems="flex-start" className="follower-item">
                            <ListItemAvatar>
                                <Avatar alt={follower.image} src={follower.image} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={follower.name}
                                secondary={follower.email}
                            />
                        </ListItem>
                    ))}
                </List>
                {followers.length === 0 && (
                    <Typography variant="subtitle1" align="center">Du hast keine Follower.</Typography>
                )}
            </Container>
            <Footer />
        </div>
    );
}

export default FollowersPage;
