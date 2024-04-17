import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from "./pages/HomePage.tsx";
import AddPostPage from "./pages/AddPostPage.tsx"
import React, {useState} from "react";
import UserDetailPage from "./pages/UserDetailPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import {ClientContext} from "./context/ClientContext.tsx";
import {User} from "./api/user.ts";
import PostDetailPage from "./pages/PostDetailPage.tsx";
/*
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {queryClient} from "./api/client.ts";
*/
const App: React.FC = () => {
    const [client, setClient] = useState<User>({
        username: "",
        email: "",
        image: "",
        userId: 0
    })
    return (
        //<QueryClientProvider client={queryClient}>
        <ClientContext.Provider value={{client, setClient}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/new" element={<AddPostPage/>}/>
                    <Route path="/account" element={<UserDetailPage/>}/>
                    <Route path="/detail/:postId" element={<PostDetailPage/>}/>
                </Routes>
            </BrowserRouter>
        </ClientContext.Provider>
           // <ReactQueryDevtools initialIsOpen={false} />
       // </QueryClientProvider>
    );
};

export default App;
