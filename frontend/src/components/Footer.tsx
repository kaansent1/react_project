import "../styles/FooterStyle.css";
import {Typography} from "@mui/material";
import {useClient} from "../context/ClientContext.tsx";


function Footer() {

    const {client} = useClient()

    return (
        <div className="footer">
            <Typography variant="h6" className="footer-typography">
                Willkommen, {client.username}!
            </Typography>
        </div>
    );
}

export default Footer;
