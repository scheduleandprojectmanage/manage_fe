import axios from 'axios';
import { JWTUtils } from '../util/jwtUtil';
import { API_CONFIG } from './config';

// 기본 인스턴스 생성 함수
const createAxiosInstance = (baseURL) => {
    const instance = axios.create({ baseURL });

    // 요청 인터셉터
    instance.interceptors.request.use(
        (config) => {
            const token = JWTUtils.getAccessToken();
            if (token) {
                const finalToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
                config.headers.Authorization = finalToken;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 응답 인터셉터
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const newAccessToken = await JWTUtils.refreshToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    console.error('토큰 갱신 실패:', refreshError);
                    JWTUtils.clearTokens();
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};


export const axiosInstance = createAxiosInstance(API_CONFIG.BASE_URL);
export const memberInstance = createAxiosInstance(`${API_CONFIG.BASE_URL}${API_CONFIG.MEMBER_PATH}`);
export const adminInstance = createAxiosInstance(`${API_CONFIG.BASE_URL}${API_CONFIG.ADMIN_PATH}`);
export const restaurantInstance = createAxiosInstance(`${API_CONFIG.BASE_URL}${API_CONFIG.RESTAURANT_PATH}`);
export const reservationInstance = createAxiosInstance(`${API_CONFIG.BASE_URL}${API_CONFIG.RESERVATION_PATH}`);
export const paymentInstance = createAxiosInstance(`${API_CONFIG.BASE_URL}${API_CONFIG.PAYMENT_PATH}`);