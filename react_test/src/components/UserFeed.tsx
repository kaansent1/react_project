import { Container, Grid, Typography, TextField, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import {useState} from "react";

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

    const [search, setSearch] = useState("")

    let displayedPosts = posts

    if(search !== "") {
        displayedPosts = posts.filter((p) => {
           return p.text.includes(search)
        })
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
                    )
                }}
                sx={{ marginBottom: 2 }}
            />
            {reversedPosts.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ fontSize: 20, marginTop: 4 }}>
                    Keine Posts vorhanden
                </Typography>
            ) : (
                reversedPosts.map(post => (
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
                            cursor: 'pointer'
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="body1" align="left">
                                    {post.text}
                                </Typography>
                                {post.image !== '' && (
                                    <img src={post.image} style={{ maxWidth: '100%', marginTop: '10px' }} alt=""/>
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
