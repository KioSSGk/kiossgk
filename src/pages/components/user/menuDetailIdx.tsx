import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import UserHeader from '../UserHeader';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  status: string;
  image: string;
  store_idx: number;
}

interface DBMenuItem {
  menu_idx: number;
  store_idx: number;
  menu_name: string;
  menu_price: number;
  menu_detail: string;
  menu_category: string;
  menu_status: string;
  menu_image_path: string;
}

interface MenuOption {
  option_id: number;
  option_name: string;
  option_price: number;
}

interface DBMenuOption {
  option_idx: number;
  menu_idx: number;
  options: string;
  price: number;
  status: string;
}

const MenuDetail_idx = ({ menuId }: { menuId: number }) => {
  const router = useRouter();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fetchMenuDetailData = async () => {
    try {
      const response = await axios.get(`/api/user_menu_detail/menudetails`, {
        params: { menuId }
      });

      console.log("API Response for Menu Details:", response.data);

      const dbMenuItems: DBMenuItem = response.data[0];
      const transformedMenuItems: MenuItem = {
        id: dbMenuItems.menu_idx,
        name: dbMenuItems.menu_name,
        price: dbMenuItems.menu_price,
        description: dbMenuItems.menu_detail,
        category: dbMenuItems.menu_category,
        status: dbMenuItems.menu_status,
        image: dbMenuItems.menu_image_path,
        store_idx: dbMenuItems.store_idx
      };
      console.log("Transformed Menu Item:", transformedMenuItems);
      setMenuItem(transformedMenuItems);
    } catch (error: any) { // 에러 타입 설정
      console.error('Error adding to cart:', error);

      // 에러 메시지 상태 업데이트
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }

      // 3초 후에 에러 메시지를 지우는 타이머 설정
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // 3초 후에 사라짐
    }
  }

  const fetchMenuOptions = async () => {
    try {
      const response = await axios.get(`/api/user_menu_detail/menuoptions`, {
        params: { menuId }
      });

      console.log("API Response for Menu Options:", response.data);

      const DBMenuOption: DBMenuOption[] = response.data;
      const transformedMenuOptions: MenuOption[] = DBMenuOption.map(item => ({
        option_id: item.option_idx,
        option_name: item.options,
        option_price: item.price
      }));

      setMenuOptions(transformedMenuOptions);
    } catch (error) {
      console.error("Error fetching the menu options:", error);
    }
  };

  const handleOptionChange = (optionId: number) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(optionId)
        ? prevOptions.filter((id) => id !== optionId)
        : [...prevOptions, optionId]
    );
  };

  const handleAddToCart = async () => {
    if (!menuItem) return;

    const payload = {
      menuId: menuItem.id,
      storeId: menuItem.store_idx,
      quantity: 1,
      options: selectedOptions.map((optionId) => {
        const option = menuOptions.find((opt) => opt.option_id === optionId);
        return {
          id: option?.option_id,
          name: option?.option_name,
          price: option?.option_price
        };
      }) 
    };

    console.log("Payload to be added to cart:", payload);

    try {
      await axios.post(`/api/user_cart/usercart`, payload);
      router.push(`/user/cart`);
    } catch (error: any) {
      console.error('Error adding to cart:', error);

      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }

      // 3초 후에 에러 메시지를 지우는 타이머 설정
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // 3초 후에 사라짐
    }
  }

  useEffect(() => {
    fetchMenuDetailData();
    fetchMenuOptions();
  }, [menuId]);

  if (!menuItem) {
    return <div>Loading...</div>;
  }
  return (
    <div className='flex justify-center pt-24 bg-slate-100 min-h-dvh h-full'>
      {/* UserHeader 컴포넌트에 store_idx 전달 */}
      <UserHeader storeId={menuItem.store_idx} />
      <div className='max-w-sm w-full mx-4 font-bold'>
        {/* 에러 메시지가 있을 경우 표시 */}
        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        <div>
          <img className='h-40 w-full bg-gray-400 my-2' src={menuItem.image} alt={menuItem.name} />
          <div className='py-4'>
            <div className='text-xl pb-3'>
              {menuItem.name}
            </div>
            <div className='flex justify-between'>
              <div>가격</div>
              <div>{menuItem.price}원</div>
            </div>
            <div>{menuItem.description}</div>
          </div>
          <div className='my-2'>상품 옵션 선택</div>
          <div>
            {menuOptions.map(option => (
              <label key={option.option_id} className='flex items-center my-2'>
                <input
                  className='w-4 h-4 rounded-full mr-3'
                  type="checkbox"
                  checked={selectedOptions.includes(option.option_id)}
                  onChange={() => handleOptionChange(option.option_id)}
                />
                {option.option_name} (+{option.option_price}원)
              </label>
            ))}
          </div>
        </div>
      </div>
      <footer className='flex justify-center items-center w-full fixed bottom-0 drop-shadow-xl bg-white' style={{ height: '56px' }}>
        <div className='flex w-full max-w-sm justify-between'>
          <div className=''>
            <button className='bg-teal-400 w-40 py-1 rounded-lg font-bold text-white' onClick={()=>{router.back()}}>뒤로가기</button>
          </div>
          <div className=''>
            <button className='bg-teal-400 w-40 py-1 rounded-lg font-bold text-white' onClick={handleAddToCart}>장바구니 추가</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MenuDetail_idx;