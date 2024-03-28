import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/DropDownMenuStyle.css";

function DropdownMenu() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const goToCredits = () => {
        closeDropdown();
        navigate("/credits");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const goToAccount = () => {
        closeDropdown();
        navigate("/account");
    };

    const goToMessenger = () => {
        closeDropdown();
        navigate("/messenger");
    };

    const goToFollowers = () => {
        closeDropdown();
        navigate("/follower");
    };

    const logout = () => {
        localStorage.removeItem("logegd_user_id");
        localStorage.removeItem("logged_user");
        navigate("/");
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
                    <button onClick={goToMessenger} className="menu-item">Messenger</button>
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
