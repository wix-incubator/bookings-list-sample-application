import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.API_PATH,
    headers: {
        'instanceId': sessionStorage.getItem('instanceId')
    }
});

export default axiosInstance;