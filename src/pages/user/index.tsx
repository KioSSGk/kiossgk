// src/pages/index.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoreSelect from '../components/user/StoreSelect';
import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';

const UserMain = () => {
    const [stores, setStores] = useState([]);
    const [workplaceNumber, setWorkplaceNumber] = useState(1); // 기본적으로 첫 번째 사업장을 선택

    // 사업장 가게 데이터를 가져오는 함수
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await axios.get('/api/user_main_api/StoreInfo', {
                    params: { workplaceNumber }
                });
                setStores(response.data);
            } catch (error) {
                console.error("가게 데이터를 가져오는 중 오류가 발생했습니다.", error);
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
