import axios from 'axios';
import { API_URL } from "./API_URL";

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const AxiosConfig = {
    post: async (url, param, id) => {
        try {
            const targetUrl = id ? `${url}/${id}` : url;
            const response = await instance.post(targetUrl, param);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }, 

    get: async (url, param) => {
        try {
            const isId = typeof param === 'string' || typeof param === 'number';
            const targetUrl = isId ? `${url}/${param}` : url;
            const config = !isId ? { params: param } : {};
            const response = await instance.get(targetUrl, config);

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }, 

    put: async (url, param, id) => {
        try {
            const targetUrl = id ? `${url}/${id}` : url;
            const response = await instance.put(targetUrl, param);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }, 

    delete: async (url, id) => {
        try {
            const targetUrl = id ? `${url}/${id}` : url;
            const response = await instance.delete(targetUrl);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};