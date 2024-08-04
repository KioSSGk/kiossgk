import React from 'react';
import OrderCompletePage from '../components/user/OrderCompletePage';
import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';

const OrderComplete: React.FC = () => {
    return (
    
    <div className='h-auto bg-orange-400'>
        <div className='flex justify-center'>
        <UserHeader/>
        </div>
        <div className='pt-24'>
            <OrderCompletePage />
        </div>
        <UserFooter/>
    </div>
    )
};

export default OrderComplete;
 