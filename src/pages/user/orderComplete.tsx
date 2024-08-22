import React from 'react';
import OrderCompletePage from '../components/user/OrderCompletePage';
import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';

const OrderComplete: React.FC = () => {
    return (
    
    <div className='min-h-dvh h-full bg-slate-100'>
        <div className='flex justify-center'>
        <UserHeader/>
        </div>
        <div className='pt-28'>
            <OrderCompletePage />
        </div>
        <UserFooter/>
    </div>
    )
};

export default OrderComplete;
 