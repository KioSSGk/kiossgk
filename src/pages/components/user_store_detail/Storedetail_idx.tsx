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
    router.push("/menudetail");
  };

// 컴포넌트가 마운트될 때 데이터를 가져옴
useEffect(() => {
fetchMenuDetailData();
}, []);


return(
<div>




<hr></hr>
<span>메뉴 옵션</span><br></br>
{menuItems.map((data) => (
   
   
      <span>{data.category}&nbsp;</span>
     
   
  
))}
{menuItems.map((data) => (
   
    <div key={data.id} onClick={()=>handleMenuClick(data.id)} style={{ cursor: 'pointer' }}>
        <span><img src = {data.image} alt='상품이미지'></img></span>
       
        {data.name} <br></br>
        {data.price} <br></br>
       {data.description} <br></br>
       <br></br>
      
    </div>
   
))}
<br></br>
<hr></hr>

</div>
);
};






export default StoreDetail_idx;