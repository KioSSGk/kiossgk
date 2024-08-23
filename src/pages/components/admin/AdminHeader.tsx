import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useRouter } from "next/router";
import useAuth from '@/lib/useAuth';

const AdminHeader = () => {

    const { user } = useAuth();
    const router = useRouter();
    const [adminName, setAdminName] = useState("");

    useEffect(()=>{
            const fetchAdminName = async () => {
                try {
                    const storeId = user?.id;
                    const response = await axios.get('/api/admin_header_api/getHeaderInfo', {
                        params: { storeId },
                    });
                    if (response.data && response.data.length > 0) {
                        setAdminName(response.data[0].admin_name);
                    }
                } catch (error) {
                    console.error('관리자 이름을 불러오는데 실패하였습니다:', error);
                }
            };
            if (user?.id) {
      fetchAdminName();
    }
  }, [user]);

    const handleAdminIconClick = () => {
    const url = `/admin/${(user as any)?.id }/main`;
    router.push(url);
    };

    const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
    };

    return(
            <div className="flex justify-center items-center bg-slate-200 w-full h-[60px] border-b-[1px] border-gray-300">
                    <div className="flex items-center justify-between w-[1280px]">
                            <div className="flex items-center">
                                <button className="bg-black w-[40px] h-[40px] mr-5" onClick={handleAdminIconClick}>
                                    {/* 아이콘이미지 */}
                                </button>
                                <button onClick={handleAdminIconClick}>
                                    Universal Kiossgk
                                </button>
                            </div>
                            <div className="flex items-center ">
                                <div className="mr-5">
                                    {adminName}
                                </div>
                                <button onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                    </div>
            </div>
    )

}

export default AdminHeader;