// src/components/MenuList.tsx
import React from 'react';

interface MenuListProps {
    items: any[];
    onEdit: (item: any) => void;
    onDelete: (id: number) => void;
}

const MenuList: React.FC<MenuListProps> = ({ items, onEdit, onDelete }) => {
    return (
        <div>
            {items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', border: '1px solid white', marginBottom: '10px', padding: '10px', color: 'white' }}>
                    <img src={URL.createObjectURL(item.image)} alt={item.name} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ marginBottom: '5px' }}><strong>메뉴 이름:</strong> {item.name}</span>
                        <span style={{ marginBottom: '5px' }}><strong>가격:</strong> {item.price}</span>
                        <span style={{ marginBottom: '5px' }}><strong>설명:</strong> {item.description}</span>
                        <span style={{ marginBottom: '5px' }}><strong>카테고리:</strong> {item.category}</span>
                        <span style={{ marginBottom: '5px' }}><strong>상태:</strong> {item.status}</span>
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={() => onEdit(item)} style={{ marginRight: '10px' }}>수정하기</button>
                            <button onClick={() => onDelete(item.id)}>삭제하기</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuList;
