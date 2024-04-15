import React, {useState, useEffect} from "react";
import Header from "./HeaderPage.tsx";
import {Container, Typography, Button} from "@mui/material";
import Footer from "../components/Footer.tsx";
import {useParams} from "react-router-dom";
import axios from "axios";
import {useClient} from "../context/ClientContext.tsx";
import {Post} from "../api/post.ts";

const PostDetailPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const {postId} = useParams<{ postId?: string }>();
    const client = useClient();

    useEffect(() => {
        if (postId) {
            const postIdAsNumber = parseInt(postId, 10);
            const currentUserId = client.client.userId;
            const fetchPost = async () => {
                try {
                    const response = await axios.get(`http://192.168.1.113:8080/post/${postIdAsNumber}?currentUserId=${currentUserId}`);
                    setPost(response.data.post);
                    console.log(response.data);
                } catch (error) {
                    console.error('Fehler beim Abrufen des Posts:', error);
                }
            };

            fetchPost();
        }
    }, [client.client.userId, postId]);

    const handleEditButtonClick = async () => {

        if (post) {
            //TODO
            const newData = {text: 'Neuer Text'}
            await axios.put(`http://192.168.1.113:8080/post/${post.postId}/edit`, newData);
            console.log("Post erfolgreich bearbeitet!");

        }
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
            <Container sx={{
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
                maxHeight: '80vh',
            }}>
                <Typography variant="h4" align="center" sx={{mb: 5}}>
                    {post.username}
                </Typography>
                <Typography variant="h5" align="center">
                    {post.text}
                </Typography>
                    <img src={post.image} alt="" style={{
                        width: 'auto',
                        maxHeight: '40vh',
                        marginBottom: '1rem',
                        marginTop: '1rem'
                    }}/>
                <Typography variant="body1" align="center">
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
                        Bearbeiten
                    </Button>
                )}
            </Container>
            <Footer/>
        </>
    );
};

export default PostDetailPage;
