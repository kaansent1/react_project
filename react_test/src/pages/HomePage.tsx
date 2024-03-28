import UserFeed from '../components/UserFeed';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Header from './HeaderPage.tsx';
import { usePosts } from '../hooks/posts.ts';

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
                        width: '15vw',
                        maxWidth: '20vw',
                        margin: '10px',
                        bottom: '2%',
                        left: '10%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999
                    }}
                >
                    Post hinzufügen
                </Button>
                <h2>UserFeed</h2>
                <UserFeed posts={posts} />
            </div>
        </div>
    );
}

export default Home;
