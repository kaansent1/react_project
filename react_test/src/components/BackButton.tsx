import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <Button
            color="primary"
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{
                position: 'fixed',
                width: 'auto',
                maxWidth: '15vw',
                margin: '10px',
                bottom: '50px',
                right: '2px',
                transform: 'translateX(-50%)',
                zIndex: 99,
                fontSize: '15px',
            }}
        >
            Zurück
        </Button>
    );
};

export default BackButton;
