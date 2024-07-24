import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface MenuFormProps {
    item: any;
    onSave: (item: any) => void;
    onCancel: () => void;
}

interface Option {
    name: string;
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
        <form onSubmit={handleSubmit} style={{ color: 'white', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
                <label style={{ color: 'white' }}>메뉴 이름</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ backgroundColor: 'white', color: 'black' }} />
            </div>
            <div>
                <label style={{ color: 'white' }}>메뉴 가격</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ backgroundColor: 'white', color: 'black' }} />
            </div>
            <div>
                <label style={{ color: 'white' }}>메뉴 설명</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required style={{ backgroundColor: 'white', color: 'black' }} />
            </div>
            <div>
                <label style={{ color: 'white' }}>메뉴 카테고리</label>
                <select name="category" value={formData.category} onChange={handleChange} required style={{ backgroundColor: 'white', color: 'black' }}>
                    <option value="">--카테고리를 선택하세요--</option>
                    <option value="한식">한식</option>
                    <option value="일식">일식</option>
                    <option value="중식">중식</option>
                    <option value="양식">양식</option>
                    <option value="디저트">디저트</option>
                </select>
            </div>
            <div>
                <label style={{ color: 'white' }}>메뉴 상태</label>
                <select name="status" value={formData.status} onChange={handleChange} required style={{ backgroundColor: 'white', color: 'black' }}>
                    <option value="주문가능">주문가능</option>
                    <option value="품절">품절</option>
                </select>
            </div>
            <div>
                <label style={{ color: 'white' }}>이미지</label>
                <input type="file" name="image" onChange={handleFileChange} required style={{ backgroundColor: 'white', color: 'black' }} />
            </div>
            <div>
                <label style={{ color: 'white' }}>옵션</label>
                {options.map((option, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <input 
                            type="text" 
                            placeholder="옵션 이름" 
                            value={option.name} 
                            onChange={(e) => handleOptionChange(index, 'name', e.target.value)} 
                            style={{ backgroundColor: 'white', color: 'black', marginRight: '10px' }} 
                        />
                        <input 
                            type="number" 
                            placeholder="옵션 가격" 
                            value={option.price} 
                            onChange={(e) => handleOptionChange(index, 'price', Number(e.target.value))} 
                            style={{ backgroundColor: 'white', color: 'black', marginRight: '10px' }} 
                        />
                        <button type="button" onClick={() => handleRemoveOption(index)} style={{ color: 'white', backgroundColor: 'red' }}>삭제</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddOption} style={{ color: 'white', backgroundColor: 'green' }}>옵션 추가</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" style={{ backgroundColor: 'white', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>저장</button>
                <button type="button" onClick={onCancel} style={{ backgroundColor: 'white', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>취소</button>
            </div>
        </form>
    );
};

export default MenuForm;
