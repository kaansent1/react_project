import UserFeed from '../components/UserFeed';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Header from './HeaderPage.tsx';
import { usePosts } from '../hooks/posts.ts';
import Footer from '../components/Footer.tsx'
function Home() {
    const navigate = useNavigate();
    const [posts] = usePosts();

    return (
        <div className="container">
            <Header />
            <div className="body">
                <Button
                    color="success"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/new')}
                    sx={{
                        position: 'fixed',
                        width: 'auto',
                        maxWidth: '15vw',
                        margin: '10px',
                        bottom: '5%',
                        left: '10%',
                        transform: 'translateX(-50%)',
                        zIndex: 99,
                        fontSize: '15px',
                        '@media (max-width: 950px)': {
                            '& .MuiButton-startIcon': {
                                display: 'none'
                            }
                        }
                    }}
                >
                    Hinzufügen
                </Button>

                <h2>UserFeed</h2>
                <UserFeed posts={posts} />
            </div>
            <Footer />
        </div>
    );
}

export default Home;
