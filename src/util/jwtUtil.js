import axios from "axios";

export const JWTUtils = {
    parsePayload(token) {
        if (!token) return null;

        try {
            const base64Payload = token.split('.')[1];
            const normalizedPayload = base64Payload
                .replace(/-/g, '+')
                .replace(/_/g, '/');
            const paddedPayload = normalizedPayload.padEnd(
                normalizedPayload.length + (4 - (normalizedPayload.length % 4)) % 4,
                '='
            );
            return JSON.parse(atob(paddedPayload));
        } catch (error) {
            console.error('JWT 파싱 에러:', error);
            return null;
        }
    },

    decodeBase64(base64String) {
        if (!base64String) return '';
        try {
            const normalized = base64String
                .replace(/-/g, '+')
                .replace(/_/g, '/');
            const padded = normalized.padEnd(
                normalized.length + (4 - (normalized.length % 4)) % 4,
                '='
            );
            return decodeURIComponent(escape(atob(padded)));
        } catch (error) {
            console.error('Base64 디코딩 에러:', error);
            return '';
        }
    },

    getAccessToken() {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;

        // 토큰 만료 체크
        if (this.isTokenExpired(token)) {
            console.log('Access token is expired');
            return null;
        }

        return token;
    },

    getRefreshToken() {
        const token = localStorage.getItem('refreshToken');
        if (!token) return null;

        // 리프레시 토큰 만료 체크
        if (this.isTokenExpired(token)) {
            console.log('Refresh token is expired');
            this.clearTokens(); // 만료된 경우 모든 토큰 제거
            return null;
        }

        return token;
    },

    async refreshToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                throw new Error('리프레시 토큰이 없습니다.');
            }

            const response = await axios.post('http://localhost:8080/api/member/refresh-token',
                { refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            if (!accessToken || !newRefreshToken) {
                throw new Error('서버에서 유효한 토큰을 받지 못했습니다.');
            }

            this.setTokens(accessToken, newRefreshToken);
            return accessToken;

        } catch (error) {
            console.error('토큰 갱신 실패:', error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('리프레시 토큰이 만료되었거나 유효하지 않습니다.');
                this.clearTokens();
                window.location.href = '/member/signIn';
                return null;
            }

            throw new Error(error.response?.data?.message || '토큰 갱신 중 오류가 발생했습니다.');
        }
    },

    setTokens(accessToken, refreshToken) {
        if (!accessToken || !refreshToken) {
            console.error('유효하지 않은 토큰입니다.');
            return;
        }

        // Bearer 접두사 처리
        const cleanAccessToken = accessToken.replace(/^Bearer\s+/, '');
        const cleanRefreshToken = refreshToken.replace(/^Bearer\s+/, '');

        // localStorage에 저장
        localStorage.setItem('accessToken', cleanAccessToken);
        localStorage.setItem('refreshToken', cleanRefreshToken);

        // axios 헤더 설정
        this.setAuthHeader(cleanAccessToken);
    },

    isTokenExpired(token) {
        if (!token) return true;

        try {
            const payload = this.parsePayload(token);
            if (!payload || !payload.exp) return true;

            // 만료 시간 5분 전부터는 만료된 것으로 간주
            return (payload.exp * 1000) - 300000 < Date.now();
        } catch (error) {
            console.error('토큰 만료 확인 실패:', error);
            return true;
        }
    },

    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        delete axios.defaults.headers.common['Authorization'];
    },

    setAuthHeader(token) {
        if (!token) {
            delete axios.defaults.headers.common['Authorization'];
            return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};