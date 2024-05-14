import "../styles/HomeStyle.css";
import {Link, useNavigate} from 'react-router-dom';
import DropdownMenu from '../components/DropDownMenu.tsx';
import HomeIcon from '@mui/icons-material/Home';
import {useEffect} from "react";
import {useClient} from "../context/ClientContext.tsx";

function Header() {
    const { client } = useClient();
    const navigate = useNavigate()

    useEffect(() => {
        if(client.userId == 0){
            navigate("/")
        }
    }, [client.userId, navigate]);

    return (
        <header className="header">
            <div className="left">
                <DropdownMenu/>
            </div>
            Social-React
            <div className="right">
                <Link to="/home">
                    <HomeIcon sx={{ fontSize: 40, color: 'white', mt: '0.4em'}} />
                </Link>
            </div>
        </header>
    );
}

export default Header;
