import React, { useState } from 'react';
import Swal from 'sweetalert2';
import "../styles/LoginStyle.css"
import {useNavigate} from "react-router-dom";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const navigate = useNavigate()

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();


        if (username === '1' && password === '1') {
            navigate("/home");
        } else {
            showError('Falsche Anmeldeinformationen');
        }
    };

    const handleRegister = (event: React.FormEvent) => {
        event.preventDefault();

        showSuccess('Erfolgreich registriert');
    };

    const handleToggleRegister = () => {
        setShowRegister(!showRegister);
    };

    const showSuccess = (message: string) => {
        Swal.fire({
            title: 'Erfolg',
            text: message,
            icon: 'success',
            showCloseButton: false,
            confirmButtonText: 'Schließen',
        }).then(result => {
            if (result.value) {
                setShowRegister(false);
            }
        });
    };

    const showError = (message: string) => {
        Swal.fire({
            title: 'Fehler',
            text: message,
            icon: 'error',
            showCloseButton: false,
            confirmButtonText: 'Schließen',
        });
    };

    return (
        <div className="login-container">
            {/* Animated background and title container */}
            <div className="animated-background"></div>
            <div className="title-container">React-Social</div>

            {/* Form container */}
            <div className="form-container">
                <h1>{showRegister ? 'Registrieren' : 'Login'}</h1>
                <form onSubmit={showRegister ? handleRegister : handleLogin}>
                    {!showRegister ? (
                        <>
                            {/* Login form */}
                            <input
                                type="text"
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit">
                                Log in
                            </button>
                            <button type="button" onClick={handleToggleRegister}>
                                Register
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Register form */}
                            <input
                                type="text"
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                id="repeat_password"
                                placeholder="Repeat Password"
                                value={repeatPassword}
                                onChange={e => setRepeatPassword(e.target.value)}
                                required
                            />
                            <button type="submit">Register</button>
                            <button type="button" onClick={handleToggleRegister}>
                                Back to Login
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
