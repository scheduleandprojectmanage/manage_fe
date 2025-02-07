import axios from 'axios';
import { API_CONFIG } from './config';
import { JWTUtils } from '../util/jwtUtil';

const userApi = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.USER_PATH}`
});

// 요청 인터셉터 설정
userApi.interceptors.request.use(
    (config) => {
        const token = JWTUtils.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
userApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        // 토큰 만료 등의 에러 처리
        if (error.response?.status === 401) {
            // 리프레시 토큰 로직 구현
        }
        return Promise.reject(error);
    }
);

export const UserAPI = {
    async signUpUser(userData) {
        try {
            const { data } = await userApi.post('/signup/user', userData);
            return data;
        } catch (error) {
            throw this.handleError(error, '회원가입에 실패했습니다.');
        }
    },

    async login(formData) {
        try {
            const response = await userApi.post('/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log("Backend response:", response.data);
            console.log("Roles from backend:", response.data.role);

            const accessToken = response.data.accessToken.replace('Bearer ', '');
            const refreshToken = response.data.refreshToken.replace('Bearer ', '');

            if (!accessToken) throw new Error('인증 토큰이 없습니다.');
            // const payload = JSON.parse(atob(accessToken.split('.')[1]));

            // const payload = JWTUtils.parsePayload(accessToken);

            // console.log("payload : ", payload)
            console.log("response.zdata.email : ", response.data.email)
            console.log("response.data.nickname : ",response.data.nickname )
            console.log("response.data.phone : ",response.data.phone )
            console.log("response.data.id : ",response.data.id )

            const memberInfo = {
                id: response.data.id,
                email: response.data.email,
                name: response.data. name,
                // role: response.data.role,
            };

            console.log("memberInfo : ", memberInfo)

            // 토큰 저장
            JWTUtils.setTokens(accessToken, refreshToken);
            localStorage.setItem('memberInfo', JSON.stringify(memberInfo));

            return { ...response, memberInfo};
        } catch (error) {
            console.error("Login error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                fullError: error
            });
            throw this.handleError(error, '로그인에 실패했습니다.');
        }
    },


    async checkEmail(email) {
        try {
            const { data } = await userApi.get('/check-email', { params: { email } });
            return data;
        } catch (error) {
            throw this.handleError(error, '이메일 확인 중 오류가 발생했습니다.');
        }
    },

    handleError(error, defaultMessage) {
        return new Error(error.response?.data?.message || defaultMessage);
    },

    isOwner() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return userInfo?.role === 'OWNER' && userInfo?.ownerStatus === 'APPROVED';
    },


    logout() {
        JWTUtils.clearTokens();
    }
};