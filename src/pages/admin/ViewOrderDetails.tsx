import React from 'react';
import ViewOrderDetailsPage from '../components/admin/ViewOrderDetailsPage';
import HeaderIcon from '../components/admin/HeaderIcon';
import AdminHeader from '../components/admin/AdminHeader';


const ViewOrderDetails: React.FC = () => {
    return (
        <div className='h-full min-h-dvh bg-gray-200 '>
            <AdminHeader/>
            <HeaderIcon/>
            <ViewOrderDetailsPage/>
        </div>
    )
};

export default ViewOrderDetails;