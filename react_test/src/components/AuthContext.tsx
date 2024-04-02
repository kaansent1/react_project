import React from "react";

export interface AuthContext {
    authenticated: boolean
    username: string
}

const defaultState: AuthContext = {
    authenticated: false,
    username: ""
}

const AuthContext = React.createContext<AuthContext>(defaultState)

export default AuthContext