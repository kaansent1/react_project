import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from "./pages/HomePage.tsx";
import AddPostPage from "./pages/AddPostPage.tsx"
import PostDetailPage from "./pages/PostDetailPage.tsx"
import React from "react";
import AuthOverlay from "./components/AuthOverlay.tsx";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthOverlay>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/new" element={<AddPostPage/>}/>
                    <Route path="/details/post/:postId" element={<PostDetailPage/>}/>
                </Routes>
            </AuthOverlay>
        </BrowserRouter>
    );
};

export default App;
