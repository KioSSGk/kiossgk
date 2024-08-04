import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/login_api/login', { email, password });

            if (response.status === 200) {
                console.log('로그인이 완료되었습니다.');
                const token = response.data.token;
                if (token) {
                    console.log('토큰:', token);
                    localStorage.setItem('token', token);
                    console.log('로컬 스토리지에 저장된 토큰:', localStorage.getItem('token'));
                    router.push('/admin/main');
                } else {
                    console.log('토큰이 없습니다.');
                }
            } else {
                console.log('로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('로그인 요청 중 오류가 발생했습니다.', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleCreateAccountClick = () => {
        router.push('/admin/Signup');
    };

    return (
        <div className="min-h-screen bg-orange-50 flex justify-center items-center">
            <form onSubmit={handleSubmit} className="pt-28 pb-40 px-16 bg-white rounded-2xl shadow-xl z-20">
                <div>
                    <h1 className="text-3xl font-bold text-center mb-4">Universal Kiosk</h1>
                </div>
                <div className="space-y-4">
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ backgroundColor: 'white', color: 'black' }}
                            className="block text-sm py-2 my-1 px-4 rounded-lg w-full border outline-gray-500"
                        />
                    </div>
                    <div className="form-group">
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ backgroundColor: 'white', color: 'black' }}
                                className="block text-sm py-2 my-2 px-4 rounded-lg w-full border outline-gray-500"
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className='text-gray-500 py-2'
                >
                    {showPassword ? '*숨기기' : '*보이기'}
                </button>
                <button type="submit" className="block  font-bold text-white bg-orange-400 text-sm py-2 px-4 my-3 rounded-lg w-full border outline-gray-500">로그인</button>
                <button onClick={handleCreateAccountClick} type="button" className="block  font-bold text-white bg-orange-400 text-sm py-2 px-4 my-3 rounded-lg w-full border outline-gray-500">회원가입</button>
            </form>
        </div>
    );
};

export default LoginForm;
