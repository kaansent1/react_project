import React, { useState } from "react";
import LoginPage, { LoginFormData } from "../pages/LoginPage.tsx";
import AuthContext from "./AuthContext.tsx";

interface AuthOverlayProps {
    children?: React.ReactElement
}

const AuthOverlay = ({ children }: AuthOverlayProps) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")

    async function onSubmit(data: LoginFormData) {
        try {
            const response = await fetch("http://localhost:8080/login/authenticate", {
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
                setAuthenticated(true);
                setUsername(data.username);
                setPassword(data.password)
            } else {
                console.error("Login failed.");
            }
        } catch (error) {
            console.error("An error occurred during login:", error);
        }
    }

    function logout() {
        setAuthenticated(false);
        setUsername("");
    }

    return (
        <>
            {!authenticated ? (
                <LoginPage onSubmit={onSubmit} />
            ) : (
                <AuthContext.Provider value={{ authenticated, username, password, logout }}>
                    {children}
                </AuthContext.Provider>
            )}
        </>
    );
};

export default AuthOverlay;
