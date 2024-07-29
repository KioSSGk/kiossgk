import React, { useState,useEffect } from 'react';
import axios from 'axios';
import StoreSelect from '../user_main/StoreSelect';

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

  // 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    fetchMenuDetailData();
  }, []);


    return(
        <div>
            
           
            
            <StoreSelect></StoreSelect>
            <hr></hr>
            <span>메뉴 옵션</span>
            {menuItems.map((data) => (
                <div>
                    <img src = {data.image} alt='상품이미지'></img>
                   
                   <span>메뉴 이름:</span>{data.name} <br></br>
                   <span>메뉴 가격:</span> {data.price} <br></br>
                   <span>메뉴 설명:</span> {data.description} <br></br>
                   <hr></hr>
                   <br></br>
                    <div>상품 옵션 선택</div>
                    <hr></hr>
                    <select name="옵션" >
                        <option value="곱빼기">곱빼기</option>
                        <option value="밥추가">밥추가</option>
                        <option value="양파빼기">양파빼기</option>
                    </select>
                </div>
            ))}
            <br></br>
            <hr></hr>
            <button>구매하기</button>
            <button>장바구니</button>
            

        </div>
    );
}

export default MenuDetail_idx;