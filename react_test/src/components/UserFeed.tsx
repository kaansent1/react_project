import {useState, useEffect} from 'react';
import {Container, Grid, InputAdornment, TextField, Typography, useMediaQuery} from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {Post} from '../api/post';

function UserFeed() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const isSmallScreen = useMediaQuery('(max-width:950px)');

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axios.get('http://192.168.1.113:8080/posts/all');
            setPosts(response.data.posts);
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        if (search === '') {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post => post.text.toLowerCase().includes(search.toLowerCase()));
            setFilteredPosts(filtered);
        }
    }, [search, posts]);

    const handlePostClick = (postId: number) => {
        navigate(`/detail/${postId}`);
    };

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
                            <SearchIcon/>
                        </InputAdornment>
                    ),
                }}
                sx={{marginBottom: 2}}
            />
            {filteredPosts.length === 0 ? (
                <Typography variant="h6" sx={{marginBottom: 2, marginTop: 3}}>
                    Keine Posts gefunden
                </Typography>
            ) : (
                filteredPosts.map((post) => (
                    <Container
                        key={post.postId}
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
                        onClick={() => handlePostClick(post.postId)}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="left"
                                            sx={{color: 'white', fontWeight: 'bold', marginBottom: 1}}>
                                    {post.username}
                                </Typography>
                                <Typography variant="body1" align="left" sx={{color: 'white', marginBottom: 1}}>
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
                                        <img src={post.image} alt="" style={{maxWidth: '80%', maxHeight: '50vh', marginBottom: '1rem'}}/>
                                    </div>
                                )}
                            </Grid>
                        </Grid>
                    </Container>
                ))
            )}
            <Button
                color="success"
                variant="contained"
                startIcon={isSmallScreen ? null : <AddIcon/>}
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
                {isSmallScreen ? <AddIcon/> : 'Hinzufügen'}
            </Button>
        </div>
    );
}

export default UserFeed;
