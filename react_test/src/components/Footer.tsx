import "../styles/FooterStyle.css";
import { Typography } from "@mui/material";
import { useAuth } from "./AuthContext.tsx";

function Footer() {
    const { username } = useAuth();

    return (
        <div className="footer">
            <Typography variant="h6" className="footer-typography">
                Hallo, {username}!
            </Typography>
        </div>
    );
}

export default Footer;
