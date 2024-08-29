import React from 'react';
import { MenuItem } from '@/types/menu';

interface MenuListProps {
  menuItems: MenuItem[]; // MenuItems를 props로 받음
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onOption: (item: MenuItem) => void;
  storeId: number;  
  adminId: number;
}

const MenuList: React.FC<MenuListProps> = ({ menuItems, onEdit, onDelete, onOption }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  // menuItems가 정의되어 있는지 확인하고, 없으면 빈 배열로 처리
  if (!menuItems || !Array.isArray(menuItems)) {
    return <div>메뉴가 없습니다.</div>;
  }

  return (
    <div className='w-full mb-12'>
      <div className='grid gap-6 justify-content'
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}
      >
        {menuItems.map(item => (
          <div key={item.menu_idx} className='bg-white rounded-lg' style={{ width: '400px' }}>
            <div className='justify-center border outline-gray-500 shadow-md'>
              <div className='pb-5'>
                <img 
                  src={item.image} 
                  alt={item.menu_name} 
                  style={{ width: '400px', height: '340px', objectFit: 'cover' }} 
                  onError={(e) => { e.currentTarget.src = '/path-to-your-default-image.png'; }} // 이미지 로드 실패 시 기본 이미지로 대체
                />
              </div>
              <div className='flex justify-between mx-4'>
                <div>{item.menu_name}</div>
                <div>{formatPrice(item.menu_price)}원</div>
              </div>
              <div className='flex justify-between items-center mx-4 py-5'>
                <div className='p-1 hover:bg-indigo-500 font-bold hover:text-white text-sm rounded'>
                  <button className='m-1' onClick={() => onEdit(item)}>수정하기</button>
                </div>
                <div className='p-1 hover:bg-indigo-500 font-bold hover:text-white text-sm rounded'>
                  <button className='m-1' onClick={() => onDelete(item.menu_idx)}>삭제하기</button>
                </div>
                <div className='p-1 hover:bg-indigo-500 font-bold hover:text-white text-sm rounded'>
                  <button className='m-1' onClick={() => onOption(item)}>메뉴 옵션</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MenuList;
