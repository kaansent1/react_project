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
    setClient: (client: {
        image: string | undefined;
        isFollowing: boolean;
        followersCount: number;
        userId: number;
        followingCount: number;
        email: string;
        username: string
    }) => void;
    children?: Element[];
}>({
    client: initialClientState,
    setClient: (newClient) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.client = newClient
    },
});

const useClient = () => useContext(ClientContext);

export {useClient};
