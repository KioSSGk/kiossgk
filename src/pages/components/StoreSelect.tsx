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
    <div>
      <div>
        <h2>가게 선택창</h2>
      </div>
      {stores.length > 0 ? (
        stores.map((store) => (
          <div key={store.id} onClick={() => handleStoreClick(store.id)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#eee' }}>
                <img src={store.image} alt={store.name} style={{ width: '50px', height: '50px' }} />
              </div>
              <div>
                <h3>{store.name}</h3>
                <p>운영시간: {store.hours}</p>
              </div>
            </div>
            <p>{store.description}</p>
          </div>
        ))
      ) : (
        <p>가게 정보를 불러오는 중...</p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-around', position: 'fixed', bottom: '0', width: '100%', backgroundColor: 'white' }}>
        <div>홈</div>
        <div>즐겨찾기</div>
        <div>장바구니</div>
      </div>
    </div>
  );
}
