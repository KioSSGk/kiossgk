// src/components/MenuForm.tsx
import React, { useState, useEffect } from 'react';

interface MenuFormProps {
    item: any;
    onSave: (item: any) => void;
    onCancel: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);

    useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ color: 'white' }}>
            <div>
                <label>메뉴 이름</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>메뉴 가격</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div>
                <label>메뉴 설명</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div>
                <label>메뉴 카테고리</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">--카테고리를 선택하세요--</option>
                    <option value="한식">한식</option>
                    <option value="일식">일식</option>
                    <option value="중식">중식</option>
                    <option value="양식">양식</option>
                    <option value="디저트">디저트</option>
                </select>
            </div>
            <div>
                <label>메뉴 상태</label>
                <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="주문가능">주문가능</option>
                    <option value="품절">품절</option>
                </select>
            </div>
            <div>
                <label>이미지</label>
                <input type="file" name="image" onChange={handleFileChange} required />
            </div>
            <button type="submit">저장</button>
            <button type="button" onClick={onCancel}>취소</button>
        </form>
    );
};

export default MenuForm;
