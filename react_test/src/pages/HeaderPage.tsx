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
                <Link to="/">
                    <HomeIcon sx={{ fontSize: 40, color: 'white', mt: '0.4em'}} />
                </Link>

            </div>
        </header>
    );
}

export default Header;
