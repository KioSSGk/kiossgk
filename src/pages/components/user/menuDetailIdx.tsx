import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  status: string;
  image: string;
}
interface DBMenuItem {
  menu_idx: number;
  store_idx: number;
  menu_name: string;
  menu_price: number;
  menu_detail: string;
  menu_category: string;
  menu_status: string;
}

const MenuDetail_idx = ({ menuId }: { menuId: number }) => {
  const router = useRouter();
  const [menuItem, setMenuItem] = useState<MenuItem>();

  const fetchMenuDetailData = async () => {
    try {
      //console.log("get요청 메뉴 하나");
      //console.log(menuId);
      const response = await axios.get('/api/user_menu_detail/menudetails', {
        params: { menuId }
      });

      // GET 요청을 통해 API 호출 후 단일 메뉴 항목 설정
      //setMenuItem(response.data[0]);
      
      const dbMenuItems: DBMenuItem = response.data[0];
      //console.log("불러온 원본",dbMenuItems);
      //const user = useAuth(); 
      //console.log(user);
      // 데이터 변환
      const transformedMenuItems: MenuItem= {
          id: dbMenuItems.menu_idx,
          name: dbMenuItems.menu_name,
          price: dbMenuItems.menu_price,
          description: dbMenuItems.menu_detail,
          category: dbMenuItems.menu_category,
          status: dbMenuItems.menu_status,
          image: '', // 이미지 URL을 데이터베이스에서 가져오지 않는 경우 빈 문자열 또는 기본 이미지 URL 설정

         
      };
      //.log("변한 저장전 메뉴 객체",transformedMenuItems);
      //console.log("저장 전 메뉴 객체",menuItem);
      setMenuItem(transformedMenuItems);
      //console.log("변한 저장전 메뉴 객체2",transformedMenuItems);
      //console.log("저장 후 메뉴 객체",menuItem);
    } catch (error) {
      console.error("Error fetching the store data:", error);
    }
  };

  const handleCartClick = () => {
    router.push('/user/cart');
  };

  useEffect(() => {
    fetchMenuDetailData();
  }, [menuId]);

  if (!menuItem) {
    return <div>Loading...</div>; // 데이터가 없을 때 로딩 표시
  }

  return (
    <div className='flex justify-center pt-24'>
      <div className='max-w-sm w-full mx-4 font-bold text-white min-h-screen '>
        <div>
          <img className='h-40 w-full bg-gray-400 my-2' src={menuItem.image as unknown as string} alt={menuItem.name} />
          {/* 이미지가 없을 경우에 대한 처리도 필요할 수 있습니다 */}
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
            <label className='flex items-center my-2'>
              <input className='w-4 h-4 rounded-full mr-3' type="checkbox" />
              곱빼기
            </label>
            <label className='flex items-center my-2'>
              <input className='w-4 h-4 rounded-full mr-3' type="checkbox" />
              밥추가
            </label>
            <label className='flex items-center my-2'>
              <input className='w-4 h-4 rounded-full mr-3' type="checkbox" />
              양파빼기
            </label>
          </div>
        </div>
      </div>
      <footer className='flex justify-center items-center w-full fixed bottom-0 drop-shadow-xl bg-white' style={{ height: '56px' }}>
        <div className='flex w-full max-w-sm justify-between'>
          <div className=''>
            <button className='bg-orange-400 w-40 py-1 rounded-lg font-bold text-white'>구매하기</button>
          </div>
          <div className=''>
            <button className='bg-orange-400 w-40 py-1 rounded-lg font-bold text-white' onClick={handleCartClick}>장바구니</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MenuDetail_idx;