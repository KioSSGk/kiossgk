import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; // useRouter 훅 추가

const SignUpForm = () => {
    const router = useRouter(); // useRouter 훅 사용
    const [formData, setFormData] = useState({
        email: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        storeName: '',
        businessRegistrationNumber: '',
        storeImage: null as File | null,
        storePhoneNumber: '',
        storeCategory: '',
        storeOpeningHoursStart: '',
        storeOpeningHoursEnd: '',
        storeDescription: '',
    });

    const [passwordError, setPasswordError] = useState('');
    const [emailChecked, setEmailChecked] = useState(false);
    const [nicknameChecked, setNicknameChecked] = useState(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'storeImage' && (e.target as HTMLInputElement).files) {
            setFormData({
                ...formData,
                storeImage: (e.target as HTMLInputElement).files![0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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

    const handleNicknameCheck = async () => {
        // 닉네임 중복 확인 로직
        setNicknameChecked(true);
    };

    const validateBusinessRegistrationNumber = async () => {
        const { businessRegistrationNumber } = formData;

        try {
            const response = await axios.post('/api/check-business-number', {
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

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                formDataToSend.append(key, (formData as any)[key]);
            }
        }

        try {
            const response = await axios.post('/api/signup', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.log('회원가입이 완료되었습니다.');
                router.push('/login'); // 회원가입 완료 후 로그인 페이지로 리다이렉트
            } else {
                console.log('회원가입에 실패했습니다.');
            }
        } catch (error: any) {
            console.error('회원가입 요청 중 오류가 발생했습니다.', error.message);
        }
    };

    return (
        <div className="container" style={{ padding: '20px', backgroundColor: 'black' }}>
            <h1 style={{ color: 'white' }}>회원가입</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ color: 'white' }}>이메일(아이디)</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '80%', padding: '10px', display: 'inline-block' }}
                    />
                    <button type="button" onClick={handleEmailCheck} style={{ width: '18%', marginLeft: '2%', padding: '10px' }}>중복 확인</button>
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="nickname" style={{ color: 'white' }}>닉네임</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '80%', padding: '10px', display: 'inline-block' }}
                    />
                    <button type="button" onClick={handleNicknameCheck} style={{ width: '18%', marginLeft: '2%', padding: '10px' }}>중복 확인</button>
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ color: 'white' }}>비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '10px' }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="confirmPassword" style={{ color: 'white' }}>비밀번호 확인</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '10px' }}
                    />
                    {passwordError && formData.password && formData.confirmPassword && (
                        <p style={{ color: formData.password === formData.confirmPassword ? 'green' : 'red' }}>
                            {passwordError}
                        </p>
                    )}
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="phoneNumber" style={{ color: 'white' }}>전화번호</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handlePhoneNumberChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '10px' }}
                        placeholder="010-1234-5678"
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="storeName" style={{ color: 'white' }}>가게상호명</label>
                    <input
                        type="text"
                        id="storeName"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '10px' }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="businessRegistrationNumber" style={{ color: 'white' }}>사업자등록번호</label>
                    <input
                        type="text"
                        id="businessRegistrationNumber"
                        name="businessRegistrationNumber"
                        value={formData.businessRegistrationNumber}
                        onChange={handleChange}
                        onBlur={validateBusinessRegistrationNumber} // 사업자등록번호 검증
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '80%', padding: '10px', display: 'inline-block' }}
                    />
                    <button type="button" onClick={validateBusinessRegistrationNumber} style={{ width: '18%', marginLeft: '2%', padding: '10px' }}>확인</button>
                    {!businessRegistrationValid && formData.businessRegistrationNumber && (
                        <p style={{ color: 'red' }}>유효한 사업자등록번호를 입력해 주세요.</p>
                    )}
                    {businessRegistrationValid && formData.businessRegistrationNumber && (
                        <p style={{ color: 'green' }}>유효한 사업자등록번호를 입력함.</p>
                    )}
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="storeImage" style={{ color: 'white' }}>가게 이미지</label>
                    <input
                        type="file"
                        id="storeImage"
                        name="storeImage"
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '10px' }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="storePhoneNumber" style={{ color: 'white' }}>가게 전화번호</label>
                    <input
                        type="text"
                        id="storePhoneNumber"
                        name="storePhoneNumber"
                        value={formData.storePhoneNumber}
                        onChange={handlePhoneNumberChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '10px' }}
                        placeholder="02-1234-5678"
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="storeCategory" style={{ color: 'white' }}>가게 카테고리</label>
                    <select
                        id="storeCategory"
                        name="storeCategory"
                        value={formData.storeCategory}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '10px' }}
                    >
                        <option value="">--카테고리를 선택하세요--</option>
                        <option value="한식">한식</option>
                        <option value="일식">일식</option>
                        <option value="중식">중식</option>
                        <option value="양식">양식</option>
                        <option value="디저트">디저트</option>
                    </select>
                </div>
                <div className="form-group" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                    <label htmlFor="storeOpeningHoursStart" style={{ color: 'white', marginRight: '10px' }}>영업시간 설정</label>
                    <input
                        type="time"
                        id="storeOpeningHoursStart"
                        name="storeOpeningHoursStart"
                        value={formData.storeOpeningHoursStart}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '40%', padding: '10px' }}
                    />
                    <span style={{ color: 'white', margin: '0 10px' }}>~</span>
                    <input
                        type="time"
                        id="storeOpeningHoursEnd"
                        name="storeOpeningHoursEnd"
                        value={formData.storeOpeningHoursEnd}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '40%', padding: '10px' }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="storeDescription" style={{ color: 'white' }}>가게 소개글</label>
                    <textarea
                        id="storeDescription"
                        name="storeDescription"
                        value={formData.storeDescription}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '10px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>회원가입</button>
            </form>
        </div>
    );
};

export default SignUpForm;
