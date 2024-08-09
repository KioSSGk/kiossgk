import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MenuList from '@/pages/components/admin/menu/MenuList';
import MenuForm from '@/pages/components/admin/menu/MenuForm';
import Menu_Edit_Modal from '@/pages/components/admin/menu/MenuEditModal';
import MenuOptionModal from '@/pages/components/admin/menu/MenuOptionModal';
import { MenuItem } from '@/types/menu';

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [storeId, setStoreId] = useState<number | null>(null); // storeId의 초기 타입을 number로 변경
  const router = useRouter();
  const { adminId } = router.query;

  useEffect(() => {
    if (adminId) {
      fetchStoreId(adminId as string); // adminId를 사용하여 storeId를 가져옴
    }
  }, [adminId]);

  const fetchStoreId = async (adminId: string) => {
    try {
      const response = await axios.get('/api/admin_menu_api/menu', {
        params: { adminId }
      });
      const storeIdNumber = Number(response.data.storeId); // storeId를 숫자로 변환
      setStoreId(storeIdNumber); // storeId를 숫자로 변환하여 설정
      fetchMenuItems(storeIdNumber); // storeId를 숫자로 변환하여 사용
    } catch (error) {
      console.error('Error fetching store ID:', error);
    }
  };

  const fetchMenuItems = async (storeId: number) => {
    try {
      const response = await axios.get('/api/admin_menu_api/menu', {
        params: { storeId }
      });
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleAddClick = () => {
    setEditingItem({
      menu_idx: 0,
      store_idx: storeId || 0, // storeId 설정
      menu_name: '',
      menu_price: 0,
      menu_detail: '',
      menu_category: '',
      menu_status: '',
      image: ''
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (menu_idx: number) => {
    try {
      await axios.delete('/api/admin_menu_api/menu', { data: { id: menu_idx } });
      setMenuItems(menuItems.filter(item => item.menu_idx !== menu_idx));
      console.log('상품 삭제 완료');
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleOptionClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsOptionModalOpen(true);
  };

  const handleSaveOption = async (item: MenuItem) => {
    setIsModalOpen(false);
  };

  const handleSave = async (item: MenuItem) => {
    try {
      item.store_idx = storeId || 0; // storeId 설정
      if (item.menu_idx) {
        await axios.put('/api/admin_menu_api/menu', item);
        console.log('상품 수정 완료');
      } else {
        const response = await axios.post('/api/admin_menu_api/menu', item);
        item.menu_idx = response.data.id;
        console.log('상품 등록 완료');
      }
      setMenuItems(prevItems => {
        const index = prevItems.findIndex(i => i.menu_idx === item.menu_idx);
        if (index !== -1) {
          return prevItems.map(i => (i.menu_idx === item.menu_idx ? item : i));
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
        <div className='h-dvh bg-gray-200 flex justify-center'>
            <div style={{ width: '1280px' }}>
                {storeId !== null && (
                  <MenuList
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onOption={handleOptionClick}
                    storeId={storeId}
                    adminId={Number(adminId)} // adminId 전달
                  />
                )}
                <div className='flex justify-center fixed bottom-4'>
                    <div className='flex justify-center mx-3' style={{width:'1280px'}}></div>
                    <div className='bg-white rounded-3xl flex justify-center' style={{width:'40px', height:'40px'}}>
                        <button className='rounded-2xl' onClick={handleAddClick}>+</button>
                    </div>
                </div>
                <Menu_Edit_Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <MenuForm item={editingItem} onSave={handleSave} onCancel={handleCloseModal} />
                </Menu_Edit_Modal>
                <MenuOptionModal isOpen={isOptionModalOpen} onClose={handleCloseOptionModal} item={editingItem} onSaveOption={handleSaveOption} />
            </div>
    </div>
  );
};

export default MenuPage;
