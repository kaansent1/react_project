import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useClient } from "../context/ClientContext.tsx";
import { Message } from "../api/message.ts";
import { User } from "../api/user.ts";
import Header from "./HeaderPage.tsx";
import defaultAvatar from "../assets/blank_profile_pic.png";
import '../styles/MessengerPageStyle.css';

function MessengersPage() {
    const { client } = useClient();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const messageListRef = useRef<HTMLDivElement>(null);

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
        const intervalId = setInterval(fetchMessages, 1000);
        return () => clearInterval(intervalId);
    }, [selectedUser]);

    useEffect(() => {
        if (messageListRef.current) {
            const { scrollHeight, clientHeight, scrollTop } = messageListRef.current;
            const isScrolledToBottom = scrollHeight - clientHeight <= scrollTop + 1;

            if (isScrolledToBottom) {
                messageListRef.current.scrollTop = scrollHeight;
            }
        }
    }, [messages]);

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
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="messengers-container">
            <Header />
            <div className="messengers-content">
                <div className="users-list">
                    <h2>Benutzerliste</h2>
                    <ul>
                        {users.map(user => (
                            <li key={user.userId} onClick={() => handleUserSelect(user)}>
                                <img src={user.image ? user.image : defaultAvatar} alt="Profilbild" style={{ width: "3rem", height: "3rem", borderRadius: '50%'}} />
                                <span>{user.username}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {selectedUser && (
                    <div className={`chat-container ${selectedUser ? 'show' : ''}`}>
                        <h2>Chat mit {selectedUser.username}</h2>
                        <div className="messages-list" ref={messageListRef}>
                            {messages.map(message => (
                                <div key={message.messageId} className={`message ${message.senderId === client.userId ? 'sent' : 'received'}`}>
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
                                placeholder="Nachricht eingeben..."
                            />
                            <button onClick={handleMessageSend}>Senden</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessengersPage;
