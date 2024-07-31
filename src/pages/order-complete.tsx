import React from 'react';
import OrderCompletePage from './components/user_order_complete/OrderCompletePage';
import UserHeader from './components/UserHeader';

const OrderComplete: React.FC = () => {
    return (
    
    <div className='h-auto bg-orange-400'>
        <div className='flex justify-center'>
        <UserHeader/>
        </div>
        <div className='pt-24'>
            <OrderCompletePage />
        </div>
    </div>
    )
};

export default OrderComplete;
 