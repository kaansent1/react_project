import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import AddPostPage from './pages/AddPostPage.tsx';
import OwnDetailPage from './pages/OwnDetailPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import {ClientContext} from './context/ClientContext.tsx';
import {User} from './api/user.ts';
import PostDetailPage from './pages/PostDetailPage.tsx';
import UserDetailPage from './pages/UserDetailPage.tsx';
import CreditsPage from './pages/CreditsPage.tsx';
import FollowersPage from './pages/FollowersPage.tsx';
import MessengerPage from './pages/MessengerPage.tsx';

const App: React.FC = () => {
    const [client, setClient] = useState<User>({
        username: '',
        email: '',
        image: '',
        userId: 0,
        followersCount: 0,
        followingCount: 0,
        isFollowing: false
    });

    return (
        <ClientContext.Provider value={{client, setClient}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/new" element={<AddPostPage/>}/>
                    <Route path="/account" element={<OwnDetailPage/>}/>
                    <Route path="/detail/:postId" element={<PostDetailPage/>}/>
                    <Route path="/user/:userId" element={<UserDetailPage/>}/>
                    <Route path="/credits" element={<CreditsPage/>}/>
                    <Route path="/followers" element={<FollowersPage/>}/>
                    <Route path="/messenger" element={<MessengerPage/>}/>
                </Routes>
            </BrowserRouter>
        </ClientContext.Provider>
    );
};

export default App;
