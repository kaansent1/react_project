import Header from "./HeaderPage.tsx";
import Footer from "../components/Footer.tsx";
import '../styles/CreditsPage.css';
import React from "react";


const CreditsPage: React.FC = () => {
    return (
        <div>
            <Header />
            <div className="credits-container">
                <span className="contributors">Kaan Sentürk </span>
            </div>
            <Footer />
        </div>
    );
};

export default CreditsPage;
