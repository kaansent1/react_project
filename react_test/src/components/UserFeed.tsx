import {Container, Grid, Typography, TextField, InputAdornment, useMediaQuery} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

interface Post {
    postId: string;
    text: string;
    image?: string;
}

interface UserFeedProps {
    posts: Post[];
}

function UserFeed({ posts }: UserFeedProps) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:950px)');

    let displayedPosts = posts;

    if (search !== '') {
        displayedPosts = posts.filter((p) => {
            return p.text.includes(search);
        });
    }

    const reversedPosts = [...displayedPosts].reverse();

    return (
        <div>
            <TextField
                type="text"
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suche..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ marginBottom: 2 }}
            />
            {reversedPosts.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ fontSize: 20, marginTop: 4 }}>
                    Keine Posts vorhanden
                </Typography>
            ) : (
                reversedPosts.map((post) => (
                    <Container
                        key={post.postId}
                        onClick={() => navigate(`/details/post/${post.postId}`)}
                        sx={{
                            width: 600,
                            padding: 2,
                            marginBottom: 2,
                            backgroundColor: '#3a5169',
                            color: 'white',
                            borderRadius: 4,
                            cursor: 'pointer',
                            '@media (max-width: 768px)': {
                                width: '80%',
                            },
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="body1" align="left">
                                    {post.text}
                                </Typography>
                                {post.image && <img src={post.image} style={{ maxWidth: '100%', marginTop: '10px' }} alt="" />}
                            </Grid>
                        </Grid>
                    </Container>
                ))
            )}
            <Button
                color="success"
                variant="contained"
                startIcon={isSmallScreen ? null : <AddIcon />}
                onClick={() => navigate('/new')}
                sx={{
                    position: 'fixed',
                    width: 'auto',
                    maxWidth: '15vw',
                    margin: '10px',
                    bottom: '50px',
                    right: '2px',
                    transform: 'translateX(-50%)',
                    zIndex: 99,
                    fontSize: '15px',
                }}
            >
                {isSmallScreen ? <AddIcon /> : 'Hinzufügen'}
            </Button>
        </div>
    );
}

export default UserFeed;