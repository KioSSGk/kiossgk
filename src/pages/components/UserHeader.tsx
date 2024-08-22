import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Category {
    index: number;
    item: string;
}

interface UserHeaderProps {
  onCategoryChange ?: (category: string) => void;
  storeId?: number; // 선택적 storeId prop
}

export default function UserHeader({ storeId, onCategoryChange  }: UserHeaderProps,) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);

    // API에서 데이터를 가져오는 함수
    const fetchHeaderData = async () => {
        try {
            let apiUrl = `/api/StoreCategory`; // 기본 API URL

            // 현재 경로에 따라 다른 API를 호출
            if (router.pathname.endsWith('/user')) {
                apiUrl = `/api/StoreCategory`;
            } else if (router.pathname.includes('/user/storedetail')) {
                apiUrl = `/api/MenuCategory`;
            }
            console.log("가게 아이디",storeId);
            const response = await axios.get(apiUrl, {
                params: storeId ? { storeId } : {} // storeId가 있을 경우에만 포함
            });
            console.log("헤더컨포넌트:",response);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching the Header data:", error);
        }
    };

    useEffect(() => {
        fetchHeaderData();
    }, [router.pathname, storeId]); // URL 경로 및 storeId가 변경될 때마다 실행

    return (
        <div className='flex justify-center w-full fixed bg-teal-300 top-0 z-50 drop-shadow'>
            <div className='items-center max-w-sm w-full mx-4 pt-2'>
                <div className='flex justify-between px-2'>
                    <button className='h-8 w-8 bg-gray-400 items-center'>
                        {/* 버튼 내용 */}
                    </button>
                    <div className='flex justify-end items-center h-8 w-48'>
                        <button className='drop-shadow-md text-white font-bold m-2'>검색</button>
                        <input
                            className='drop-shadow-md h-7 max-w-32 min-w-24 bg-white rounded-xl'
                            type='text'
                        />
                    </div>
                </div>
                <div className='flex justify-center max-w-sm w-full'>
                    <div className='flex overflow-x-auto overflow-hidden whitespace-nowrap'>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <div className='' key={category.index}>
                                    <button 
  className='px-1 m-2 text-white font-bold drop-shadow-md' 
  onClick={onCategoryChange ? () => onCategoryChange(category.item) : undefined}
>
                                        {category.item}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>가게 카테고리 불러오는 중...</p>
                        )}
                    </div>
                </div>
                <div className='pb-2 min-w-80'>
                    {/* <hr className='max-w-sm w-full' /> */}
                </div>
            </div>
        </div>
    );
}
