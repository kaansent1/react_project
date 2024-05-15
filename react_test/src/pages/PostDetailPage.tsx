import React, { useState, useEffect } from "react";
import Header from "./HeaderPage.tsx";
import { Container, Typography, Button, TextField, Grid, IconButton } from "@mui/material";
import Footer from "../components/Footer.tsx";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useClient } from "../context/ClientContext.tsx";
import { Post } from "../api/post.ts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import BackButton from "../components/BackButton.tsx";

const PostDetailPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [editingText, setEditingText] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const { postId } = useParams<{ postId?: string }>();
    const { client } = useClient();
    const navigate = useNavigate();

    useEffect(() => {
        if(client.userId == 0){
            navigate("/")
        }
    }, [client.userId, navigate]);

    useEffect(() => {
        if (postId) {
            const postIdAsNumber = parseInt(postId, 10);
            const currentUserId = client.userId;
            const fetchPost = async () => {
                try {
                    const response = await axios.get(`http://192.168.1.125:8080/post/${postIdAsNumber}?currentUserId=${currentUserId}`);
                    setPost(response.data.post);
                    setEditingText(response.data.post.text);
                    setIsLiked(response.data.post.isLiked);
                } catch (error) {
                    console.error('Fehler beim Abrufen des Posts:', error);
                }
            };

            fetchPost();
        }
    }, [client.userId, postId]);

    const handleEditButtonClick = async () => {
        if (post) {
            if (isEditing) {
                const newData = { text: editingText, userId: client.userId, username: client.username };
                try {
                    await axios.put(`http://192.168.1.125:8080/post/${post.postId}/edit`, newData);
                    console.log("Post erfolgreich bearbeitet!");
                    setIsEditing(false);
                    const updatedPostResponse = await axios.get(`http://192.168.1.125:8080/post/${post.postId}?currentUserId=${client.userId}`);
                    setPost(updatedPostResponse.data.post);
                } catch (error) {
                    console.error('Fehler beim Bearbeiten des Posts:', error);
                }
            } else {
                setIsEditing(true);
            }
        }
    };

    const handleLikeButtonClick = async () => {
        const userId = client.userId;

        if (isLiked) {
            await axios.delete('http://192.168.1.125:8080/post/likes/remove', { data: { userId, postId } });
        } else {
            await axios.post('http://192.168.1.125:8080/post/likes/add', { userId, postId });
        }
        setIsLiked(!isLiked);
    };

    if (!post) {
        return (
            <div>
                <Header />
                <Typography variant="h4" align="center" sx={{ mb: 2, mt: 4 }}>
                    Laden...
                </Typography>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <Header />
            <Container
                sx={{
                    width: '100%',
                    padding: 4,
                    marginTop: '5rem',
                    backgroundColor: '#3a5169',
                    color: 'white',
                    maxHeight: '70vh',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'left',
                }}
            >
                <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={1}>
                        {post.userImage ? (
                            <img src={post.userImage} alt="Profilbild" style={{ width: 80, height: 80, borderRadius: '50%', cursor: 'pointer' , marginTop: '2%'}} onClick={() => navigate(`/user/${post.userId}`)} />
                        ) : (
                            <AccountCircleIcon sx={{ width: 80, height: 80 }} />
                        )}
                    </Grid>
                    <Grid item xs={11}>
                        <Typography variant="h4" style={{ cursor: 'pointer' }} onClick={() => navigate(`/user/${post.userId}`)}>
                            {post.username}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {isEditing ? (
                            <TextField
                                id="edit-post-text"
                                label="Neuer Post Text"
                                variant="outlined"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                multiline
                                fullWidth
                                sx={{ mb: 2 }}
                                InputProps={{
                                    style: { color: 'white', borderColor: 'white', fontSize: '1.8em' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'white' }
                                }}
                            />
                        ) : (
                            <Typography variant="body1" style={{ fontSize: '1.8em' }}>
                                {post.text}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={post.image} alt="" style={{
                                width: 'auto',
                                maxWidth: '100%',
                                maxHeight: '40vh',
                                marginBottom: '1rem',
                                marginTop: '1rem'
                            }} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <IconButton onClick={handleLikeButtonClick}>
                            {isLiked ? (
                                <FavoriteIcon sx={{ color: 'red' }} />
                            ) : (
                                <FavoriteBorderIcon />
                            )}
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">{post.createdAt}</Typography>
                    </Grid>
                </Grid>
                {post.isOwnPost && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditButtonClick}
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#1976d2',
                            color: 'white',
                            width: '25%',
                            '&:hover': {
                                backgroundColor: '#135ba1',
                            },
                        }}
                    >
                        {isEditing ? <SaveIcon /> : <EditIcon />}
                    </Button>
                )}
            </Container>
            <BackButton />

            <Footer />
        </>
    );
};

export default PostDetailPage;
