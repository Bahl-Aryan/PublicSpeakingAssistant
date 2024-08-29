import axios from "axios";
import {jwtDecode} from 'jwt-decode';

const BASE_URL = 'http://127.0.0.1:8000';

const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime;
};


const refreshAccessToken = async (refreshToken) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/api/token/refresh/`, { refresh: refreshToken });
        localStorage.setItem('accessToken', data.access);
        return data.access;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        throw new Error('Session expired, please login again.');
    }
};

export const submitRecording = async (recording_blob, recording_name) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // Check if the current access token is expired
    if (!accessToken || isTokenExpired(accessToken)) {
        console.log("Access token expired, attempting to refresh...");
        try {
            const newAccessToken = await refreshAccessToken(refreshToken);
            return await postRecording(recording_blob, recording_name, newAccessToken);
        } catch (error) {
            throw error; // Handle this error to show login or error message to the user
        }
    } else {
        return await postRecording(recording_blob, recording_name, accessToken);
    }
};

const postRecording = async (recording_blob, recording_name, accessToken) => {
    const formData = new FormData();
    formData.append('name', recording_name);
    formData.append('audio', recording_blob, `${recording_name}.wav`);

    try {
        const response = await axios.post(`${BASE_URL}/upload/`, formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        console.log("Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error submitting recording:", error.response || error);
        throw new Error('Error submitting recording.');
    }
};
