import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu, MenuItem } from '@/types/menu';

interface MenuFormProps {
    item: MenuItem | null;  
    onSave: (item: MenuItem) => void;
    onCancel: () => void;
    adminId: number;
}

interface Option {
    name: string|undefined;
    price: number;
}

const MenuForm: React.FC<MenuFormProps> = ({ item, onSave, onCancel, adminId }) => {
    const [formData, setFormData] = useState({
        menu_name: '',
        menu_price: 0,
        menu_detail: '',
        menu_category: '',
        menu_status: '주문가능',
        image: '',
    });

    const [options, setOptions] = useState<Option[]>([]);
    const [isSubmitting, setisSubmitting] = useState(false);
    
    useEffect(() => {
        console.log('폼 초기화 - item:', item);
        if(item){
            console.log('item.menu_idx:', item.menu_idx);
            setFormData({
                menu_name: item.menu_name || '',
                menu_price: item.menu_price || 0,
                menu_detail: item.menu_detail || '',
                menu_category: item.menu_category || '',
                menu_status: item.menu_status || '주문가능',
                image: item.image || '',
            });
        }
        setOptions(options || []);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(`변경된 필드: ${name}, 값: ${value}`); // 필드 변경 시 로그 출력
        setFormData(prevData  => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // if (e.target.files) {
        //     const file = e.target.files[0];
        //     const uploadData = new FormData();
        //     uploadData.append('image', file);

        //     try {
        //         const response = await axios.post('/api/upload', uploadData, {
        //             headers: {
        //                 'Content-Type': 'multipart/form-data',
        //             },
        //         });
        //         setFormData((prevData) => ({ ...prevData, image: response.data.imgeurl }));
        //     } catch (error) {
        //         console.error('Error uploading file:', error);
        //     }
        // }
    };  


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('최종 제출 데이터:', formData, 'menu_idx:', item?.menu_idx); // 클라이언트 측에서 최종 데이터 확인

        // 필수 필드 유효성 검사
        if (isSubmitting) {
            console.error('필수 필드가 입력되지 않았습니다.');
            return;
        }
        setisSubmitting(true);

        try {
            console.log('API 호출 시작');
            let response;
            if(item && item.menu_idx){
                console.log('PUT 요청 보내기');
                response = await axios.put(`/api/admin_menu_api/menu?adminId=${adminId}`, { ...formData, options, menu_idx: item.menu_idx, adminId });
                console.log('상품 수정 완료');
            } else {
                response = await axios.post(`/api/admin_menu_api/menu?adminId=${adminId}`, { ...formData, options});
                console.log('상품 등록 완료');
            }
            
            console.log('API 호출 완료');
            console.log('서버 응답:', response.data); // 서버 응답 확인
         
        } catch (error) {
            console.error('서버로 데이터 전송 중 오류 발생:', error);
        } finally {
            setisSubmitting(false);
            onCancel();
        }
    };

    return (
        <div className='flex justify-center'>
            <form className='flex flex-col gap-4 p-12 pt-10 pb-16 bg-white text-black' onSubmit={handleSubmit}>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>이미지</label>
                    </div>
                    <input 
                        type="file" 
                        name="image" 
                        className='flex items-center border border-gray-500 h-8 w-64' 
                        onChange={handleFileChange} 
                        required={!formData.image} // 이미 이미지가 있는 경우 파일 업로드를 필수로 하지 않음
                    />
                </div>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>메뉴 이름</label>
                    </div>
                    <input 
                        type="text" 
                        name="menu_name" 
                        className='h-8 w-64 border border-gray-500' 
                        value={formData.menu_name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>메뉴 가격</label>
                    </div>
                    <input 
                        type="number" 
                        name="menu_price" 
                        className='h-8 w-64 border border-gray-500' 
                        value={formData.menu_price} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>메뉴 설명</label>
                    </div>
                    <textarea 
                        name="menu_detail" 
                        className='h-14 w-64 border border-gray-500' 
                        value={formData.menu_detail} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>메뉴 카테고리</label>
                    </div>
                    <select 
                        className='w-64 h-8 border border-gray-500' 
                        name="menu_category" 
                        value={formData.menu_category} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">--카테고리를 선택하세요--</option>
                        <option value="메인">메인</option>
                        <option value="사이드">사이드</option>
                        <option value="밥">밥</option>
                        <option value="식사류">식사류</option>
                        <option value="면">면</option>
                        <option value="찌개">찌개</option>
                        <option value="디저트">디저트</option>
                        <option value="세트">세트</option>
                        <option value="음료">음료</option>
                        <option value="주류">주류</option>

                    </select>
                </div>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>메뉴 상태</label>
                    </div>
                    <select 
                        className='w-64 h-8 border border-gray-500' 
                        name="menu_status" 
                        value={formData.menu_status} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="주문가능">주문가능</option>
                        <option value="품절">품절</option>
                    </select>
                </div>
                <div className='flex justify-end mt-4'>
                    <button type="submit" className='mx-2 py-2 px-6 bg-orange-400 text-white font-bold rounded-lg' disabled={isSubmitting}>
                        {isSubmitting ? '저장 중...' : '저장'}
                    </button>
                    <button type="button" className='mx-2 py-2 px-6 bg-orange-400 text-white font-bold rounded-lg' onClick={onCancel}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default MenuForm;