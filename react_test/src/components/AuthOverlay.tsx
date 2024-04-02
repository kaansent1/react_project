import React, {useState} from "react";
import LoginPage, {LoginFormData} from "../pages/LoginPage.tsx";
import AuthContext from "./AuthContext.tsx";

interface AuthOverlayProps {
    children?: React.ReactElement
}

const AuthOverlay = ({children}: AuthOverlayProps) => {
    const [authenticated, setAuthenticated] = useState(false)
    const [username, setUsername] = useState("")

    function onSubmit(data: LoginFormData) {
        if(data.password === "1") {
            setAuthenticated(true)
            setUsername(data.username)
        }
    }


    if(!authenticated) {
        return <>
            <LoginPage onSubmit={onSubmit}/>
        </>
    }

    return (
        <AuthContext.Provider value={ {authenticated, username} }>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthOverlay
