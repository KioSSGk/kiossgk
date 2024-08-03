import React, { useState,useEffect } from 'react';
import axios from 'axios';
import StoreSelect from '../user_main/StoreSelect';
import { useRouter } from 'next/router'; // useRouter 훅 추가
interface mdetails {
                id: number;
                name: string;
                price: string;
                description: string;
                category: string;
                status: string
                image: File;
               
  }


const MenuDetail_idx = () => {

  const router = useRouter(); // useRouter 훅 사용
  // API에서 데이터를 가져오는 함수
  const [menuItems, setMenuItems] = useState<mdetails[]>([
  ]);
  const fetchMenuDetailData = async () => {
    try {
      const response = await axios.get('/api/user_menu_detail/menudetails'); // GET 요청을 통해 API 호출
      setMenuItems(response.data);
      
    } catch (error) {
      console.error("Error fetching the store data:", error);
    }
  };
      // 장바구니 버튼 클릭 시 호출되는 함수
      const handleCartClick = () => {
        router.push('/userCart'); // 장바구니 페이지로 리디렉션
    };


  // 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    fetchMenuDetailData();
  }, []);


    return(
        <div className='flex justify-center pt-24'>
          <div className='max-w-sm w-full mx-4 font-bold text-white min-h-screen '>
            {menuItems.map((data) => (
                <div key={data.id}>
                  <img className='h-40 w-full bg-gray-400 my-2 ' src = {data.image}></img>
                  <div className='py-4'>
                    <div className=' text-xl  pb-3'>
                      {data.name}
                    </div>
                    <div className='flex justify-between'>
                      <div>
                        가격
                      </div>
                      <div>
                        {data.price}원
                      </div>
                    </div>
                    <div className=''>
                      {data.description}
                    </div>
                  </div>
                    <div className='my-2'>
                      상품 옵션 선택
                    </div>
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
            ))}
          </div>
            <footer className='flex justify-center items-center w-full fixed bottom-0 drop-shadow-xl bg-white' style={{height:'56px'}}>
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