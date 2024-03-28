import { useParams } from 'react-router-dom';
import { usePosts } from '../hooks/posts';
import { Container, Grid, Typography, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Post } from '../api/db';
import Header from "./HeaderPage.tsx";

function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [posts, , deletePost] = usePosts();
    const post = posts.find((p) => p.postId === id);


    const handleDeletePost = (postToDelete: Post) => {
        deletePost(postToDelete);
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
                                <IconButton onClick={() => handleDeletePost(post)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Container>
                ) : (
                    <Typography variant="body1" align="center" sx={{ fontSize: 20, marginTop: 4 }}>
                        Post not found
                    </Typography>
                )}
            </Container>
        </div>
    );
}

export default PostDetailPage;
