import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Logout = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         // 토큰이 있으면 이전 페이지로 리디렉션
    //         router.back();
    //     }
    // }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-orange-50 flex justify-center items-center">
            <form  className="pt-28 pb-40 px-16 bg-white rounded-2xl shadow-xl z-20">
                <button onClick={handleLogout} type="button" className="block  font-bold text-white bg-orange-400 text-sm py-2 px-4 my-3 rounded-lg w-full border outline-gray-500">로그아웃</button>
            </form>
        </div>
    );
};

export default Logout;
