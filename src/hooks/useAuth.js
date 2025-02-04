// hooks/useAuth.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLogin, setLogout } from '../store/loginSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const loginState = useSelector(state => state.loginSlice);

    useEffect(() => {
        const checkAuth = () => {
            const accessToken = localStorage.getItem('accessToken');
            const userInfoStr = localStorage.getItem('userInfo');

            if (!accessToken || !userInfoStr) {
                dispatch(setLogout());
                return;
            }

            try {
                const userInfo = JSON.parse(userInfoStr);
                if (loginState.accessToken !== accessToken) {
                    dispatch(setLogin({
                        id: userInfo.id,
                        email: userInfo.email,
                        nickname: userInfo.nickname,
                        userRole: userInfo.userRole,
                        accessToken,
                        refreshToken: localStorage.getItem('refreshToken')
                    }));
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                dispatch(setLogout());
            }
        };

        checkAuth();
    }, [dispatch, loginState.accessToken]);

    return loginState;
};