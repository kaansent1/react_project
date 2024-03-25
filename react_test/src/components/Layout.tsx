import {ReactNode} from "react";
import {Container} from "@mui/material";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {


    return (
        <>
            <header></header>
            <Container>{children}</Container>
            <footer></footer>
        </>
    )
}

export default Layout