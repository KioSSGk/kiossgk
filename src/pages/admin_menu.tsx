import axios from 'axios';
import React, { useState } from 'react';
import MenuList from './components/admin_menu/MenuList';
import MenuForm from './components/admin_menu/MenuForm';
import Menu_Edit_Modal from './components/admin_menu/Menu_Edit_Modal';
import MenuOptionModal from './components/admin_menu/MenuOptionModal';

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
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

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
            await axios.delete('/api/admin_menu_api/menu', { data: { id } });
            setMenuItems(menuItems.filter(item => item.id !== id));
            console.log('상품 삭제 완료');
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };

    const handleOptionClick = (item: any) => {
        setEditingItem(item);
        setIsOptionModalOpen(true);
    };

    const handleSave = async (item: any) => {
        try {
            if (item.id) {
                await axios.put('/api/admin_menu_api/menu', item);
                console.log('상품 수정 완료');
            } else {
                const response = await axios.post('/api/admin_menu_api/menu', item);
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

    const handleCloseOptionModal = () => {
        setIsOptionModalOpen(false);
    };

    return (
        <div className='bg-orange-50 flex justify-center' style={{ minHeight: '100vh', padding: '20px', color: 'black' }}>
            <div className='bg-white rounded-2xl shadow-xl overflow-y-auto' style={{ width: '1280px' }}>
                <MenuList items={menuItems} onEdit={handleEditClick} onDelete={handleDeleteClick} onOption={handleOptionClick} />
                <div className='flex justify-center h-24 my-6'>
                    <button className='flex items-center justify-center border outline-gray-500 rounded-2xl' onClick={handleAddClick} style={{ width: '1200px', borderWidth: '2px' }}>메뉴 추가하기</button>
                </div>
                <Menu_Edit_Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <MenuForm item={editingItem} onSave={handleSave} onCancel={handleCloseModal} />
                </Menu_Edit_Modal>
                <MenuOptionModal isOpen={isOptionModalOpen} onClose={handleCloseOptionModal} item={editingItem} />
            </div>
        </div>
    );
};

export default MenuPage;
