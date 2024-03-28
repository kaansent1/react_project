import "../styles/HomeStyle.css";
import { Link } from 'react-router-dom';
import DropdownMenu from '../components/DropDownMenu.tsx';
import HomeIcon from '@mui/icons-material/Home';

function Header() {
    return (
        <header className="header">
            <div className="left">
                <DropdownMenu/>
            </div>
            Social-React
            <div className="right">
                <Link to="/home">
                    <HomeIcon sx={{ fontSize: 40, color: 'white' }} />
                </Link>
            </div>
        </header>
    );
}

export default Header;
