import React from "react";
import Header from "./HeaderPage.tsx";
import { Typography } from "@mui/material";
import PostForm from "../components/PostForm.tsx";
import Footer from "../components/Footer.tsx";

const AddPostPage: React.FC = () => {
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
