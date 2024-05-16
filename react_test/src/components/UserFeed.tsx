import React, {useState, useEffect} from 'react';
import {
    Container,
    Grid,
    InputAdornment,
    TextField,
    Typography,
    useMediaQuery,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio
} from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {Post} from '../api/post';
import {useClient} from "../context/ClientContext.tsx";
import {User} from "../api/user.ts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function UserFeed() {
    const navigate = useNavigate();
    const {client} = useClient();
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('posts');
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const isSmallScreen = useMediaQuery('(max-width:950px)');

    useEffect(() => {
        const fetchData = async () => {
            const postsResponse = await axios.get(`http://192.168.1.125:8080/posts/feed?userId=${client.userId}`);
            setPosts(postsResponse.data.posts);

            const usersResponse = await axios.get(`http://192.168.1.125:8080/profile/all`);
            setUsers(usersResponse.data.users);
        };

        fetchData();
    }, [client.userId]);

    useEffect(() => {
        if (client.userId == 0) {
            navigate("/")
        }
    }, [client.userId, navigate]);

    useEffect(() => {
        if (search === '') {
            setFilteredPosts(posts);
            setFilteredUsers([]);
        } else {
            if (searchType === 'posts') {
                const filteredPosts = posts.filter(post => post.text.toLowerCase().includes(search.toLowerCase()));
                setFilteredPosts(filteredPosts);
                setFilteredUsers([]);
            } else {
                const filteredUsers = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()));
                setFilteredUsers(filteredUsers);
                setFilteredPosts([]);
            }
        }
    }, [search, searchType, posts, users]);

    const handlePostClick = (postId: number) => {
        navigate(`/detail/${postId}`);
    };

    const handleLikeClick = async (postId: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const userId = client.userId;
        const isLiked = filteredPosts.find(post => post.postId === postId)?.isLiked;

        let response;

        if (isLiked) {
            response = await axios.delete('http://192.168.1.125:8080/post/likes/remove', {data: {userId, postId}});
        } else {
            response = await axios.post('http://192.168.1.125:8080/post/likes/add', {userId, postId});
        }

        if (response.data.success) {
            const updatedPosts = filteredPosts.map(post => {
                if (post.postId === postId) {
                    return {
                        ...post,
                        isLiked: !isLiked,
                        likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
                    };
                }
                return post;
            });

            setFilteredPosts(updatedPosts);
        } else {
            console.error(response.data.message);
        }
    };

    return (
        <div>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="searchType" name="searchType" value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}>
                    <FormControlLabel value="posts" control={<Radio/>} label="Posts"/>
                    <FormControlLabel value="users" control={<Radio/>} label="Benutzer"/>
                </RadioGroup>
            </FormControl>

            <TextField
                type="text"
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Suche nach ${searchType === 'posts' ? 'Posts' : 'Benutzern'}...`}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>
                    ),
                }}
                sx={{marginBottom: 2}}
            />

            {filteredPosts.length === 0 && filteredUsers.length === 0 ? (
                <Typography variant="h6" sx={{marginBottom: 2, marginTop: 3}}>
                    Keine Suchergebnisse
                </Typography>
            ) : (
                <>
                    {filteredPosts.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{marginBottom: 2}}>
                                Posts
                            </Typography>
                            {filteredPosts.map((post) => (
                                <Container
                                    key={post.postId}
                                    sx={{
                                        width: 800,
                                        backgroundColor: '#3a5169',
                                        color: 'white',
                                        marginBottom: 4,
                                        borderRadius: '4px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        padding: 3,
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.01)',
                                            cursor: 'pointer',
                                        },
                                    }}
                                    onClick={() => handlePostClick(post.postId)}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="h5" align="left" sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                marginBottom: 1
                                            }}>
                                                {post.userImage ? (
                                                    <img src={post.userImage} alt="Profile" style={{
                                                        marginRight: '1rem',
                                                        width: '4rem',
                                                        height: '4rem',
                                                        borderRadius: '50%'
                                                    }}/>
                                                ) : (
                                                    <AccountCircleIcon sx={{
                                                        marginRight: '1rem',
                                                        fontSize: '3.5rem',
                                                        width: '5rem',
                                                        height: '5rem'
                                                    }}/>
                                                )}
                                                {post.username}
                                            </Typography>
                                            <Typography variant="body1" align="left"
                                                        sx={{color: 'white', marginBottom: 1, marginLeft: 1}}>
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
                                                    <img src={post.image} alt=""
                                                         style={{
                                                             maxWidth: '90%',
                                                             maxHeight: '50vh',
                                                             marginBottom: '1rem'
                                                         }}/>
                                                </div>
                                            )}
                                            <div style={{display: "flex"}}>
                                                <Button
                                                    onClick={(e) => handleLikeClick(post.postId, e)}
                                                    startIcon={post.isLiked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                                                    sx={{color: post.isLiked ? 'red' : 'white'}}
                                                >
                                                    {post.likesCount}
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Container>
                            ))}
                        </>
                    )}

                    {filteredUsers.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{marginBottom: 2}}>
                                Benutzer
                            </Typography>
                            {filteredUsers.map((user) => (
                                <Container
                                    key={user.userId}
                                    sx={{
                                        width: 800,
                                        backgroundColor: '#3a5169',
                                        color: 'white',
                                        marginBottom: 4,
                                        borderRadius: '4px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        padding: 3,
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.01)',
                                            cursor: 'pointer',
                                        },
                                    }}
                                    onClick={() => navigate(`/user/${user.userId}`)}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="h5" align="left" sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                marginBottom: 1
                                            }}>
                                                {user.image ? (
                                                    <img src={user.image} alt="Profile" style={{
                                                        marginRight: '1rem',
                                                        width: '5rem',
                                                        height: '5rem',
                                                        borderRadius: '50%'
                                                    }}/>
                                                ) : (
                                                    <AccountCircleIcon sx={{
                                                        marginRight: '1rem',
                                                        fontSize: '3.5rem',
                                                        width: '5rem',
                                                        height: '5rem',
                                                    }}/>
                                                )}
                                                {user.username}
                                            </Typography>
                                            <Typography variant="body1" align="left"
                                                        sx={{color: 'white', marginBottom: 1, marginLeft: 1}}>
                                                {user.email}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Container>
                            ))}
                        </>
                    )}
                </>
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
