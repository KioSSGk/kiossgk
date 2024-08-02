import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AdminSignupForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        businessRegistrationNumber: '',
    });

    const [passwordError, setPasswordError] = useState('');
    const [emailChecked, setEmailChecked] = useState(false);
    const [businessRegistrationValid, setBusinessRegistrationValid] = useState(false);

    useEffect(() => {
        if (formData.password && formData.confirmPassword) {
            setPasswordError(
                formData.password === formData.confirmPassword
                    ? '비밀번호가 일치합니다.'
                    : '비밀번호가 일치하지 않습니다.'
            );
        } else {
            setPasswordError('');
        }
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const formattedPhoneNumber = value
            .replace(/[^0-9]/g, '')
            .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        setFormData({
            ...formData,
            [name]: formattedPhoneNumber,
        });
    };

    const handleEmailCheck = async () => {
        // 이메일 중복 확인 로직
        setEmailChecked(true);
    };

    const validateBusinessRegistrationNumber = async () => {
        const { businessRegistrationNumber } = formData;

        try {
            const response = await axios.post('/api/admin_signup_api/check-business-number', {
                b_no: [businessRegistrationNumber],
            });

            const isValid = response.data.data[0].tax_type !== '국세청에 등록되지 않은 사업자등록번호입니다.';
            setBusinessRegistrationValid(isValid);
        } catch (error: any) {
            console.error('사업자등록번호 확인 중 오류 발생:', error.response?.data || error.message);
            setBusinessRegistrationValid(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!businessRegistrationValid) {
            alert('유효한 사업자등록번호를 입력해 주세요.');
            return;
        }

        try {
            const response = await axios.post('/api/admin_signup_api/signup', formData);

            if (response.status === 200) {
                const { adminIdx } = response.data;
                console.log('회원가입이 완료되었습니다.');
                localStorage.setItem('adminIdx', adminIdx); // adminIdx를 localStorage에 저장
                router.push('/Storeregister'); // 회원가입 완료 후 가게 등록페이지로 가기
            } else {
                console.log('회원가입에 실패했습니다.');
            }
        } catch (error: any) {
            console.error('회원가입 요청 중 오류가 발생했습니다.', error.message);
        }
    };

    return (
        <div className="flex justify-center bg-orange-50">
            <div className='flex justify-center' style={{ width: '1280px' }}>
                <form className='p-14 px-32 bg-white rounded-2xl shadow-xl my-20' onSubmit={handleSubmit}>
                    <div className="form-group flex justify-start items-center py-2">
                        <label className='w-60' htmlFor="email">이메일(아이디)</label>
                        <input
                            className='w-80 text-sm py-2 px-4 rounded-lg border outline-gray-700'
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth: '2px' }}
                        />
                        <button className='flex items-center justify-center rounded-lg font-bold text-white w-40 h-9 bg-orange-400 ml-4' type="button" onClick={handleEmailCheck}>중복 확인</button>
                    </div>
                    <div className="form-group flex justify-start items-center py-2">
                        <label className='w-60' htmlFor="name">이름</label>
                        <input
                            className='w-80 text-sm py-2 px-4 rounded-lg border outline-gray-700'
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth: '2px' }}
                        />
                    </div>
                    <div className="form-group flex justify-start items-center py-2">
                        <label className='w-60' htmlFor="password">비밀번호</label>
                        <input
                            className='w-80 text-sm py-2 px-4 rounded-lg border outline-gray-700'
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth: '2px' }}
                        />
                    </div>
                    <div className="form-group flex justify-start items-center py-2">
                        <label className='w-60' htmlFor="confirmPassword">비밀번호 확인</label>
                        <input
                            className='w-80 text-sm py-2 px-4 rounded-lg border outline-gray-700'
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth: '2px' }}
                        />
                        {passwordError && formData.password && formData.confirmPassword && (
                            <p style={{ color: formData.password === formData.confirmPassword ? 'green' : 'red' }}>
                                {passwordError}
                            </p>
                        )}
                    </div>
                    <div className="form-group flex justify-start items-center py-2">
                        <label className='w-60' htmlFor="phoneNumber">전화번호</label>
                        <input
                            className='w-80 text-sm py-2 px-4 rounded-lg border outline-gray-700'
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handlePhoneNumberChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth: '2px' }}
                            placeholder="010-1234-5678"
                        />
                    </div>
                    <div className="form-group flex justify-start items-center py-2">
                        <label className='w-60' htmlFor="businessRegistrationNumber">사업자등록번호</label>
                        <input
                            className='w-80 text-sm py-2 px-4 rounded-lg border outline-gray-700'
                            type="text"
                            id="businessRegistrationNumber"
                            name="businessRegistrationNumber"
                            value={formData.businessRegistrationNumber}
                            onChange={handleChange}
                            onBlur={validateBusinessRegistrationNumber} // 사업자등록번호 검증
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth: '2px' }}
                        />
                        {!businessRegistrationValid && formData.businessRegistrationNumber && (
                            <p style={{ color: 'red' }}>유효한 사업자등록번호를 입력해 주세요.</p>
                        )}
                        {businessRegistrationValid && formData.businessRegistrationNumber && (
                            <p style={{ color: 'green' }}>유효한 사업자등록번호를 입력함.</p>
                        )}
                    </div>
                    <div className='flex w-full justify-start py-8'>
                        <div className='w-60'></div>
                        <button className='flex items-center justify-center rounded-lg font-bold text-white w-80 h-9 bg-orange-400 my-6' type="submit" style={{ cursor: 'pointer' }}>가게 등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSignupForm;
