import UserFeed from '../components/UserFeed';
import Header from './HeaderPage.tsx';
import Footer from '../components/Footer.tsx'
function Home() {

    return (
        <div className="container">
            <Header />
            <div className="body">

                <h2>UserFeed</h2>
                <UserFeed />
            </div>
            <Footer />
        </div>
    );
}

export default Home;
