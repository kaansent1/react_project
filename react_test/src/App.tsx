import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import AddPostPage from "./pages/AddPostPage.tsx"
import React from "react";

const App: React.FC = () => {
    return (
        <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/new" element={<AddPostPage/>}/>
                </Routes>
        </BrowserRouter>
    );
};

export default App;
