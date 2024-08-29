import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://127.0.0.1:8000/";

function Register() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',  // Adjust name to match Django's expected field
        password2: ''   // Additional field for password confirmation
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        if (userData.password !== userData.password2) {
            setError('Passwords do not match');
            return;
        }
    
        try {
            const response = await axios.post(BASE_URL + 'register/', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Registration successful:', response.data);
            navigate('/login');  // Redirect to login after registration
        } catch (err) {
            console.error('Registration error:', err.response ? err.response.data : err);
            if (err.response && err.response.data) {
                // Handling non_field_errors specifically
                if (err.response.data.non_field_errors) {
                    setError(err.response.data.non_field_errors.join(" "));
                } else {
                    // Handling field specific errors if there are any
                    const errors = Object.keys(err.response.data).map(field => {
                        return `${err.response.data[field].join(" ")}`;
                    });
                    setError(errors.join(" "));  // Concatenate all errors into a single string
                }
            } else {
                setError("Something went wrong. Please try again.");
            }
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
                    value={userData.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password1">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password2">Confirm Password:</label>
                <input
                    type="password"
                    id="password2"
                    name="password2"
                    value={userData.password2}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Register</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default Register;
