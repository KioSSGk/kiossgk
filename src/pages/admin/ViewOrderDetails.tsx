import React from 'react';
import ViewOrderDetailsPage from '../components/admin/ViewOrderDetailsPage';
import HeaderIcon from '../components/admin/HeaderIcon';


const ViewOrderDetails: React.FC = () => {
    return (
        <div className='h-full min-h-dvh bg-gray-200 '>
            <HeaderIcon/>
            <ViewOrderDetailsPage/>
        </div>
    )
};

export default ViewOrderDetails;