import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "../styles/DropDownMenuStyle.css";
import {useAuth} from "../context/AuthContext.tsx";

function DropdownMenu() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const {logout} = useAuth();


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const goToCredits = () => {
        closeDropdown();
        navigate("/credits");
    };


    const goToAccount = () => {
        closeDropdown();
        navigate("/account");
    };


    const goToFollowers = () => {
        closeDropdown();
        navigate("/follower");
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <div className="dropdown-container">
            <button onClick={toggleDropdown} className="dropdown-button">☰</button>
            {isDropdownOpen && (
                <div className="overlay">
                    <button onClick={goToAccount} className="menu-item">Account Info</button>
                    <button onClick={goToFollowers} className="menu-item">Your Followers</button>
                    <button onClick={goToCredits} className="menu-item">Credits</button>
                    <button type="submit" onClick={logout} className="menu-item">Logout</button>
                </div>
            )}
            {isDropdownOpen && <div className="background" onClick={closeDropdown}></div>}
        </div>
    );
}

export default DropdownMenu;
