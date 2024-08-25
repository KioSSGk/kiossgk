import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Category {
    index: number;
    item: string;
}

interface UserHeaderProps {
    onCategoryChange?: (category: string) => void;
    storeId?: number; // 선택적 storeId prop
}

export default function UserHeader({ storeId, onCategoryChange }: UserHeaderProps) {
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
            } else if (router.pathname.includes('/user/cart') || router.pathname.includes('/user/menu')) {
                apiUrl = ''; // '/user/cart'나 '/user/menu' 경로에서는 API 호출을 하지 않음
            }

            if (apiUrl === '') {
                // 카테고리를 비우고 뒤로가기 버튼을 표시하기 위해 setCategories를 빈 배열로 설정
                setCategories([]);
            } else {
                const response = await axios.get(apiUrl, {
                    params: storeId ? { storeId } : {} // storeId가 있을 경우에만 포함
                });
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Error fetching the Header data:", error);
        }
    };

    useEffect(() => {
        fetchHeaderData();
    }, [router.pathname, storeId]); // URL 경로 및 storeId가 변경될 때마다 실행

    const isUserIndexPage = router.pathname.endsWith('/user'); // 유저 인덱스 페이지 여부 확인

    return (
        <div className='flex justify-center w-full fixed bg-teal-300 top-0 z-50 drop-shadow'>
            <div className='items-center max-w-sm w-full mx-4 pt-2'>
                <div className='flex justify-between px-2'>
                    <button
                        className='h-8 w-8 items-center'
                        onClick={() => router.back()}
                    >
                        {/* 왼쪽 화살표 아이콘 (SVG) */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className={`w-6 h-6 ${isUserIndexPage ? 'text-teal-300' : 'text-white'}`} // 유저 인덱스 페이지에서는 teal-300 색상, 그렇지 않으면 white 색상
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className='flex justify-end items-center h-8 w-48'>
                        <button className='drop-shadow-md text-white font-bold m-2' >검색</button>
                        <input
                            className='drop-shadow-md h-7 max-w-32 min-w-24 bg-white rounded-xl'
                            type='text'
                        />
                    </div>
                </div>
                <div className='flex justify-start max-w-sm w-full'>
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
                            <div style={{ height: '32px' }}></div> // 공백으로 표시
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
