// src/pages/menu.tsx
import axios from 'axios';
import React, { useState } from 'react';
import MenuList from './components/MenuList';
import MenuForm from './components/MenuForm';
import Modal from './components/Modal';

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddClick = () => {
        setEditingItem({
            id: null,
            name: '',
            price: '',
            description: '',
            category: '',
            status: '',
            image: null
        });
        setIsModalOpen(true);
    };

    const handleEditClick = (item: any) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id: number) => {
        try {
            await axios.delete('/api/menu', { data: { id } });
            setMenuItems(menuItems.filter(item => item.id !== id));
            console.log('상품 삭제 완료');
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };

    const handleSave = async (item: any) => {
        try {
            if (item.id) {
                await axios.put('/api/menu', item);
                console.log('상품 수정 완료');
            } else {
                const response = await axios.post('/api/menu', item);
                item.id = response.data.id;
                console.log('상품 등록 완료');
            }
            setMenuItems(prevItems => {
                const index = prevItems.findIndex(i => i.id === item.id);
                if (index !== -1) {
                    return prevItems.map(i => (i.id === item.id ? item : i));
                } else {
                    return [...prevItems, item];
                }
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving menu item:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{ backgroundColor: 'black', minHeight: '100vh', padding: '20px', color: 'white' }}>
            <h1>메뉴 관리</h1>
            <MenuList items={menuItems} onEdit={handleEditClick} onDelete={handleDeleteClick} />
            <button onClick={handleAddClick} style={{ margin: '20px 0' }}>메뉴 추가하기</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <MenuForm item={editingItem} onSave={handleSave} onCancel={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default MenuPage;
