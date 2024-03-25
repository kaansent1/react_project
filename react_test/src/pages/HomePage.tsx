import React from 'react';
import DropdownMenu from '../components/DropDownMenu.tsx';
import "../styles/HomeStyle.css";

const Home: React.FC = () => {
    return (
        <>
        <div>
            <header className="header">
                Social-React
                <DropdownMenu />
            </header>
            <p className="body">Welcome to the homepage!</p>
        </div>
        </>
    );
};

export default Home;
