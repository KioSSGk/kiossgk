import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MenuItem } from '@/types/menu';

interface MenuFormProps {
    item: MenuItem | null;  
    onSave: (item: MenuItem | null) => void;
    onCancel: () => void;
    adminId: number;
}

const MenuForm: React.FC<MenuFormProps> = ({ item, onSave, onCancel, adminId }) => {
    const [formData, setFormData] = useState({
        menu_idx: item?.menu_idx || 0,
        store_idx: item?.store_idx || 0,
        menu_name: '',
        menu_price: 0,
        menu_detail: '',
        menu_category: '',
        menu_status: '주문가능',
        image: '', // Base64 이미지 데이터를 저장
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (item) {
            setFormData({
                menu_idx: item.menu_idx,
                store_idx: item.store_idx,
                menu_name: item.menu_name || '',
                menu_price: item.menu_price || 0,
                menu_detail: item.menu_detail || '',
                menu_category: item.menu_category || '',
                menu_status: item.menu_status || '주문가능',
                image: item.image || '', // 초기 이미지는 Base64 문자열로 처리
            });
        }
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 이미지 파일을 Base64로 인코딩
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(',')[1]; // Base64 데이터만 추출
                if (base64String) {
                    setFormData(prevData => ({ ...prevData, image: base64String }));
                } else {
                    setError('Error encoding image to Base64');
                }
            };
            reader.readAsDataURL(file); // 파일을 Data URL로 읽어들임
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);  // 초기화

        // 유효성 검사
        if (!formData.menu_name || !formData.menu_price || !formData.menu_category || !formData.menu_status) {
            setError('모든 필드를 채워주세요.');
            setIsSubmitting(false);
            return;
        }

        try {
            let response;
            if (item && item.menu_idx) {
                response = await axios.put(`/api/admin_menu_api/menu?adminId=${adminId}`, { ...formData });
            } else {
                response = await axios.post(`/api/admin_menu_api/menu?adminId=${adminId}`, { ...formData });
                formData.menu_idx = response.data.id;
            }

            onSave({ ...formData, menu_idx: formData.menu_idx || response.data.id });
        } catch (error: any) {
            setError('서버로 데이터 전송 중 오류 발생: ' + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsSubmitting(false);
            if (!error) onCancel(); // 에러가 없을 경우에만 취소
        }
    };

    const handleDelete = async () => {
        if (!item || !item.menu_idx) return;

        try {
            await axios.delete(`/api/admin_menu_api/menu`, {
                data: { menu_idx: item.menu_idx },
            });
            onSave(null); // 삭제 후 부모 컴포넌트에 알림
        } catch (error: any) {
            setError('메뉴 삭제 중 오류 발생: ' + (error instanceof Error ? error.message : String(error)));
        } finally {
            onCancel(); // 폼 닫기
        }
    };

    return (
        <div className='flex justify-center'>
            <form className='flex flex-col gap-4 p-12 pt-10 pb-16 bg-white text-black' onSubmit={handleSubmit}>
                {error && <p className='text-red-500'>{error}</p>} {/* 오류 메시지 표시 */}
                
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>이미지</label>
                    </div>
                    <input
                        type="file"
                        name="image"
                        className='flex items-center border border-gray-500 h-8 w-64'
                        onChange={handleFileChange}
                        required={!formData.image}
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

                {item && item.menu_idx && (
                    <div className='flex justify-end mt-4'>
                        <button
                            type="button"
                            className='mx-2 py-2 px-6 bg-red-400 text-white font-bold rounded-lg'
                            onClick={handleDelete}
                        >
                            삭제
                        </button>
                    </div>
                )}

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
