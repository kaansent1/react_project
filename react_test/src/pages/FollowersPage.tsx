import { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useClient } from '../context/ClientContext.tsx';
import axios from 'axios';
import { Follower } from "../api/follower.ts";
import Header from "./HeaderPage.tsx";
import Footer from "../components/Footer.tsx";
import PersonIcon from '@mui/icons-material/Person';
import '../styles/FollowersPage.css';

function FollowersPage() {
    const navigate = useNavigate();
    const { client } = useClient();
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [following, setFollowing] = useState<Follower[]>([]);
    const [showFollowers, setShowFollowers] = useState(true);

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

        const loadFollowing = async () => {
            try {
                const response = await axios.get(`http://192.168.1.125:8080/follows/following?userId=${client.userId}`);
                setFollowing(response.data.follows);
                console.log("Gefolgte Nutzer werden geladen")
            } catch (error) {
                console.error('Fehler beim Laden der gefolgten Nutzer:', error);
            }
        };

        loadFollowers();
        loadFollowing();
    }, [client.userId]);

    const handleShowFollowers = () => {
        setShowFollowers(true);
    };

    const handleShowFollowing = () => {
        setShowFollowers(false);
    };

    const handleProfileClick = (id: number) => {
        navigate(`/user/${id}`);
    };

    return (
        <div>
            <Header />
            <Container maxWidth="md">
                <div className="buttons-container">
                    <Button
                        onClick={handleShowFollowers}
                        variant={showFollowers ? "contained" : "outlined"}
                        className="follow-button"
                    >
                        Follower
                    </Button>
                    <Button
                        onClick={handleShowFollowing}
                        variant={showFollowers ? "outlined" : "contained"}
                        className="follow-button"
                    >
                        Folgende
                    </Button>
                </div>

                {showFollowers ? (
                    <div>
                        <Typography variant="h4" align="center" gutterBottom>
                            Deine Follower:
                        </Typography>
                        {followers.length > 0 ? (
                            <List className="followers-list">
                                {followers.map((follower) => (
                                    <ListItem key={follower.id} alignItems="flex-start" className="follower-item">
                                        <ListItemAvatar>
                                            <Avatar alt={follower.image} src={follower.image} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={follower.name}
                                            secondary={follower.email}
                                        />
                                        <div style={{display: "flex"}}>
                                            <Button onClick={() => handleProfileClick(follower.id)} size="small" className="profile-button" style={{marginLeft: "auto"}} >
                                                <PersonIcon fontSize="small" />
                                            </Button>
                                        </div>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="subtitle1" align="center" gutterBottom>
                                Du hast keine Follower.
                            </Typography>
                        )}
                    </div>
                ) : (
                    <div>
                        <Typography variant="h4" align="center" gutterBottom>
                            Du folgst:
                        </Typography>
                        {following.length > 0 ? (
                            <List className="following-list">
                                {following.map((followedUser) => (
                                    <ListItem key={followedUser.id} alignItems="flex-start" className="following-item">
                                        <ListItemAvatar>
                                            <Avatar alt={followedUser.image} src={followedUser.image} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={followedUser.name}
                                            secondary={followedUser.email}
                                        />
                                        <div style={{display: "flex"}}>
                                            <Button onClick={() => handleProfileClick(followedUser.id)} size="small"
                                                    className="profile-button" style={{marginLeft: "auto"}}>
                                                <PersonIcon fontSize="small"/>
                                            </Button>
                                        </div>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="subtitle1" align="center" gutterBottom>
                                Du folgst niemandem.
                            </Typography>
                        )}
                    </div>
                )}
            </Container>
            <Footer />
        </div>
    );
}

export default FollowersPage;
