import React, {useState, useEffect} from "react";
import Header from "./HeaderPage.tsx";
import {Container, Typography, Button, TextField} from "@mui/material";
import Footer from "../components/Footer.tsx";
import {useParams} from "react-router-dom";
import axios from "axios";
import {useClient} from "../context/ClientContext.tsx";
import {Post} from "../api/post.ts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const PostDetailPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [editingText, setEditingText] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const {postId} = useParams<{ postId?: string }>();
    const { client } = useClient();

    useEffect(() => {
        if (postId) {
            const postIdAsNumber = parseInt(postId, 10);
            const currentUserId = client.userId;
            const fetchPost = async () => {
                try {
                    const response =
                        await axios.get(`http://192.168.1.113:8080/post/${postIdAsNumber}?currentUserId=${currentUserId}`);
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
                const newData =
                    {text: editingText, userId: client.userId, username: client.username};

                try {
                    await axios.put(`http://192.168.1.113:8080/post/${post.postId}/edit`, newData);
                    console.log("Post erfolgreich bearbeitet!");
                    setIsEditing(false);

                    const updatedPostResponse =
                        await axios.get(`http://192.168.1.113:8080/post/${post.postId}?currentUserId=${client.userId}`);
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
            await axios.delete('http://192.168.1.113:8080/post/likes/remove', { data: { userId, postId } });
        } else {
            await axios.post('http://192.168.1.113:8080/post/likes/add', { userId, postId });
        }
        setIsLiked(!isLiked);
    };

    if (!post) {
        return (
            <div>
                <Header/>
                <Typography variant="h4" align="center" sx={{mb: 2, mt: 4}}>
                    Laden...
                </Typography>
                <Footer/>
            </div>
        );
    }

    return (
        <>
            <Header/>
            <Container
                sx={{
                    width: '100%',
                    padding: 4,
                    marginTop: '5rem',
                    backgroundColor: '#3a5169',
                    color: 'white',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxHeight: '70vh',
                    textAlign: 'left',
                }}
            >
                <AccountCircleIcon sx={{width: 80, height: 80}}/>
                <Typography variant="h4" align="center" sx={{mb: 1, fontWeight: 'bold'}}>
                    {post.username}
                </Typography>
                {isEditing ? (
                    <TextField
                        id="edit-post-text"
                        label="Neuer Post Text"
                        variant="outlined"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        multiline
                        fullWidth
                        sx={{mb: 2}}
                        InputProps={{
                            style: {color: 'white', borderColor: 'white', fontSize: '1.4rem'}
                        }}
                        InputLabelProps={{
                            style: {color: 'white'}
                        }}
                    />
                ) : (
                    <Typography variant="h5">
                        {post.text}
                    </Typography>
                )}
                <img src={post.image} alt="" style={{
                    width: 'auto',
                    maxWidth: '30vw',
                    maxHeight: '40vh',
                    marginBottom: '1rem',
                    marginTop: '1rem'
                }}/>
                <Typography variant="body1" align="center">
                    {isLiked ? (
                        <FavoriteIcon onClick={handleLikeButtonClick} style={{ color: 'red' }} />
                    ) : (
                        <FavoriteBorderIcon onClick={handleLikeButtonClick} />
                    )}
                    {post.createdAt}
                </Typography>
                {post.isOwnPost && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditButtonClick}
                        sx={{
                            mt: 3,
                            backgroundColor: '#1976d2',
                            color: 'white',
                            width: '25%',
                            '&:hover': {
                                backgroundColor: '#135ba1',
                            },
                        }}
                    >
                        {isEditing ? "Speichern" : "Bearbeiten"}
                    </Button>
                )}
            </Container>


            <Footer/>
        </>
    );
};

export default PostDetailPage;
