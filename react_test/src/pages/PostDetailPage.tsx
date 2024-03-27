import React from 'react';
import Header from './HeaderPage';
import {useNavigate, useParams} from 'react-router-dom';
import { usePosts } from '../hooks/posts';
import { Container, Grid, Typography, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../api/db'; // Import database module

function PostDetailPage() {
    const { postId } = useParams();
    const [posts, fetchPosts] = usePosts();
    const navigate = useNavigate()

    const postIdNumber = parseInt(postId);
    const post = posts.find((p) => p.id === postIdNumber);

    const handleDeletePost = (postId) => {
        db.posts.delete(postId).then(() => {
            fetchPosts();
            navigate("/home")
        }).catch(error => {
            console.error('Fehler beim Löschen des Posts:', error);
        });
    };

    return (
        <div>
            <Header />
            <Container sx={{ width: 600, padding: 2 }}>
                {post ? (
                    <Container
                        sx={{
                            padding: 2,
                            marginBottom: 2,
                            backgroundColor: '#3a5169',
                            color: 'white',
                            borderRadius: 4,
                            cursor: 'pointer'
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="left" gutterBottom>
                                    {post.text}
                                </Typography>
                                {post.image !== '' && (
                                    <img src={post.image} style={{ maxWidth: '100%', marginTop: '10px' }} alt="" />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <IconButton onClick={() => handleDeletePost(post.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Container>
                ) : (
                    <Typography variant="body1" align="center" sx={{ fontSize: 20, marginTop: 4 }}>
                        Post nicht gefunden
                    </Typography>
                )}
            </Container>
        </div>
    );
}

export default PostDetailPage;
