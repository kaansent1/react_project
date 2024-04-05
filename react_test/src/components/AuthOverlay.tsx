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
    const [email, setEmail] = useState("")

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
                    email: data.email

                }),
            });

            if (response.ok) {
                setAuthenticated(true)
                setUsername(data.username)
                setPassword(data.password)
                setEmail(data.email)
            } else {
                console.error("Login failed.")
            }
        } catch (error) {
            console.error("An error occurred during login:", error)
        }
    }

    function logout() {
        setAuthenticated(false);
        setUsername("")
        setPassword("")
        setEmail("")
    }

    return (
        <>
            {!authenticated ? (
                <LoginPage onSubmit={onSubmit} />
            ) : (
                <AuthContext.Provider value={{ authenticated, username, password, email, logout }}>
                    {children}
                </AuthContext.Provider>
            )}
        </>
    );
};

export default AuthOverlay;
