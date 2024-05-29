import {useState, useEffect} from "react";
import Header from "./HeaderPage.tsx";
import {Container, Typography, Button, TextField, Grid} from "@mui/material";
import Footer from "../components/Footer.tsx";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {useClient} from "../context/ClientContext.tsx";
import {Post} from "../api/post.ts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import BackButton from "../components/BackButton.tsx";
import Swal from "sweetalert2";
import {Comments} from "../api/comments.ts";
import {AddComment} from "@mui/icons-material";

const PostDetailPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comments[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [editingText, setEditingText] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const {postId} = useParams<{ postId?: string }>();
    const {client} = useClient();
    const navigate = useNavigate();

    useEffect(() => {
        if (client.userId === 0) {
            navigate("/");
        }
    }, [client.userId, navigate]);

    useEffect(() => {
        if (postId) {
            const postIdAsNumber = parseInt(postId, 10);
            const currentUserId = client.userId;

            const fetchPost = async () => {
                try {
                    const response = await axios.get(`http://192.168.1.125:8080/post/${postIdAsNumber}?currentUserId=${currentUserId}`);
                    setPost(response.data.post);
                    setEditingText(response.data.post.text);
                } catch (error) {
                    console.error('Fehler beim Abrufen des Posts:', error);
                }
            };

            const fetchComments = async () => {
                try {
                    const response = await axios.get(`http://192.168.1.125:8080/post/comments/${postIdAsNumber}`);
                    setComments(response.data.comments);
                } catch (error) {
                    console.error('Fehler beim Abrufen der Kommentare:', error);
                }
            };

            fetchPost();
            fetchComments();
        }
    }, [client.userId, postId]);

    const handleEditButtonClick = async () => {
        if (post) {
            if (isEditing) {
                const newData = {text: editingText, userId: client.userId, username: client.username};
                try {
                    await axios.put(`http://192.168.1.125:8080/post/${post.postId}/edit`, newData);
                    console.log("Post erfolgreich bearbeitet!");
                    setIsEditing(false);
                    const updatedPostResponse = await axios.get(`http://192.168.1.125:8080/post/${post.postId}?currentUserId=${client.userId}`);
                    setPost(updatedPostResponse.data.post);
                } catch (error) {
                    console.error('Fehler beim Bearbeiten des Posts:', error);
                }
            } else {
                setIsEditing(true);
            }
        }
    };

    const handleDeleteButtonClick = async () => {
        const confirmation = await Swal.fire({
            title: 'Möchtest du diesen Post wirklich löschen?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Löschen',
            confirmButtonColor: '#2c3e50',
            cancelButtonText: 'Abbrechen'
        });
        if (confirmation.isConfirmed && post) {
            try {
                await axios.delete(`http://192.168.1.125:8080/post/${post.postId}`);
                navigate("/home");
            } catch (error) {
                console.error('Fehler beim Löschen des Posts:', error);
            }
        }
    };

    const handleLikeClick = async (postId: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const userId = client.userId;
        const isLiked = post?.isLiked;

        let response;

        if (isLiked) {
            response = await axios.delete('http://192.168.1.125:8080/post/likes/remove', {data: {userId, postId}});
        } else {
            response = await axios.post('http://192.168.1.125:8080/post/likes/add', {userId, postId});
        }

        if (response.data.success && post) {
            setPost({
                ...post,
                isLiked: !isLiked,
                likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
            });
        } else {
            console.error(response.data.message);
        }
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (newComment.trim() === "") return;

        const commentData = {
            content: newComment,
            postId: post?.postId,
            userId: client.userId,
        };

        try {
            const response = await axios.post('http://192.168.1.125:8080/post/comments/create', commentData);
            setComments([response.data.comment, ...comments]);
            setNewComment("");
            if (post) {
                setPost({
                    ...post,
                    commentsCount: post.commentsCount + 1
                });
            }

        } catch (error) {
            console.error('Fehler beim Hinzufügen des Kommentars:', error);
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
            <Container
                sx={{
                    width: 800,
                    backgroundColor: '#3a5169',
                    color: 'white',
                    mt: 2,
                    borderRadius: '4px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    padding: 3,
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 200px)",
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} container alignItems="center">
                        <Grid item>
                            {post.userImage ? (
                                <img src={post.userImage} alt="Profilbild"
                                     style={{width: '4rem', height: '4rem', borderRadius: '50%', cursor: 'pointer'}}
                                     onClick={() => navigate(`/user/${post.userId}`)}/>
                            ) : (
                                <AccountCircleIcon sx={{width: 60, height: 60}}/>
                            )}
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h6" style={{cursor: 'pointer', marginLeft: '1rem', fontWeight: 'bold'}}
                                        onClick={() => navigate(`/user/${post.userId}`)}>
                                {post.username}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
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
                                    style: {color: 'white', borderColor: 'white', fontSize: '1.2em'}
                                }}
                                InputLabelProps={{
                                    style: {color: 'white'}
                                }}
                            />
                        ) : (
                            <Typography variant="body1" style={{fontSize: '1.2em'}}>
                                {post.text}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <img src={post.image} alt="" style={{
                                width: 'auto',
                                maxWidth: '100%',
                                maxHeight: '40vh',
                                marginBottom: '1rem',
                                marginTop: '1rem'
                            }}/>
                        </div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Button
                            onClick={(e) => handleLikeClick(post.postId, e)}
                            startIcon={post.isLiked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                            sx={{color: post.isLiked ? 'red' : 'white'}}
                        >
                            {post.likesCount}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">{post.createdAt}</Typography>
                    </Grid>
                </Grid>
                {post.isOwnPost && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditButtonClick}
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#1976d2',
                            color: 'white',
                            width: '20%',
                            marginRight: '10px',
                            '&:hover': {
                                backgroundColor: '#135ba1',
                            },
                        }}
                        startIcon={isEditing ? <SaveIcon/> : <EditIcon/>}
                    >
                        {isEditing ? 'Speichern' : ' Bearbeiten'}
                    </Button>
                )}
                {post.isOwnPost && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteButtonClick}
                        startIcon={<DeleteIcon/>}
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#f44336',
                            color: 'white',
                            width: '20%',
                            '&:hover': {
                                backgroundColor: '#d32f2f',
                            },
                        }}
                    >
                        Löschen
                    </Button>
                )}
                <Typography variant="h6">Kommentare</Typography>
                <form onSubmit={handleCommentSubmit}>
                    <TextField
                        id="new-comment"
                        label="Neuer Kommentar"
                        variant="outlined"
                        value={newComment}
                        onChange={handleCommentChange}
                        multiline
                        fullWidth
                        sx={{mb: 2, mt: 2}}
                        InputProps={{
                            style: {color: 'white', borderColor: 'white', fontSize: '1.2em'}
                        }}
                        InputLabelProps={{
                            style: {color: 'white'}
                        }}
                    />
                    <Button variant="contained" type="submit" sx={{color: 'white', display: 'flex', width: 'auto'}}
                            startIcon={<AddComment/>}>
                        Post
                    </Button>
                </form>
                <Grid container spacing={2} sx={{mt: 2}}>
                    {comments.map((comment) => (
                        <Grid item xs={12} key={comment.commentId}>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                                {comment.image ? (
                                    <img src={comment.image} alt="Profilbild"
                                         style={{width: '3rem', height: '3rem', borderRadius: '50%'}}/>
                                ) : (
                                    <AccountCircleIcon sx={{width: '3rem', height: '3rem'}}/>
                                )}
                                <div style={{marginLeft: '1rem'}}>
                                    <Typography variant="subtitle2" style={{cursor: 'pointer'}}
                                                onClick={() => navigate(`/user/${comment.userId}`)}>
                                        {comment.username}
                                    </Typography>
                                    <Typography variant="body2">{comment.content}</Typography>
                                    <Typography variant="caption"
                                                style={{color: '#aaa'}}>{comment.createdAt}</Typography>
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <BackButton/>
            <Footer/>
        </>
    );
};

export default PostDetailPage;
