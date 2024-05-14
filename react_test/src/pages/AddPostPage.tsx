import React, {useEffect} from "react";
import Header from "./HeaderPage.tsx";
import { Typography } from "@mui/material";
import PostForm from "../components/PostForm.tsx";
import Footer from "../components/Footer.tsx";
import {useClient} from "../context/ClientContext.tsx";
import {useNavigate} from "react-router-dom";

const AddPostPage: React.FC = () => {
    const { client } = useClient();
    const navigate = useNavigate()

    useEffect(() => {
        if(client.userId == 0){
            navigate("/")
        }
    }, [client.userId, navigate]);
    return (
        <div>
            <Header />
                <Typography variant="h4" align="center" sx={{ mb: 2 , mt: 4}}>
                    Neuen Post erstellen
                </Typography>
                <PostForm />
            <Footer />
        </div>
    );
};

export default AddPostPage;
