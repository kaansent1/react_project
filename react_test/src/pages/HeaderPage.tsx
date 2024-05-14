import "../styles/HomeStyle.css";
import "../styles/LogoStyle.css"
import { Link, useNavigate } from 'react-router-dom';
import DropdownMenu from '../components/DropDownMenu.tsx';
import HomeIcon from '@mui/icons-material/Home';
import { useEffect } from "react";
import { useClient } from "../context/ClientContext.tsx";
import logo from "../assets/logo.svg";

function Header() {
    const { client } = useClient();
    const navigate = useNavigate();

    useEffect(() => {
        if (client.userId === 0) {
            navigate("/");
        }
    }, [client.userId, navigate]);

    return (
        <header className="header">
            <div className="left">
                <DropdownMenu />
            </div>
            <Link to="/credits">
                <img src={logo} className="srlogo" alt="React logo" />
            </Link>
            <span>Social-React</span>
            <div className="right">
                <Link to="/home">
                    <HomeIcon sx={{ fontSize: 40, color: 'white', mt: '0.4em' }} />
                </Link>
            </div>
        </header>
    );
}

export default Header;
