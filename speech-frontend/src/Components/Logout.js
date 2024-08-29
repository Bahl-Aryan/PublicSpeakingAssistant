import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.post('http://127.0.0.1:8000/logout/', {}, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            // Clear any local state or context if needed
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <button style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'white',
            backgroundColor: 'red',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s, box-shadow 0.3s',
        }}
        onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;
