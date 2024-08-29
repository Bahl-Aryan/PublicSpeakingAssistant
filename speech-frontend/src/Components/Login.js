import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://127.0.0.1:8000/";

function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Hook to access the navigation function

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await login(credentials.username, credentials.password);
            console.log('Login successful:', data);
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            console.log("navigating to dashboard...")
            navigate('/dashboard');  // Redirect to the dashboard
        } catch (err) {
            setError(err.message); // Update the UI to show error messages
        }
    };

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

async function login(username, password) {
    try {
        const response = await axios.post(BASE_URL + 'api/token/', {
            username,
            password
        });
        return response.data; // This will include the access and refresh tokens
    } catch (error) {
        throw new Error(error.response && error.response.data.detail ? error.response.data.detail : 'Login failed');
    }
}

export default Login;
