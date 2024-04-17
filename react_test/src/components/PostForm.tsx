import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { Box, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "../api/user.ts";
import axios from "axios";
import { useClient } from '../context/ClientContext';

interface PostFormData {
    postId: string;
    text: string;
    user: User;
    image?: string
}

const PostForm = () => {
    const { handleSubmit, register, reset } = useForm<PostFormData>();
    const navigate = useNavigate();
    const { client } = useClient();


    async function onSubmit(data: PostFormData) {
        const formData = new FormData();
        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }
        formData.append('post_data', JSON.stringify({ text: data.text, userId: client.userId, username: client.username}));

        const response = await axios.post('http://192.168.1.113:8080/post/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.data.success) {
            navigate("/home");
        } else {
            console.error('Ein Fehler ist aufgetreten: ', response.data.message);
        }

        reset();
    }
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "40vh" }}>
                <TextField
                    label="Was möchtest du sagen..."
                    {...register("text")}
                    multiline
                    rows={8}
                    variant="outlined"
                    sx={{ marginBottom: 2, height: "auto" }}
                />
                <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button color="success" startIcon={<AddIcon />} type="submit">
                        Hinzufügen
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default PostForm;
