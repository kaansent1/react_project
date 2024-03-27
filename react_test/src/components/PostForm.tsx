import React, {useState} from "react";
import {Box, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {User} from "../api/user.ts";
import {useForm} from "react-hook-form";
import Button from "@mui/material/Button";
import {db} from "../api/db.ts";
import {useNavigate} from "react-router-dom";

export interface PostFormData {
    id: string;
    user: User;
    text: string;
    image?: File;
    created_at: Date;
}

const PostForm = () => {
    const {handleSubmit, register, watch} = useForm<PostFormData>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const navigate = useNavigate();

    function onSubmit(data: PostFormData) {
        if (data.image && data.image[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const formData = {...data, image: reader.result as string};
                db.posts.add(formData).then(() => navigate("/home"));
            };
            reader.readAsDataURL(data.image[0]);
        } else {
            db.posts.add(data).then(() => navigate("/home"));
        }
    }

    const handleImageChange = () => {
        const file = watch("image");
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file[0]);
        } else {
            setImagePreview(null);
        }
    };
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "40vh",
            }}
        >
            <Box sx={{display: "flex", flexDirection: "column", gap: 1, width: "40vh"}}>
                <TextField label="Was möchtest du sagen..." {...register("text")} />
                <input type="file" onChange={handleImageChange} accept="image/*" {...register("image")} />
                {imagePreview &&
                    <img src={imagePreview} alt="Bildvorschau" style={{maxWidth: "100%", marginTop: "10px"}}/>}
                <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                    <Button color="success" startIcon={<AddIcon/>} type="submit">
                        Hinzufügen
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default PostForm;
