import UserFeed from '../components/UserFeed';
import Header from './HeaderPage.tsx';
import Footer from '../components/Footer.tsx'
import {useEffect} from "react";
import {useClient} from "../context/ClientContext.tsx";
import {useNavigate} from "react-router-dom";

function Home() {
    const {client} = useClient();
    const navigate = useNavigate()

    useEffect(() => {
        if (client.userId == 0) {
            navigate("/")
        }
    }, [client.userId, navigate]);

    return (
        <div className="container">
            <Header/>
            <div className="body">

                <h2>UserFeed</h2>
                <UserFeed/>
            </div>
            <Footer/>
        </div>
    );
}

export default Home;
