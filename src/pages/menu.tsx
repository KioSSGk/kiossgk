// src/pages/menu.tsx
import React, { useState } from 'react';
import MenuList from './components/MenuList';
import MenuForm from './components/MenuForm';

const MenuPage: React.FC = () => {
    const [menuItems, setMenuItems] = useState<any[]>([
        {
            id: 1,
            name: '짜장면',
            price: '8000',
            description: '맛있는 짜장면',
            category: '중식',
            status: '주문가능',
            image: new File([""], "짜장면.jpg", { type: 'image/jpeg' })
        },
        {
            id: 2,
            name: '짬뽕',
            price: '9000',
            description: '얼큰한 짬뽕',
            category: '중식',
            status: '주문가능',
            image: new File([""], "짬뽕.jpg", { type: 'image/jpeg' })
        }
    ]);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleAddClick = () => {
        setEditingItem({
            id: menuItems.length + 1,
            name: '',
            price: '',
            description: '',
            category: '',
            status: '',
            image: null
        });
        setIsFormVisible(true);
    };

    const handleEditClick = (item: any) => {
        setEditingItem(item);
        setIsFormVisible(true);
    };

    const handleDeleteClick = (id: number) => {
        setMenuItems(menuItems.filter(item => item.id !== id));
    };

    const handleSave = (item: any) => {
        if (editingItem && editingItem.id) {
            setMenuItems(menuItems.map(menuItem => menuItem.id === item.id ? item : menuItem));
        } else {
            setMenuItems([...menuItems, item]);
        }
        setIsFormVisible(false);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
    };

    return (
        <div style={{ backgroundColor: 'black', minHeight: '100vh', padding: '20px', color: 'white' }}>
            <h1>메뉴 관리</h1>
            <MenuList items={menuItems} onEdit={handleEditClick} onDelete={handleDeleteClick} />
            <button onClick={handleAddClick} style={{ margin: '20px 0' }}>메뉴 추가하기</button>
            {isFormVisible && (
                <MenuForm item={editingItem} onSave={handleSave} onCancel={handleCancel} />
            )}
        </div>
    );
};

export default MenuPage;
