import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface MenuFormProps {
    item: any;
    onSave: (item: any) => void;
    onCancel: () => void;
}

interface Option {
    name: string|undefined;
    price: number;
}

const MenuForm: React.FC<MenuFormProps> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        setFormData(item);
        setOptions(item.options || []);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const uploadData = new FormData();
            uploadData.append('image', file);

            try {
                const response = await axios.post('/api/upload', uploadData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setFormData({ ...formData, image: response.data.imageUrl });
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleOptionChange = (index: number, field: string, value: string | number) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, { name: '', price: 0 }]);
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, options });
    };

    return (
                <div className='flex justify-center'>
            <form className='flex flex-col gap-4 p-12 pt-10 pb-16 bg-white text-black' onSubmit={handleSubmit}>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>이미지</label>
                    </div>
                    <input type="file" name="image" className='flex items-center border border-gray-500 h-8 w-64' onChange={handleFileChange} required />
                </div>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>메뉴 이름</label>
                    </div>
                    <input type="text" name="name" className='h-8 w-64 border border-gray-500' value={formData.name} onChange={handleChange} required />
                </div>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>메뉴 가격</label>
                    </div>
                    <input type="number" name="price" className='h-8 w-64 border border-gray-500' value={formData.price} onChange={handleChange} required />
                </div>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>메뉴 설명</label>
                    </div>
                    <textarea name="description" className='h-14 w-64 border border-gray-500' value={formData.description} onChange={handleChange} required />
                </div>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>메뉴 카테고리</label>
                    </div>
                    <select className='w-64 h-8 border border-gray-500' name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">--카테고리를 선택하세요--</option>
                        <option value="한식">한식</option>
                        <option value="일식">일식</option>
                        <option value="중식">중식</option>
                        <option value="양식">양식</option>
                        <option value="디저트">디저트</option>
                    </select>
                </div>
                <div className='flex m-2 items-center'>
                    <div className='w-28'>
                        <label className='text-black'>메뉴 상태</label>
                    </div>
                    <select className='w-64 h-8 border border-gray-500' name="status" value={formData.status} onChange={handleChange} required>
                        <option value="주문가능">주문가능</option>
                        <option value="품절">품절</option>
                    </select>
                </div>
                <div className='flex justify-end mt-4'>
                    <button type="submit" className='mx-2 py-2 px-6 bg-orange-400 text-white font-bold rounded-lg'>저장</button>
                    <button type="button" className='mx-2 py-2 px-6 bg-orange-400 text-white font-bold rounded-lg' onClick={onCancel}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default MenuForm;
