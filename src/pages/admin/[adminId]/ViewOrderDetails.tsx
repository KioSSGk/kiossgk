import React from 'react';
import HeaderIcon from '../../components/admin/HeaderIcon';
import AdminHeader from '../../components/admin/AdminHeader';
import ViewOrderDetailsPage from '@/pages/components/admin/ViewOrderDetailsPage';


const ViewOrderDetails: React.FC = () => {
    return (
        <div className='h-full min-h-dvh bg-slate-200'>
            <AdminHeader/>
            <HeaderIcon/>
            <ViewOrderDetailsPage/>
        </div>
    )
};

export default ViewOrderDetails;