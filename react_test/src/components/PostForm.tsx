import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { Box, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { db } from "../api/db.ts";
import { User } from "../api/user.ts";

interface PostFormData {
    postId: string;
    text: string;
    user: User;
    image?: FileList
}

const PostForm = () => {
    const { handleSubmit, register } = useForm<PostFormData>();
    const navigate = useNavigate();

    function onSubmit(data: PostFormData) {
        const imageData = data.image?.[0];
        const postData = { ...data, image: imageData ? URL.createObjectURL(imageData) : undefined };
        db.posts.add(postData).then(() => navigate("/home"));
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
                <TextField label="Was möchtest du sagen..." {...register("text")} />
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
