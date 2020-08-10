import axios from 'axios';
import {getWixInstanceId} from './utils';

const axiosInstance = axios.create({
    baseURL: process.env.API_PATH,
    transformRequest: [(data, headers) => {
        // dynamically attach the instanceId to the request headers on each request
        headers.instanceId = getWixInstanceId();
        return data;
    }, ...axios.defaults.transformRequest]
});

export default axiosInstance;