import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './Logout';

const BASE_URL = "http://127.0.0.1:8000/";

function Dashboard() {
    const [clips, setClips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [grading, setGrading] = useState({});
    const navigate = useNavigate();
    
    const delete_clip = (clip_id) =>{ const accessToken = localStorage.getItem('accessToken');
        axios({
            method: 'post',
            url: BASE_URL+"delete_clip/",
            headers: { Authorization: `Bearer ${accessToken}`}, 
            data: {
                id:clip_id
            }
        }); 
        refreshToken();
    };
    const grade_clip = (clip_id) => {
        setGrading(prev => ({...prev, [clip_id]: true}));
        const accessToken = localStorage.getItem('accessToken');
        axios({
            method: 'post',
            url: BASE_URL+"grade_clip/",
            headers: { Authorization: `Bearer ${accessToken}`}, 
            data: {
                id:clip_id
            }
        }).then(() => {
            refreshToken();
        }).finally(() => {
            setGrading(prev => ({...prev, [clip_id]: false}));
        })
    };

    const handleUploadRedirect = () => {
        navigate('/upload/');  // Redirects to the /upload/ path
    };

    const refreshToken = useCallback(() => {
        const refreshToken = localStorage.getItem('refreshToken');
        axios.post(`${BASE_URL}api/token/refresh/`, { refresh: refreshToken })
            .then(res => {
                localStorage.setItem('accessToken', res.data.access);
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                fetchClips(res.data.access);
            })
            .catch(error => {
                console.error('Error refreshing token:', error);
                setError('Session expired, please log in again');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken || isTokenExpired(accessToken)) {
            console.log("Token expired. Attempting to refresh...");
            refreshToken();
        } else {
            fetchClips(accessToken);
        }
    }, [refreshToken]);

    const isTokenExpired = token => {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // seconds
        return decoded.exp < currentTime;
    };

    const fetchClips = accessToken => {
        axios.get(`${BASE_URL}dashboard/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(response => {
            setClips(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching clips:', error);
            setError('Failed to fetch clips');
            setLoading(false);
        });
    };

    if (loading) return <p>Loading clips...</p>;
    if (error) return <p>Error loading clips: {error}</p>;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%', // Limit the width to keep the content readable
            margin: 'auto',
            padding: '20px',
            backgroundColor: '#f0f0f0', // Light background color
            borderRadius: '10px', // Rounded corners
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)' // Subtle shadow
        }}> <div style={{
                alignSelf: 'flex-end',
                width:'100%',
                marginBottom:'20px'
            }}>
                <LogoutButton />
            </div>
            <h1 style={{
                fontWeight: "bold",
                fontSize: '30px',
                textAlign: 'center',
                color: '#333',
                marginBottom: '20px' // Space below the header
            }}>Your Audio Clips</h1>
            {clips.length ? (
                <ul style={{
                    listStyleType: 'none',
                    padding: 0,
                    width: '100%', // Full width
                }}>
                    {clips.map(clip => (
                        <li key={clip.clip_id} style={{
                            backgroundColor: '#ffffff', // White background for each item
                            margin: '10px 0', // Margin between items
                            padding: '10px',
                            borderRadius: '5px', // Rounded corners for each item
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)' // Subtle shadow for each item
                        }}>
                            <strong>{clip.name}</strong> - {new Date(clip.date_added).toLocaleDateString()} 
                            <button style={{
                                padding: '5px 10px',
                                color: 'white',
                                backgroundColor: '#ff0011',
                                border: 'none',
                                borderRadius: '5px',
                                float: 'right',
                                cursor: 'pointer'}}onClick={()=>delete_clip(clip.clip_id)}>Delete Clip</button>
                        <p>{clip.audio}</p>

                        {clip.rated ? grading[clip.clip_id] ? <p>Scores loading...</p>
                        : <p> Enthusiasm: {clip.enthusiasm} <br></br> Assertiveness: {(clip.assertiveness)}<br></br>Clarity: {clip.clairity}<br></br>Engagement: {clip.engagement}</p>
                        : <p><button style={{
                                padding: '5px 10px',
                                color: 'white',
                                backgroundColor: '#007BFF',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'

                        }} onClick={() => grade_clip(clip.clip_id)}>Submit Clip for Grading</button></p>
                        }
                            <audio controls src={`${BASE_URL}${clip.audio}`} style={{
                                width: '100%', // Full width audio controls
                                marginTop: '10px' // Space above the controls
                            }}></audio>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No clips to display.</p>
            )}
            <div style={{
                marginTop: '20px', 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center'
            }}> 
                <button style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    color: 'white',
                    backgroundColor: '#007BFF',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }} onClick={handleUploadRedirect}>Record or Submit New Clip</button>
            </div>
        </div>
    );
    
}
    
export default Dashboard;

