import React from "react";
import Header from "./HeaderPage.tsx";
import {Paper} from "@mui/material";
import PostForm from "../components/PostForm.tsx";


const AddPostPage = () => {
    
    return (
        <div>
            <Header/>
            <Paper sx={{p: 1}}>
                <PostForm />
            </Paper>
        </div>
    )
}

export default AddPostPage;
