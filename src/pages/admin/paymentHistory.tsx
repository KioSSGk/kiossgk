import React from 'react';
import PaymentHistoryPage from '../components/admin/PaymentHistoryPage';
import HeaderIcon from '../components/admin/HeaderIcon';
import AdminHeader from '../components/admin/AdminHeader';

const PaymentHistory: React.FC = () => {
    return (
        <div className='min-h-dvh h-full bg-slate-200'>
            <AdminHeader/>
            <HeaderIcon/>
            <PaymentHistoryPage />;
        </div>

    )
};

export default PaymentHistory;
