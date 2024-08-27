import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface MenuDetail {
    menu_idx: number;
    store_idx: number;
    menu_name: string;
    menu_price: number;
    menu_detail: string;
    menu_category: string;
    menu_status: string;
    menu_image_path: string;
}

interface StoreDetailProps {
    selectedCategory: string;
}


const StoreDetail_idx: React.FC<StoreDetailProps> = ({ selectedCategory }) =>  {
    const router = useRouter();
    const { storeId } = router.query; // URL에서 storeId를 가져옴
    const [menuItems, setMenuItems] = useState<MenuDetail[]>([]);

    useEffect(() => {
        const fetchMenuDetailData = async () => {
            try {
                const response = await axios.get(`/api/user_store_detail_api/storedetails?storeId=${storeId}`,{ params: {selectedCategory}});
                setMenuItems(response.data);
                console.log(menuItems);
            } catch (error) {
                console.error("Error fetching the store data:", error);
            }
        };

        if (storeId) {
            fetchMenuDetailData();
        }
    }, [storeId,selectedCategory]);

    // 메뉴 클릭 시 메뉴 상세 페이지로 이동하는 함수
    const handleMenuClick = (menuId: number) => {
        router.push(`/user/menu/${menuId}`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
      };

    return (
        <div className="min-h-dvh h-full bg-slate-100">
            <div className='flex justify-center min-h-screen pt-24'>
                <div className='max-w-sm w-full mb-20'>
                    {/* <div className='flex overflow-x-auto whitespace-nowrap'>
                        {menuItems.map((data) => (
                            <button className='px-3 mx-2 my-1 border-2 border-white rounded-lg text-white font-bold drop-shadow-lg' key={data.menu_idx}>
                                {data.menu_category}
                            </button>
                        ))}
                    </div> */}
                    {/* 자체적으로 만들어져있던 카테고리는 삭제했습니다. */}
                    {menuItems.map((data) => (
                        <div onClick={()=>handleMenuClick(data.menu_idx)}>
                            <div className="flex items-center max-w-md overflow-hidden mb-4 mx-2 bg-teal-50 rounded-lg shadow-lg dark:bg-gray-800">
                                <div className="w-1/3 bg-cover overflow-hidden">
                                    <img src={data.menu_image_path} alt={data.menu_name} style={{ width: '100%', height: '128px', objectFit: 'cover' }} className='h-full' />
                                </div>

                                <div className="w-2/3 p-4 md:p-4">
                                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">{data.menu_name}</h1>

                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 h-5 overflow-hidden">{data.menu_detail}</p>

                                    <div className="flex justify-between mt-3 item-center">
                                        <h1 className="text-lg font-bold text-gray-700 dark:text-gray-200 md:text-xl">{formatPrice(data.menu_price)}원</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoreDetail_idx;
