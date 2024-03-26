import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UserFeed from '../components/UserFeed';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Header from './HeaderPage.tsx';
import { usePosts } from '../hooks/posts.ts';

function Home() {
    const navigate = useNavigate();
    const [posts, fetchPosts] = usePosts();

    return (
        <div className="container">
            <Header />
            <div className="body">
                <Box sx={{ display: 'flex', p: 1, justifyContent: 'flex-end' }}>
                    <TextField
                        type="text"
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
                <Button
                    color="success"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/new')}
                    sx={{
                        position: 'fixed',
                        width: '20vw',
                        margin: '10px',
                        bottom: '2%',
                        left: '10%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999
                    }}
                >
                    Post hinzufügen
                </Button>
                <h2>UserFeed</h2>
                <UserFeed posts={posts} fetchPosts={fetchPosts} />
            </div>
        </div>
    );
}

export default Home;
