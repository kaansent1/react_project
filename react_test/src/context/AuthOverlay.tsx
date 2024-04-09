import React, { useState } from "react";
import LoginPage, { LoginFormData } from "../pages/LoginPage.tsx";
import AuthContext from "./AuthContext.tsx";

interface AuthOverlayProps {
    children?: React.ReactElement
}

export interface User {
    username: string;
    email: string;
}

const AuthOverlay = ({ children }: AuthOverlayProps) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const updateUser = ({ username, email }: { username: string; email: string }) => {
        setUsername(username);
        setEmail(email);
    };
    async function onSubmit(data: LoginFormData) {
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                }),
            });

            if (response.ok) {
                setAuthenticated(true)
                setUsername(data.username)
                setPassword(data.password)
                setEmail(data.email)
            } else {
                console.error("Login failed.", response)
            }
        } catch (error) {
            console.error("An error occurred during login:", error)
        }
    }


    function logout() {
        setAuthenticated(false);
        setUsername("");
        setPassword("");
        setEmail("");
    }


    return (
        <>
            {!authenticated ? (
                <LoginPage onSubmit={onSubmit} />
            ) : (
                <AuthContext.Provider value={{ authenticated, username, password, email, logout, updateUser }}>
                    {children}
                </AuthContext.Provider>
            )}
        </>
    );
};

export default AuthOverlay;
