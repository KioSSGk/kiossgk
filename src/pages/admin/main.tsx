import React from 'react';
import AdminMainPage from '../components/admin/MainPage';
import HeaderIcon from '../components/admin/HeaderIcon';

const AdminMain: React.FC = () => {
    return(
        <div className='min-h-dvh h-full bg-gray-200 '>
            <HeaderIcon/>
            <AdminMainPage />;
        </div>
    )
};

export default AdminMain;
