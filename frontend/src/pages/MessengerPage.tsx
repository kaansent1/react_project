import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useClient} from "../context/ClientContext.tsx";
import {Message} from "../api/message.ts";
import Header from "./HeaderPage.tsx";
import defaultAvatar from "../assets/blank_profile_pic.png";
import '../styles/MessengerPageStyle.css';
import {useNavigate} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningIcon from '@mui/icons-material/Warning';
import {IconButton, TextField, InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {Follower} from "../api/follower.ts";

function MessengersPage() {
    const {client} = useClient();
    const [follows, setFollows] = useState<Follower[]>([]);
    const [selectedUser, setSelectedUser] = useState<Follower | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const messageListRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState<string>('');
    const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([]);
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (client.userId == 0) {
            navigate("/");
        }
    }, [client.userId, navigate]);

    useEffect(() => {
        if (search === '') {
            setFilteredFollowers(follows);
        } else {
            const filteredUser = follows.filter(follower => follower.name.toLowerCase().includes(search.toLowerCase()));
            setFilteredFollowers(filteredUser);
        }
    }, [search, follows]);

    useEffect(() => {
        fetchUsers();
        fetchMessages();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://192.168.1.125:8080/follows/following?userId=${client.userId}`);
            setFollows(response.data.follows);
            setFilteredFollowers(response.data.follows);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchMessages = async () => {
        if (!selectedUser) return;

        try {
            const response = await axios.get(`http://192.168.1.125:8080/messages/get?loggedUserId=${client.userId}&recipientId=${selectedUser.id}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(fetchMessages, 5000);
        return () => clearInterval(intervalId);
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messageListRef.current) {
            const {scrollHeight, clientHeight} = messageListRef.current;
            messageListRef.current.scrollTop = scrollHeight - clientHeight;
        }
    };

    const handleUserSelect = (follows: Follower) => {
        setSelectedUser(follows);
    };

    const handleMessageSend = async () => {
        if (!selectedUser || !newMessage.trim()) return;

        const message = {
            senderId: client.userId,
            receiverId: selectedUser.id,
            content: newMessage.trim()
        };

        try {
            const response = await axios.post('http://192.168.1.125:8080/messages/send', message);
            setMessages([...messages, response.data]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleProfileClick = () => {
        if (selectedUser) {
            navigate(`/user/${selectedUser.id}`);
        }
    };

    return (
        <>
            <div>
                <Header/>

                <div className="messengers-container">
                    <div className="private-messenger">
                        <div className="users-list">
                            <div className="header-search">
                                <h2>
                                    <IconButton
                                        color="primary"
                                        onClick={handleGoBack}
                                        sx={{
                                            width: 'auto',
                                            maxWidth: '15vw',
                                            transform: 'translateX(-50%)',
                                            zIndex: 99,
                                            fontSize: '15px',
                                        }}
                                    >
                                        <ArrowBackIcon/>
                                    </IconButton>
                                    Benutzerliste
                                </h2>
                                <TextField
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Suche nach Follower..."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{marginBottom: 2}}
                                />
                            </div>
                            <div className="follower-list">
                                <ul>
                                    {filteredFollowers.map(follows => (
                                        <li key={follows.id} onClick={() => handleUserSelect(follows)}>
                                            <img src={follows.image ? follows.image : defaultAvatar} alt=""
                                                 style={{width: "3rem", height: "3rem", borderRadius: '50%'}}/>
                                            <span>{follows.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {selectedUser && (
                            <div className={`chat-container ${selectedUser}`}>
                                <div className="chat-title">
                                    <h2 style={{display: 'flex', alignItems: 'center'}}>
                                        {selectedUser.image ? (
                                            <img src={selectedUser.image} alt="Profilbild" style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                                cursor: 'pointer'
                                            }} onClick={handleProfileClick}/>
                                        ) : (
                                            <img src={defaultAvatar} alt="Standardbild" style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                                cursor: 'pointer'
                                            }} onClick={handleProfileClick}/>
                                        )}
                                        {selectedUser.name}
                                        {!selectedUser.isFollowing && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginLeft: '10px',
                                                color: '#b88b00',
                                                fontSize: 'medium'
                                            }}>
                                                <WarningIcon sx={{marginRight: '5px'}}/>
                                                Dieser Benutzer folgt dir nicht
                                            </div>
                                        )}
                                    </h2>
                                </div>
                                <div className="messages-list" ref={messageListRef}>
                                    {messages.map(message => (
                                        <div key={message.messageId}
                                             className={`message ${message.senderId === client.userId ? 'sent' : 'received'}`}>
                                            <div className="message-content">
                                                {message.content}
                                            </div>
                                            <span className="timestamp">{message.createdAt}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="message-input">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyUp={(e) => {
                                            if (e.key === 'Enter') {
                                                handleMessageSend();
                                            }
                                        }}
                                        placeholder="Nachricht eingeben..."/>
                                    <button onClick={handleMessageSend}>Senden</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MessengersPage;
