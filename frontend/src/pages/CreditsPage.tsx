import {useEffect} from "react";
import {useClient} from "../context/ClientContext.tsx";
import {useNavigate} from "react-router-dom";
import Header from "./HeaderPage.tsx";
import Footer from "../components/Footer.tsx";
import BackButton from "../components/BackButton.tsx";

import srlogo from "../images/logo.svg";
import reactLogo from "../images/react.svg";
import sqlLogo from "../images/sqlLogo.png";
import axiosLogo from '../images/axiosLogo.png';
import muiLogo from "../images/muiLogo.png";
import kotlinLogo from "../images/kotlinLogo.png";
import '../styles/CreditsPage.css';

const CreditsPage: React.FC = () => {
    const {client} = useClient();
    const navigate = useNavigate();

    useEffect(() => {
        if (client.userId === 0) {
            navigate("/");
        }
    }, [client.userId, navigate]);

    return (
        <div>
            <Header/>
            <BackButton/>
            <div className="credits-container">
                <h1>Kaan Sentürk</h1>
                <div className="logo-container">
                    <a href="https://github.com/kaansenturk/react_project">
                        <img src={srlogo} alt="srLogo" className="emblem"/>
                    </a>
                    <a href="https://reactjs.org">
                        <img src={reactLogo} alt="React Logo" className="react-logo"/>
                    </a>
                    <a href="https://www.postgresql.org/">
                        <img src={sqlLogo} alt="SQL Logo" className="react-logo"/>
                    </a>
                    <a href="https://axios-http.com/">
                        <img src={axiosLogo} alt="Axios Logo" className="axios-logo"/>
                    </a>
                    <a href="https://mui.com/">
                        <img src={muiLogo} alt="MUI Logo" className="react-logo"/>
                    </a>
                    <a href="https://kotlinlang.org/">
                        <img src={kotlinLogo} alt="Kotlin Logo" className="react-logo"/>
                    </a>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default CreditsPage;
