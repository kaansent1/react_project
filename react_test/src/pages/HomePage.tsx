import UserFeed from '../components/UserFeed';
import Header from './HeaderPage.tsx';
import { usePosts } from '../hooks/posts.ts';
import Footer from '../components/Footer.tsx'
function Home() {
    const [posts] = usePosts();

    return (
        <div className="container">
            <Header />
            <div className="body">

                <h2>UserFeed</h2>
                <UserFeed posts={posts} />
            </div>
            <Footer />
        </div>
    );
}

export default Home;
