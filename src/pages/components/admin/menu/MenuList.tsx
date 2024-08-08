import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Menu } from '@/types/menu';

// 데이터베이스에서 불러온 데이터 형식
interface DBMenuItem extends Menu {
  menu_image_path?: string;
}


// 컴포넌트에서 사용하는 데이터 형식
interface MenuItem {
  menu_idx: number;
  store_idx: number;
  menu_name: string;
  menu_price: number;
  menu_detail: string | null;
  menu_category: string;
  menu_status: string;
  image: string; // Assuming image is a URL or base64 encoded string
}

interface MenuListProps {
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onOption: (item: MenuItem) => void;
  adminId?: number;
  storeId: number;
}

const MenuList: React.FC<MenuListProps> = ({ onEdit, onDelete, onOption, adminId }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('/api/admin_menu_api/menu', {
          params: { storeId: adminId }
        });
        const dbMenuItems: DBMenuItem[] = response.data;
        const transformedMenuItems: MenuItem[] = dbMenuItems.map(item => ({
          menu_idx: item.menu_idx,
          store_idx: item.store_idx,
          menu_name: item.menu_name,
          menu_price: item.menu_price,
          menu_detail: item.menu_detail,
          menu_category: item.menu_category,
          menu_status: item.menu_status,
          image: item.menu_image_path || '', // 이미지 URL 설정
        }));
        setMenuItems(transformedMenuItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, [adminId]);

  return (
    <div>
      {menuItems.map(item => (
        <div key={item.menu_idx} className='flex py-6 justify-center'>
          <div className='flex p-6 justify-center bg-white rounded-2xl border outline-gray-500' style={{ width: '1200px', borderWidth: '2px' }}>
            <div className='px-4'>
              <img src={item.image} alt={item.menu_name} style={{ width: '120px', height: '120px' }} />
            </div>
            <div className='m-4 w-32 h-24'>
              <div className='m-2 pb-4'>
                <strong>메뉴 이름</strong>
              </div>
              <div className='m-2 pt-4'>
                <span>{item.menu_name}</span>
              </div>
            </div>
            <div className='m-4 w-32 h-24'>
              <div className='m-2 pb-4'>
                <strong>가격</strong>
              </div>
              <div className='m-2 pt-4'>
                <span>{item.menu_price}</span>
              </div>
            </div>
            <div className='m-4 w-32 h-24'>
              <div className='m-2 pb-4 '>
                <strong>설명</strong>
              </div>
              <div className='m-2 pt-4 overflow-hidden text-ellipsis whitespace-nowrap'>
                <span>{item.menu_detail}</span>
              </div>
            </div>
            <div className='m-4 w-32 h-24'>
              <div className='m-2 pb-4'>
                <strong>카테고리</strong>
              </div>
              <div className='m-2 pt-4'>
                <span>{item.menu_category}</span>
              </div>
            </div>
            <div className='m-4 w-32 h-24'>
              <div className='m-2 pb-4'>
                <strong>상태</strong>
              </div>
              <div className='m-2 pt-4'>
                <span>{item.menu_status}</span>
              </div>
            </div>
            <div className='p-4'>
              <div className='p-2 mb-3 bg-orange-400 font-bold text-white rounded'>
                <button className='rounded-2xl m-1' onClick={() => onEdit(item)}>수정하기</button>
              </div>
              <div className='p-2 mt-3 bg-orange-400 font-bold text-white rounded'>
                <button className='rounded-2xl m-1' onClick={() => onDelete(item.menu_idx)}>삭제하기</button>
              </div>
              <div className='p-2 mt-3 bg-orange-400 font-bold text-white rounded'>
                <button className='rounded-2xl m-1' onClick={() => onOption(item)}>메뉴 옵션</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuList;
