import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MenuList from '@/pages/components/admin/menu/MenuList';
import MenuForm from '@/pages/components/admin/menu/MenuForm';
import Menu_Edit_Modal from '@/pages/components/admin/menu/MenuEditModal';
import MenuOptionModal from '@/pages/components/admin/menu/MenuOptionModal';
import { MenuItem } from '@/types/menu';
import HeaderIcon from '@/pages/components/admin/HeaderIcon';
import { MenuOption } from '@/types/menuOption';
import AdminHeader from '@/pages/components/admin/AdminHeader';

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [storeId, setStoreId] = useState<number | null>(null);
  const router = useRouter();
  const { adminId } = router.query;

  useEffect(() => { 
    if (adminId) {
      fetchStoreId(adminId as string); // adminId를 사용하여 storeId를 가져옴
    }
  }, [adminId]);

  const fetchStoreId = async (adminId: string) => {
    try {
      const response = await axios.get('/api/admin_menu_api/store', {
        params: { adminId }
      });
      const storeIdNumber = Number(response.data.storeId);
      setStoreId(storeIdNumber);
      fetchMenuItems(storeIdNumber);
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
      store_idx: storeId || 0,
      menu_name: '',
      menu_price: 0,
      menu_detail: '',
      menu_category: '',
      menu_status: '주문가능',
      image: ''
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (savedItem: MenuItem | null) => {
    if (savedItem) {
      setMenuItems(prevItems => {
        const index = prevItems.findIndex(i => i.menu_idx === savedItem.menu_idx);
        if (index !== -1) {
          return prevItems.map(i => (i.menu_idx === savedItem.menu_idx ? savedItem : i));
        } else {
          return [...prevItems, savedItem];
        }
      });
    } else if (editingItem && editingItem.menu_idx) {
      // 메뉴가 삭제된 경우
      setMenuItems(prevItems => prevItems.filter(i => i.menu_idx !== editingItem.menu_idx));
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteClick = async (menu_idx: number) => {
    try {
      await axios.delete('/api/admin_menu_api/menu', { data: { id: menu_idx } });
      setMenuItems(menuItems.filter(item => item.menu_idx !== menu_idx));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleOptionClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsOptionModalOpen(true);
  };

  const handleSaveOption = async (menuId:number, option:MenuOption) => {
    try {
      const url = `/api/admin_menu_api/option?menuId=${menuId}`;
      await axios.post(url, { option });
    } catch (error) {
      console.error('Error adding menu option', error);
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleCloseOptionModal = () => {
    setIsOptionModalOpen(false);
  };

  return (
    <div className='min-h-dvh h-full bg-gray-200 '>
      <AdminHeader/>
      <HeaderIcon />
      <div className='h-auto bg-gray-200 flex justify-center'>
        <div style={{ width: '1280px' }}>
          {storeId !== null && (
            <MenuList
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onOption={handleOptionClick}
              storeId={storeId}
              adminId={Number(adminId)}
            />
          )}
          <div className='flex justify-center mx-3'></div>
          <div className='bg-white rounded-full justify-center' 
          style={{
            position: 'fixed',
            bottom: '20px',
            left: 'calc(50% + 640px + 20px)',
            width: '70px',
            height: '70px',
            zIndex: '10'
          }}>
            <button className='rounded-4xl text-xl font-bold' style={{ width: '70px', height: '70px' }} onClick={handleAddClick}>+</button>
          </div>
          <Menu_Edit_Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <MenuForm item={editingItem} onSave={handleSave} onCancel={handleCloseModal} adminId={Number(adminId)} />
          </Menu_Edit_Modal>
          <MenuOptionModal isOpen={isOptionModalOpen} onClose={handleCloseOptionModal} item={editingItem} onSaveOption={handleSaveOption} />
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
