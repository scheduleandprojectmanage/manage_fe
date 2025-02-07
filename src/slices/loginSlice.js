import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {UserAPI} from "../api/userApi";

const initState = {
    id: '',
    email: '',
    name: '',
    accessToken: '',
    refreshToken: '',
};

// JWT 토큰 파싱 헬퍼 함수
const parseJWTPayload = (token) => {
    try {
        const base64Payload = token.split('.')[1];
        const cleanedPayload = base64Payload
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const paddedPayload = cleanedPayload.padEnd(
            cleanedPayload.length + (4 - (cleanedPayload.length % 4)) % 4,
            '='
        );

        return JSON.parse(atob(paddedPayload));
    } catch (error) {
        console.error('JWT 파싱 에러:', error);
        throw new Error('유효하지 않은 토큰 형식입니다.');
    }
};

// 초기 인증 상태 로드
export const initializeAuth = () => (dispatch) => {
    const accessToken = localStorage.getItem('accessToken');
    const memberInfoStr = localStorage.getItem('memberInfo');

    if (accessToken && memberInfoStr) {
        try {
            const memberInfo = JSON.parse(memberInfoStr);
            dispatch(setLogin({
                id: memberInfo.id,
                email: memberInfo.email,
                name: memberInfo.name,
                accessToken,
                refreshToken: localStorage.getItem('refreshToken')
            }));
        } catch (error) {
            console.error('memberInfo 파싱 에러:', error);
            localStorage.clear();
        }
    }
};

// 로그인 비동기 액션
export const loginPostAsync = createAsyncThunk(
    'loginPostAsync',
    async (param, {rejectWithValue}) => {
        try {
            const response = await UserAPI.login(param);
            console.log("로그인 API 응답:", response);

            if (!response.accessToken) {
                throw new Error('액세스 토큰이 없습니다.');
            }

            const payload = parseJWTPayload(response.accessToken);

            return {
                id: response.memberInfo.id,
                email: response.memberInfo.email,
                name: response.memberInfo.name,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            };
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: initState,
    reducers: {
        setLogin: (state, action) => {
            const { id, email, name, accessToken, refreshToken } = action.payload;

            // 상태 업데이트
            state.id = id;
            state.email = email;
            state.name = name;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;

            // localStorage에 저장
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('memberInfo', JSON.stringify({
                id,
                email,
                name,
            }));

            console.log("로그인 상태 업데이트:", action.payload);
        },
        setLogout: (state) => {
            // 상태 초기화
            Object.assign(state, initState);

            // localStorage 클리어
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('memberInfo');

            console.log("로그아웃 되었습니다.");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginPostAsync.fulfilled, (state, action) => {
                loginSlice.caseReducers.setLogin(state, action);
            })
            .addCase(loginPostAsync.rejected, (state, action) => {
                console.error("로그인 실패:", action.payload);
            });
    }
});

export const {setLogin, setLogout} = loginSlice.actions;
export default loginSlice.reducer;