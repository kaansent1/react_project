import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useClient } from "../context/ClientContext.tsx";
import { Message } from "../api/message.ts";
import Header from "./HeaderPage.tsx";
import defaultAvatar from "../assets/blank_profile_pic.png";
import '../styles/MessengerPageStyle.css';
import Button from "@mui/material/Button";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Swal from 'sweetalert2';
import { User } from "../api/user.ts";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from '@mui/material';


function MessengersPage() {
    const { client } = useClient();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const messageListRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        fetchUsers();
        fetchMessages();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://192.168.1.125:8080/profile/all');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchMessages = async () => {
        if (!selectedUser) return;

        try {
            const response = await axios.get(`http://192.168.1.125:8080/messages/get?loggedUserId=${client.userId}&recipientId=${selectedUser.userId}`);
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

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
    };

    const handleMessageSend = async () => {
        if (!selectedUser || !newMessage.trim()) return;

        const message = {
            senderId: client.userId,
            receiverId: selectedUser.userId,
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

    const handleInfoButtonClick = () => {
        Swal.fire({
            title: 'Information',
            text: 'Platzhalter.',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    };

    const handleProfileClick = () => {
        if (selectedUser) {
            navigate(`/user/${selectedUser.userId}`);
        }
    };

    return (
        <>
            <div>
                <Header/>

                <div className="messengers-container">
                    <div className="private-messenger">
                        <Button
                            variant="contained"
                            color="inherit"
                            sx={{
                                position: 'fixed',
                                width: 'auto',
                                maxWidth: '15vw',
                                margin: '8px',
                                right: '15px',
                                transform: 'translateX(-50%)',
                                zIndex: 99,
                                fontSize: '15px',
                            }}
                            onClick={handleInfoButtonClick}
                        >
                            <InfoOutlinedIcon/>
                        </Button>
                        <div className="users-list">
                            <h2><IconButton
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
                                Benutzerliste</h2>
                            <ul>
                                {users.map(user => (
                                    <li key={user.userId} onClick={() => handleUserSelect(user)}>
                                        <img src={user.image ? user.image : defaultAvatar} alt=""
                                             style={{width: "3rem", height: "3rem", borderRadius: '50%'}}/>
                                        <span>{user.username}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {selectedUser && (
                            <div className={`chat-container ${selectedUser}`}>
                                <div className="chat-title">
                                    <h2 style={{ display: 'flex', alignItems: 'center' }}>
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
                                        {selectedUser.username}
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
