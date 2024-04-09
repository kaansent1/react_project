import React, {useContext} from "react";

export interface AuthContext {
    authenticated: boolean,
    username: string,
    password: string,
    email: string,
    logout: () => void,
    updateUser: (userData: { username: string; email: string }) => void;


}

const defaultState: AuthContext = {
    authenticated: false,
    username: "",
    password: "",
    email: "",
    logout: () => {},
    updateUser: () => {},


}

export function useAuth() {
    return useContext(AuthContext)
}

const AuthContext = React.createContext<AuthContext>(defaultState)

export default AuthContext
