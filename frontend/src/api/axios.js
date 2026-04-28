import axios from "axios";

// Environment variable se URL uthayega, agar nahi mila toh localhost use karega
const baseURL = import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api/v1` 
    : "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Cookies bhejne ke liye
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Har request ke saath token bhejne ke liye
axiosInstance.interceptors.request.use(
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

export default axiosInstance;
