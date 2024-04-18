import React, {useState} from 'react';
import Swal from 'sweetalert2';
import "../styles/LoginStyle.css";
import {useNavigate} from "react-router-dom";
import {useClient} from "../context/ClientContext.tsx";

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
    const navigate = useNavigate()

    const {setClient} = useClient();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch("http://192.168.1.113:8080/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            const userData = responseData.data;
            console.log(userData)
            setClient({
                userId: userData.userId,
                username: userData.username,
                image: userData.image,
                email: userData.email
            });
            navigate("/home");
        } else {
            showError('Login fehlgeschlagen');
        }
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        if (formData.password !== formData.repeatPassword) {
            showError('Die Passwörter stimmen nicht überein');
            return;
        }


        const response = await fetch("http://192.168.1.113:8080/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
                email: formData.email
            }),
        });

        if (response.ok) {
            showSuccess('Erfolgreich registriert');
        } else {
            showError('Registrierung fehlgeschlagen');
        }
    };

    const handleToggleRegister = () => {
        setShowRegister(!showRegister);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
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
            icon: 'info',
            showCloseButton: false,
            confirmButtonText: 'Schließen',
        }).then(result => {
            if (result.value) {
                setShowRegister(false);
            }
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
