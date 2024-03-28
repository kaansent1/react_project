import AddIcon from "@mui/icons-material/Add";
import { User } from "../api/user.ts";
import Button from "@mui/material/Button";


export interface PostFormData {
    id: string;
    user: User;
    text: string;
    image?: string;
}

const PostForm = () => {

    return (
        <form
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "40vh",
            }}
        >
                    <Button color="success" startIcon={<AddIcon />} type="submit">
                        Hinzufügen
                    </Button>
        </form>
    );
};

export default PostForm;