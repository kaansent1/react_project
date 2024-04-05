import React, {useContext} from "react";

export interface AuthContext {
    authenticated: boolean,
    username: string,
    password: string,
    logout: () => void
}

const defaultState: AuthContext = {
    authenticated: false,
    username: "",
    password: "",
    logout: () => {}
}

const AuthContext = React.createContext<AuthContext>(defaultState)

export function useAuth() {
    return useContext(AuthContext)
}
export default AuthContext