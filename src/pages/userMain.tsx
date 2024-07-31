import React from 'react';

import StoreSelect from './components/user_main/StoreSelect';
import UserHeader from './components/UserHeader';
import UserFooter from './components/UserFooter';

const userMain = () => {
    return (
        <div className='h-auto bg-orange-400'>
            <div className='flex justify-center'>
                <UserHeader/>
            </div>
                <StoreSelect/>
                <UserFooter/>
        </div>
    );
};

export default userMain;