import React from 'react';
import AdminMainPage from '../../components/admin/MainPage';
import HeaderIcon from '../../components/admin/HeaderIcon';
import AdminHeader from '@/pages/components/admin/AdminHeader';

const AdminMain: React.FC = () => {
        return(
        <div className='min-h-dvh h-full bg-slate-200 '>
            <AdminHeader/>
            <HeaderIcon/>
            <AdminMainPage />;
        </div>
        );
    }

export default AdminMain;
