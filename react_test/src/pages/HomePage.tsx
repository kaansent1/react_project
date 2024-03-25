import React from 'react';
import DropdownMenu from '../components/DropDownMenu.tsx';
import {getUsers} from '../api';
import "../styles/HomeStyle.css";

function Home() {
    const users = getUsers();

    return (
        <div className="container">
            <header className="header">
                Social-React
                <DropdownMenu/>
            </header>
            <div className="body">
                <h2>Users:</h2>
                <ul>
                    {users.map(user => (
                        <div>
                            <p>First Name: {user.firstname}</p>
                            <p>Last Name: {user.lastname}</p>
                            <p>Username: {user.username}</p>
                            <p>Email: {user.email}</p>
                            <p>Birthdate: {user.birthdate.toLocaleDateString()}</p>
                            {user.avatarUrl && <img src={user.avatarUrl} alt="Avatar"/>}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;
