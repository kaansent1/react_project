import { useState, useEffect, useRef } from 'react'; // Import useRef hook
import axios from 'axios';
import { useClient } from "../context/ClientContext.tsx";
import { Message } from "../api/message.ts";
import { User } from "../api/user.ts";
import Header from "./HeaderPage.tsx";
import Footer from "../components/Footer.tsx";
import '../styles/MessengerPageStyle.css';

function MessengersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const { client } = useClient();
    const messageListRef = useRef<HTMLDivElement>(null); // Create a ref for the message list container

    const fetchNewMessages = async () => {
        if (!selectedUser) return;

        try {
            const response = await axios.get(`http://192.168.1.125:8080/messages/get?loggedUserId=${client.userId}&recipientId=${selectedUser.userId}`);
            const newMessages = response.data;
            setMessages(newMessages);
        } catch (error) {
            console.error('Error fetching new messages:', error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(fetchNewMessages, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [selectedUser]);

    useEffect(() => {
        axios.get('http://192.168.1.125:8080/profile/all')
            .then(response => setUsers(response.data.users))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the message list when messages change
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        fetchNewMessages();
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
            const sentMessage = response.data;

            setMessages([...messages, sentMessage]);
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
                            <li key={user.userId} onClick={() => handleUserSelect(user)}>{user.username}</li>
                        ))}
                    </ul>
                </div>
                {selectedUser && (
                    <div className="chat-container">
                        <h2>Chat mit {selectedUser.username}</h2>
                        <div className="messages-list" ref={messageListRef}>
                            {messages.map(message => (
                                <div key={message.messageId}
                                     className={`message ${message.senderId === client.userId ? 'sent' : 'received'}`}>
            <span
                className={`message-background ${message.senderId === client.userId ? 'sent' : 'received'}`}>
                <p>{message.content}</p>
            </span>
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
                            />
                            <button onClick={handleMessageSend}>Senden</button>
                        </div>
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
}

export default MessengersPage;
