import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import "../styles/LoginStyle.css";

export interface LoginFormData {
    username: string;
    password: string;
    email: string;
    repeatPassword: string;
}

function LoginPage() {
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
        email: '',
        repeatPassword: '',
    });
    const [showRegister, setShowRegister] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();

        if (formData.password === '1') {
            navigate("/");
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
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
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="password"
                                name="repeatPassword"
                                placeholder="Repeat Password"
                                value={formData.repeatPassword}
                                onChange={handleInputChange}
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
}

export default LoginPage;
