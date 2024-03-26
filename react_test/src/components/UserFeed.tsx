import React from 'react';
import {Container, Grid, Typography, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {db} from '../api/db';

function UserFeed({posts, fetchPosts}) {
    const handleDeletePost = (postId) => {
        db.posts.delete(postId).then(() => {
            fetchPosts();
        }).catch(error => {
            console.error('Fehler beim Löschen des Posts:', error);
        });
    };

    return (
        <div>
            {posts.map(post => (
                <Container
                    key={post.id}
                    sx={{
                        width: 600,
                        padding: 2,
                        marginBottom: 2,
                        backgroundColor: '#3a5169',
                        color: 'white',
                        borderRadius: 4
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item>
                        </Grid>
                        <Grid item>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" align="left">
                                {post.text}
                            </Typography>
                            {post.image && (
                                <img src={post.image} alt="Post Image" style={{ maxWidth: '100%', marginTop: '10px' }} />
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <IconButton onClick={() => handleDeletePost(post.id)} color="error">
                                <DeleteIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Container>
            ))}
        </div>
    );
}

export default UserFeed;
