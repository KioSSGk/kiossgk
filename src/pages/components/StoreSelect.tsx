import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Store {
  id: number;
  name: string;
  hours: string;
  description: string;
  image: string;
}

export default function StoreSelect() {
  const [stores, setStores] = useState<Store[]>([]);

  // API에서 데이터를 가져오는 함수
  const fetchStoreData = async () => {
    try {
      const response = await axios.get('/api/StoreInfo'); // GET 요청을 통해 API 호출
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching the store data:", error);
    }
  };

  // 가게를 클릭했을 때 호출되는 함수
  const handleStoreClick = async (id: number) => {
    try {
      await axios.post('/api/storeClick', { id }); // API 엔드포인트를 '/api/storeClick'으로 변경
    } catch (error) {
      console.error("Error logging the store click:", error);
    }
  };

  // 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    fetchStoreData();
  }, []);

  return (
    <div className='max-w-sm bg-orange-400 h-auto'>
      <div className='m-4'>
        <div>
          <h2 className='text-white font-bold'>가게 선택창</h2>
        </div>
        {stores.length > 0 ? (
          stores.map((store) => (
            <div className='rounded-xl shadow-xl my-3 bg-white' key={store.id} onClick={() => handleStoreClick(store.id)} style={{ cursor: 'pointer' }}>
              <div className='flex justify-center p-4 '>
                <div className='rounded-lg bg-gray-500 w-16 h-16' >
                  <img className='rounded-lg w-16 h-16' src={store.image} alt={store.name} />
                </div>
                <div className='flex items-center w-64 px-3 truncate h-16'>
                  <div>
                    <h3 className='mb-4'>{store.name}</h3>
                    <p className=''>운영시간: {store.hours}</p>
                  </div>
                </div>
              </div>
                  <p className='px-4 pb-4'>{store.description}</p>
            </div>
          ))
        ) : (
          <p>가게 정보를 불러오는 중...</p>
        )}
        <div className='flex justify-start py-3 my-3 text-white font-bold' style={{}}>
          <div className='p-2'>홈</div>
          <div className='p-2'>즐겨찾기</div>
          <div className='p-2'>장바구니</div>
        </div>
      </div>
    </div>
  );
}
