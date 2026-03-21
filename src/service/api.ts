import axios from 'axios';
import { ErrorUtil } from '@/common/ErrorUtil';
import { globalState } from '@/common/GlobalState';

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to set loading
api.interceptors.request.use((config) => {
    globalState.setLoading(true);
    return config;
}, (error) => {
    globalState.setLoading(false);
    return Promise.reject(error);
});

// Response interceptor for global error handling and loading
api.interceptors.response.use(
    (response) => {
        globalState.setLoading(false);
        return response;
    },
    (error) => {
        globalState.setLoading(false);
        if (error.response) {
            // Transform and throw errors from the backend
            ErrorUtil.throwError(error.response);
        } else if (error.request) {
            // Network or timeout error
            throw ErrorUtil.createError({
                data: {
                    type: 'SYSTEM_EXCEPTION',
                    message: 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.'
                }
            });
        } else {
            // Unknown error
            throw ErrorUtil.createError(error);
        }
    }
);

export default api;