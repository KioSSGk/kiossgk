import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const StoreRegisterForm = () => {
    const router = useRouter();
    const [workplaces, setWorkplaces] = useState([]);
    const [formData, setFormData] = useState({
        storeName: '',
        workplaceIdx: '',
        storeImage: null as File | null,
        storePhoneNumber: '',
        storeCategory: '',
        storeOpeningTime: '',
        storeClosingTime: '',
        storeDescription: '',
    });

    useEffect(() => {
        const fetchWorkplaces = async () => {
            try {
                const response = await axios.get('/api/admin/getWorkplaces');
                setWorkplaces(response.data);
            } catch (error) {
                console.error('사업장 데이터를 불러오는 중 오류가 발생했습니다.', error);
            }
        };

        fetchWorkplaces();
    }, []);

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
            .replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
        setFormData({
            ...formData,
            [name]: formattedPhoneNumber,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                formDataToSend.append(key, (formData as any)[key]);
            }
        }

        try {
            const response = await axios.post('/api/admin/storeRegister', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.log('가게 등록이 완료되었습니다.');
                router.push('/login');
            } else {
                console.log('가게 등록에 실패했습니다.');
            }
        } catch (error: any) {
            console.error('가게 등록 요청 중 오류가 발생했습니다.', error.message);
        }
    };

    return (
        <div className="flex justify-center bg-orange-50">
            <div className='flex justify-center' style={{ width:'1280px'}}>
                <form className=' p-14 px-32 bg-white rounded-2xl shadow-xl my-20' onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group flex justify-start items-center">
                        <label className='w-60 py-6' htmlFor="storeName">가게 상호명</label>
                        <input
                            className='w-80 text-sm py-2 px-4 my-1 rounded-lg border outline-gray-700'
                            type="text"
                            id="storeName"
                            name="storeName"
                            value={formData.storeName}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth:'2px'}}
                        />
                    </div>
                    <div className="form-group flex justify-start items-center">
                        <label className='w-60 py-6' htmlFor="workplaceIdx">사업장 이름</label>
                        <select
                            className='w-80 text-sm py-2 px-4 my-1 rounded-lg border outline-gray-700'
                            id="workplaceIdx"
                            name="workplaceIdx"
                            value={formData.workplaceIdx}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth:'2px'}}
                        >
                            <option value="">--사업장을 선택하세요--</option>
                            {workplaces.map((workplace: any) => (
                                <option key={workplace.workplace_idx} value={workplace.workplace_idx}>
                                    {workplace.workplace_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group flex justify-start items-center">
                        <label className='w-60 py-6' htmlFor="storeImage">가게 이미지</label>
                        <input
                            className='w-80 text-sm py-2 px-4 my-1 rounded-lg border outline-gray-700'
                            type="file"
                            id="storeImage"
                            name="storeImage"
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth:'2px'}}
                        />
                    </div>
                    <div className="form-group flex justify-start items-center">
                        <label className='w-60 py-6' htmlFor="storePhoneNumber">가게 전화번호</label>
                        <input
                            className='w-80 text-sm py-2 px-4 my-1 rounded-lg border outline-gray-700'
                            type="text"
                            id="storePhoneNumber"
                            name="storePhoneNumber"
                            value={formData.storePhoneNumber}
                            onChange={handlePhoneNumberChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth:'2px'}}
                            placeholder="02-1234-5678"
                        />
                    </div>
                    <div className="form-group flex justify-start items-center">
                        <label className='w-60 py-6' htmlFor="storeCategory">가게 카테고리</label>
                        <select
                            className='w-80 text-sm py-2 px-4 my-1 rounded-lg border outline-gray-700'
                            id="storeCategory"
                            name="storeCategory"
                            value={formData.storeCategory}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth:'2px'}}
                        >
                            <option value="">--카테고리를 선택하세요--</option>
                            <option value="한식">한식</option>
                            <option value="일식">일식</option>
                            <option value="중식">중식</option>
                            <option value="양식">양식</option>
                            <option value="디저트">디저트</option>
                        </select>
                    </div>
                    <div className="form-group flex justify-start items-center">
                        <label className='w-60 py-6' htmlFor="storeOpeningTime">오픈 시간</label>
                        <input
                            className='w-80 text-sm py-2 px-4 my-1 rounded-lg border outline-gray-700'
                            type="time"
                            id="storeOpeningTime"
                            name="storeOpeningTime"
                            value={formData.storeOpeningTime}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth:'2px'}}
                        />
                    </div>
                    <div className="form-group flex justify-start items-center">
                        <label className='w-60 py-6' htmlFor="storeClosingTime">마감 시간</label>
                        <input
                            className='w-80 text-sm py-2 px-4 my-1 rounded-lg border outline-gray-700'
                            type="time"
                            id="storeClosingTime"
                            name="storeClosingTime"
                            value={formData.storeClosingTime}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth:'2px'}}
                        />
                    </div>
                    <div className="form-group flex justify-start items-center">
                        <label className='w-60 py-6' htmlFor="storeDescription">가게 소개글</label>
                        <textarea
                            className='w-80 text-sm py-2 px-4 my-1 rounded-lg border outline-gray-700'
                            id="storeDescription"
                            name="storeDescription"
                            value={formData.storeDescription}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: 'white', color: 'black', borderWidth:'2px'}}
                        />
                    </div>
                    <div className='flex w-full justify-start py-8'>
                        <div className='w-60'></div>
                        <button className='flex items-center justify-center rounded-lg font-bold text-white w-80 h-9 bg-orange-400 my-6 ' type="submit" style={{ cursor: 'pointer' }}>가게 등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StoreRegisterForm;
