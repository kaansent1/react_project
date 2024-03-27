import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import AddPostPage from "./pages/AddPostPage.tsx"
import PostDetailPage from "./pages/PostDetailPage.tsx"
import React from "react";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/new" element={<AddPostPage/>}/>
                <Route path="/details/post/:postId" element={<PostDetailPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
