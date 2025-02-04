import {initializeAuth, loginPostAsync, setLogout} from "../slices/loginSlice";
import {Navigate, useNavigate, createSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const useCustomLogin = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const loginState = useSelector(state => state.loginSlice) //-----로그인 상태

    const isLogin = loginState.email ? true : false //-----로그인 여부

    const doLogin = async(loginParam) => {
        try {
            const action = await dispatch(loginPostAsync(loginParam));

            if (action.type === 'loginPostAsync/fulfilled') {
                // 로그인 성공 시 상태 초기화를 위한 추가 dispatch
                dispatch(initializeAuth());
                return action.payload;
            } else {
                // 로그인 실패 시
                throw new Error(action.payload || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };
    const doLogout =  () =>{
        dispatch(setLogout())
    }

    const moveToPath = (path) => { //----------페이지 이동
        navigate({pathname:path},{replace:true})
    }

    const moveToLogin = () => { //-----------로그인 페이지로 이동
        navigate({pathname:'/member/signIn'},{replace:true})
    }

    const moveToLoginReturn = () =>{ //----------- 로그인 페이지로 이동 컴포넌트
        return <Navigate replace to={"/member/signIn"}/>
    }

    const exceptionHandle = (ex) => {
        console.log("Exception--------------------")

        console.log(ex)

        const errorMsg = ex.response.data.error

        const errorStr = createSearchParams({error:errorMsg}).toString()

        if (errorMsg === 'REQUIRE_LOGIN') {
            alert('로그인 해야만 합니다')
            navigate({pathname:'/member/signIn', search:errorStr})

            return
        }

        if (ex.response.data.error === 'ERROR_ACCESSDENIED') {
            alert("해당 메뉴를 사용할 수 있는 권한이 없습니다")
            navigate ({pathname:'/member/signIn', search: errorStr})
            return
        }
    }

    return {loginState, isLogin, doLogin, doLogout, moveToPath, moveToLogin, moveToLoginReturn, exceptionHandle}
}

export default useCustomLogin