import React from 'react';
import CartPage from './components/user_cart/CartPage';
import UserHeader from './components/UserHeader';

const userMain = () => {
    return (
        <div className='h-auto bg-orange-400'>
            <div className=''>
            <UserHeader/>
            </div>
            <CartPage/>
        </div>
    );
};

export default userMain;