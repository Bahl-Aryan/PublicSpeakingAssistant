import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Home.module.css'; // Import the styles

function Home() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to your Public Speaking Assistant!</h1>
            <button 
                className={styles.button}
                onClick={() => navigate('/login')}
            >
                Login
            </button>
            <button 
                className={styles.button}
                onClick={() => navigate('/register')}
            >
                Register
            </button>
        </div>
    );
}

export default Home;
