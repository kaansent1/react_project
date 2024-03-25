import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import React from "react";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/" element={<LoginPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
