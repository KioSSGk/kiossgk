import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import StoreSelect from './components/user_main/StoreSelect';
import UserHeader from './components/UserHeader';
import UserFooter from './components/UserFooter';

const UserMain = () => {
    const [stores, setStores] = useState([]);
    const router = useRouter();
    const { workplaceNumber } = router.query; // URL 쿼리 파라미터에서 workplaceNumber 가져옴

    useEffect(() => {
        const fetchStoreData = async () => {
            if (workplaceNumber) {
                try {
                    const response = await axios.get('/api/user_main_api/StoreInfo', {
                        params: { workplaceNumber }
                    });
                    console.log('Fetched stores:', response.data);
                    setStores(response.data);
                } catch (error) {
                    console.error("Error fetching the store data:", error);
                }
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
