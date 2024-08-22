import React from 'react';
import CartPage from '../components/user/CartPage';
import UserHeader from '../components/UserHeader';

const userMain = () => {
    return (
        <div className='min-h-dvh h-full bg-slate-100'>
            <div className=''>
            <UserHeader/>
            </div>
            <CartPage/>
        </div>
    );
};

export default userMain;