import React from 'react';
import PaymentHistoryPage from '../components/admin/PaymentHistoryPage';
import HeaderIcon from '../components/admin/HeaderIcon';

const PaymentHistory: React.FC = () => {
    return (
        <div className='min-h-dvh h-full bg-gray-200 '>
            <HeaderIcon/>
            <PaymentHistoryPage />;
        </div>

    )
};

export default PaymentHistory;
