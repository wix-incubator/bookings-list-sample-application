import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.API_PATH,
    headers: {
        // 'Authorization': localStorage.getItem('token'),
        'Authorization': process.env.API_TOKEN
    }
});

export default axiosInstance;