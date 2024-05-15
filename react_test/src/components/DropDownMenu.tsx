import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "../styles/DropDownMenuStyle.css";
import {useClient} from "../context/ClientContext.tsx";

function DropdownMenu() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const {client} = useClient()

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const goToHome = () => {
        closeDropdown();
        navigate("/home");
    }
    const goToCredits = () => {
        closeDropdown();
        navigate("/credits");
    };


    const goToAccount = () => {
        closeDropdown();
        navigate(`/user/${client.userId}`);
    };


    const goToFollowers = () => {
        closeDropdown();
        navigate("/followers");
    };

    const goToMessenger = () => {
        closeDropdown()
        navigate("/messenger")
    }
    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const logout = () => {
        closeDropdown();
        navigate("/")
    }

    return (
        <div className="dropdown-container">
            <button onClick={toggleDropdown} className="dropdown-button">☰</button>
            {isDropdownOpen && (
                <div className="overlay">
                    <button onClick={goToHome} className="menu-item">Home</button>
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
