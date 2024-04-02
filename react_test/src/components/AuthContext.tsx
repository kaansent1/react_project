import React, {useContext} from "react";

export interface AuthContext {
    authenticated: boolean,
    username: string,
    logout: () => void
}

const defaultState: AuthContext = {
    authenticated: false,
    username: "",
    logout: () => {}
}

const AuthContext = React.createContext<AuthContext>(defaultState)

export function useAuth() {
    return useContext(AuthContext)
}
export default AuthContext