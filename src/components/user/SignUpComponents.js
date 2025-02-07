import React, { useState } from "react";
import InputField from "../../components/common/InputField";
import {UserAPI} from "../../api/userApi"
import useCustomMove from "../../hooks/useCustomMove";
import {useNavigate} from "react-router-dom";

const initState = {
    email: '',
    name: '',
    password: '',
};

const SignUpComponent = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ ...initState });
    const [emailError, setEmailError] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const checkEmailDuplicate = async (email) => {
        if (!email) {
            setEmailError('');
            setIsEmailValid(false);
            setIsEmailChecked(false);
            return false;
        }

        try {
            const isDuplicate = await UserAPI.checkEmail(email);
            if (isDuplicate) {
                setEmailError('이미 가입된 이메일입니다.');
                setIsEmailValid(false);
            } else {
                setEmailError('');
                setIsEmailValid(true);
            }
            setIsEmailChecked(true);
            return !isDuplicate;
        } catch (error) {
            setEmailError('이메일 확인 중 오류가 발생했습니다.');
            setIsEmailValid(false);
            setIsEmailChecked(false);
            return false;
        }
    };

    const handleChangeMember = (e) => {
        if (e.target) {
            const { name, value } = e.target;
            setUser({
                ...user,
                [name]: value
            });

            if (name === 'email') {
                setIsEmailChecked(false);
            }
        } else {
            setUser({
                ...user,
            });
        }
    };

    const handleEmailBlur = async () => {
        if (user.email) {
            await checkEmailDuplicate(user.email);
        }
    };

    const handleClickSignUp = async (e) => {
        e.preventDefault();

        if (!isEmailValid || !isEmailChecked) {
            alert('이메일 중복 확인이 필요합니다.');
            return;
        }

        try {
            const userData = {
                email: user.email,
                password: user.password,
                name: user.name,
            };

            await UserAPI.signUpUser(userData);
            setShowModal(true);
            setUser({ ...initState });
        } catch (error) {
            alert(error.message);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        // Don't store any user data during signup
        navigate("/main"); // Navigate to login page instead of main
    };

    const containerStyle = {
        width: '100%',
        maxWidth: '42rem',
        margin: '0 auto',
        padding: '2rem'
    };

    const formStyle = {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    };

    const titleStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2B3A55',
        marginBottom: '2rem'
    };

    const rowStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1rem'
    };

    const genderContainerStyle = {
        marginBottom: '1.5rem'
    };

    const genderLabelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#2B3A55',
        marginBottom: '0.5rem'
    };

    const genderOptionsStyle = {
        display: 'flex',
        gap: '2rem'
    };

    const radioGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const buttonContainerStyle = {
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem'
    };

    const buttonStyle = (color) => ({
        padding: '0.75rem 1.5rem',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: color,
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        flex: 1,
        maxWidth: '200px',
        transition: 'background-color 0.2s'
    });

    return (
        <div style={containerStyle}>
            <div style={formStyle}>
                <h4 style={titleStyle}>일반 사용자 회원가입</h4>
                <form onSubmit={handleClickSignUp}>
                    <InputField
                        type="email"
                        label="이메일"
                        name="email"
                        value={user.email}
                        onChange={handleChangeMember}
                        onBlur={handleEmailBlur}
                        required
                        error={!isEmailValid ? emailError : ''}
                        isValid={isEmailValid && isEmailChecked}
                    />
                    <InputField
                        type="password"
                        label="비밀번호"
                        name="password"
                        value={user.password}
                        onChange={handleChangeMember}
                        style={{marginBottom: '1rem'}}
                        required
                    />
                    <InputField
                        type="text"
                        label="이름"
                        name="name"
                        value={user.name}
                        onChange={handleChangeMember}
                        style={{marginBottom: '1rem'}}
                        required
                    />
                    {/* 나머지 폼 요소들... */}
                    <div style={buttonContainerStyle}>
                        <button
                            type="submit"
                            style={buttonStyle('#2B3A55')}
                            onMouseOver={e => e.target.style.backgroundColor = '#3d4f75'}
                            onMouseOut={e => e.target.style.backgroundColor = '#2B3A55'}
                        >
                            가입 완료
                        </button>
                        <button
                            type="button"
                            style={buttonStyle('#F54748')}
                            onMouseOver={e => e.target.style.backgroundColor = '#f76666'}
                            onMouseOut={e => e.target.style.backgroundColor = '#F54748'}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
            {showModal && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                         onClick={handleModalClose}
                    />

                    {/* Modal */}
                    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md
                      bg-white rounded-lg shadow-lg z-50 p-6">
                        {/* Modal Header */}
                        <h3 className="text-xl font-semibold text-center text-gray-900">
                            회원가입 완료
                        </h3>

                        {/* Modal Content */}
                        <p className="mt-4 mb-6 text-center text-gray-600">
                            회원가입을 완료했습니다. 메인으로 돌아갑니다.
                        </p>

                        {/* Modal Footer */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleModalClose}
                                className="px-4 py-2 bg-[#2B3A55] text-white rounded-md hover:bg-[#3d4f75]
                             transition-colors duration-200 focus:outline-none focus:ring-2
                             focus:ring-[#2B3A55] focus:ring-opacity-50"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SignUpComponent;