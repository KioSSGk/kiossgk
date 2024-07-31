import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Store {
  id: number;
  name: string;
  hours: string;
  description: string;
  image: string;
}

export default function StoreSelect() {
  
  const [stores, setStores] = useState<Store[]>([]);
  const router = useRouter();
  // API에서 데이터를 가져오는 함수
  const fetchStoreData = async () => {
    try {
      const response = await axios.get('/api/user_main_api/StoreInfo'); // GET 요청을 통해 API 호출
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching the store data:", error);
    }
  };

  const handleStoreClick = (id: number) => {
    // 클릭 후 페이지 이동
    router.push(`/storedetail?id=${id}`);
};

  // 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    fetchStoreData();
  }, []);

  return (
    
        <div className='flex justify-center h-dvh mt-24 min-w-80'>
          <div className='mx-4 mb-4 justify-center max-w-sm w-full'>
            {stores.length > 0 ? (
              stores.map((store) => (
                <div className='rounded-xl shadow-xl my-3 bg-white mx-2' key={store.id} onClick={() => handleStoreClick(store.id)} style={{ cursor: 'pointer' }}>
                  <div className='flex justify-start p-4  '>
                    <div className='rounded-lg w-16 h-16' >
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
            <div className='flex justify-start py-3 my-3 text-white font-bold'>
              
            </div>
          </div>
        </div>
    
  );
}
