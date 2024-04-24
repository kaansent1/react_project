import React, { useState, useEffect } from "react";
import Header from "./HeaderPage.tsx";
import {
    Container,
    Typography,
    Grid,
    Button
} from "@mui/material";
import Footer from "../components/Footer.tsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useClient } from "../context/ClientContext.tsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { User } from "../api/user.ts";
import { Post } from "../api/post.ts";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BackButton from "../components/BackButton";

const UserDetailPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const { client } = useClient();
    const navigate = useNavigate();
    const { userId } = useParams<{ userId?: string }>();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://192.168.1.125:8080/profile/${userId}?currentUserId=${client.userId}`);
                setUser(response.data.profile);
            } catch (error) {
                console.error('Fehler beim Abrufen des Benutzers:', error);
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://192.168.1.125:8080/posts/${userId}?currentUserId=${client.userId}`);
                setPosts(response.data.posts);
            } catch (error) {
                console.error('Fehler beim Abrufen der Posts:', error);
            }
        };

        if (userId) {
            fetchUser();
            fetchPosts();
        }
    }, [client.userId, userId]);

    const handlePostClick = (postId: number) => {
        navigate(`/detail/${postId}`);
    };

    const handleLikeClick = async (postId: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const userId = client.userId;
        const post = posts.find(post => post.postId === postId);

        if (!post) {
            console.error('Post not found.');
            return;
        }

        let response;

        if (post.isLiked) {
            response = await axios.delete('http://192.168.1.125:8080/post/likes/remove', { data: { userId, postId } });
        } else {
            response = await axios.post('http://192.168.1.125:8080/post/likes/add', { userId, postId });
        }

        if (response.data.success) {
            const updatedPosts = posts.map(p => {
                if (p.postId === postId) {
                    return {
                        ...p,
                        isLiked: !post.isLiked,
                        likesCount: post.isLiked ? p.likesCount - 1 : p.likesCount + 1
                    };
                }
                return p;
            });

            setPosts(updatedPosts);
        } else {
            console.error(response.data.message);
        }
    };

    return (
        <>
            <Header/>
            <div style={{ overflow: 'auto',height: 'calc(100vh - 170px)', padding: '20px' }}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} alignItems="center" justifyContent="center">
                        <Container sx={{ borderRadius: '4px', width: 'fit-content', maxWidth: '200px' }}>
                            {user?.image ? (
                                <img src={user.image} alt="Profilbild" style={{ width: '10rem', height: '10rem', borderRadius: '50%' }} />
                            ) : (
                                <AccountCircleIcon style={{ marginRight: '1rem', fontSize: '3.5rem' }} />
                            )}
                        </Container>
                    </Grid>
                    <Grid container justifyContent="center" alignItems="center" direction="column">
                        <Typography variant="h4" gutterBottom>
                            {user?.username}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {user?.email}
                        </Typography>
                    </Grid>
                </Grid>
                {posts.length > 0 ? (
                    <Container maxWidth="md" style={{ marginTop: '20px' }}>
                        {posts.map((post) => (
                            <Container
                                key={post.postId}
                                sx={{
                                    padding: '20px',
                                    marginBottom: '20px',
                                    backgroundColor: '#3a5169',
                                    color: 'white',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handlePostClick(post.postId)}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        {post.userImage ? (
                                            <img src={post.userImage} alt="Profile" style={{ marginRight: '1rem', width: '5rem', height: '5rem', borderRadius: '50%' }} />
                                        ) : (
                                            <AccountCircleIcon sx={{ marginRight: '1rem', fontSize: '3.5rem' }} />
                                        )}
                                        <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                            {post.username}
                                        </Typography>
                                        <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                            {post.text}
                                        </Typography>
                                        {post.image && (
                                            <div style={{
                                                width: '100%',
                                                height: 'auto',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <img src={post.image} alt="" style={{ maxWidth: '90%', maxHeight: '50vh', marginBottom: '1rem' }} />
                                            </div>
                                        )}
                                        <Button
                                            onClick={(e) => handleLikeClick(post.postId, e)}
                                            startIcon={post.isLiked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                                            style={{ color: post.isLiked ? 'red' : 'white' }}
                                        >
                                            {post.likesCount}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Container>
                        ))}
                    </Container>
                ) : (
                    <Typography variant="h6" style={{ marginTop: '20px' }}>
                        Dieser Nutzer hat noch keine Posts
                    </Typography>
                )}
            </div>
            <BackButton />
            <Footer/>
        </>
    );
};

export default UserDetailPage;
