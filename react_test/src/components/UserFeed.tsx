import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function UserFeed({ posts }) {
    const navigate = useNavigate();

    const reversedPosts = [...posts].reverse();
    return (
        <div>
            {reversedPosts.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ fontSize: 20, marginTop: 4 }}>
                    Keine Posts vorhanden
                </Typography>
            ) : (
                reversedPosts.map(post => (
                    <Container
                        key={post.id}
                        onClick={() => navigate(`/details/post/${post.id}`)}
                        sx={{
                            width: 600,
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
                                <Typography variant="body1" align="left">
                                    {post.text}
                                </Typography>
                                {post.image !== '' && (
                                    <img src={post.image} style={{ maxWidth: '100%', marginTop: '10px' }}  alt=""/>
                                )}
                            </Grid>
                        </Grid>
                    </Container>
                ))
            )}
        </div>
    );
}

export default UserFeed;
