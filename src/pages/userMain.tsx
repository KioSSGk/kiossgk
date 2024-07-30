import React from 'react';

import StoreSelect from './components/user_main/StoreSelect';
import UserHeader from './components/UserHeader';

const userMain = () => {
    return (
        <div className='h-auto bg-orange-400'>
            <div className='flex justify-center'>
                <UserHeader></UserHeader>
            </div>
                <StoreSelect></StoreSelect>
        </div>
    );
};

export default userMain;