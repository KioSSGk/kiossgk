import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoreSelect from '../components/user/StoreSelect';
import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';

interface Store {
  store_idx: number;
  store_name: string;
  store_category: string;
  store_img_path: string;
}

const UserMain: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const workplaceNumber = '1'; // 동적으로 변경할 수 있는 부분

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get<Store[]>('/api/user_main_api/StoreInfo', {
          params: { workplaceNumber },
        });
        console.log('가져온 가게 데이터:', response.data); // 콘솔 로그 추가
        setStores(response.data);
      } catch (error) {
        console.error('가게 데이터를 가져오는 중 오류가 발생했습니다.', error);
      }
    };

    fetchStoreData();
  }, [workplaceNumber]);

  return (
    <div className='h-auto bg-orange-400'>
      <div className='flex justify-center'>
        <UserHeader />
      </div>
      <StoreSelect stores={stores} />
      <UserFooter />
    </div>
  );
};

export default UserMain;
