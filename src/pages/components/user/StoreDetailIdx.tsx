import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


interface mdetails {
    id: number;
    name: string;
    price: string;
    description: string;
    category: string;
    status: string
    image: File;
   
}

const StoreDetail_idx = () => {
    const router = useRouter();
   // API에서 데이터를 가져오는 함수
const [menuItems, setMenuItems] = useState<mdetails[]>([
]);
const fetchMenuDetailData = async () => {
try {
const response = await axios.get('/api/user_store_detail_api/storedetails'); // GET 요청을 통해 API 호출
setMenuItems(response.data);

} catch (error) {
console.error("Error fetching the store data:", error);
}
};

// 메뉴를 클릭했을 때 호출되는 함수
const handleMenuClick = async (menuid: number) => {
    
    try {
      await axios.post('/api/user_store_detail_api/menuClick', { menuid }); // API 엔드포인트를 '/api/storeClick'으로 변경
    } catch (error) {
      console.error("Error logging the store click:", error);
    }
    router.push("/user/menudetail");
  };

// 컴포넌트가 마운트될 때 데이터를 가져옴
useEffect(() => {
fetchMenuDetailData();
}, []);


return(
  <div className="h-auto bg-orange-400">
    <div className='flex justify-center min-h-screen pt-24'>
      <div className='max-w-sm w-full'>
        <div className='flex overflow-x-auto whitespace-nowrap'>
    {menuItems.map((data) => (
        <button className='px-3 mx-2 my-1 border-2 border-white rounded-lg text-white font-bold drop-shadow-lg' key={data.id}>
          {data.category}
        </button>
    ))}
    </div>
    {menuItems.map((data) => (
        <div className='flex items-center' key={data.id} onClick={()=>handleMenuClick(data.id)} style={{ cursor: 'pointer' }}>
            <div className='flex items-center m-2'>
              <div className='w-20 h-20 bg-gray-400 rounded-xl'>
                <img src = {'data.image'}></img>
                {/* 여기도 꼭 수정해야해요;;;;;; */}
              </div>
              <div className='mx-4 text-white'>
                <div className='font-bold my-1'>
                  {data.name} <br></br>
                </div>
                <div className='text-sm'>
                  {data.price} <br></br>
                  {data.description} <br></br>
                </div>
              </div>
            </div>
        </div>
    ))}
    </div>
    </div>
  </div>

);


};






export default StoreDetail_idx;