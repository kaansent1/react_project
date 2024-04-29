import {createContext, useContext} from 'react';
import {User} from "../api/user.ts";


const initialClientState: User = {
    userId: 0,
    username: '',
    image: '',
    email: '',
    followingCount: 0,
    followersCount: 0,
    isFollowing: false
};

export const ClientContext = createContext<{
    client: User;
    setClient: (client: User) => void;
    children?: Element[];
}>({
    client: initialClientState,
    setClient: (newClient) => {
        // @ts-ignore
        this.client = newClient
    },
});

const useClient = () => useContext(ClientContext);

export {useClient};
