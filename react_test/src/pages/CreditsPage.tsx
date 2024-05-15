import Header from "./HeaderPage.tsx";
import Footer from "../components/Footer.tsx";
import '../styles/CreditsPage.css';
import React, {useEffect} from "react";
import {useClient} from "../context/ClientContext.tsx";
import {useNavigate} from "react-router-dom";
import BackButton from "../components/BackButton.tsx";


const CreditsPage: React.FC = () => {
    const {client} = useClient();
    const navigate = useNavigate()

    useEffect(() => {
        if (client.userId == 0) {
            navigate("/")
        }
    }, [client.userId, navigate]);
    return (
        <div>
            <Header/>
            <div className="credits-container">
                <span className="contributors">Kaan Sentürk </span>
            </div>
            <BackButton/>
            <Footer/>
        </div>
    );
};

export default CreditsPage;
