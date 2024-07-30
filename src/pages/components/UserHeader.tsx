import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Category {
    index: number;
    item: string;
}

export default function UserHeader() {

    const [categories, setCategories] = useState<Category[]>([]);

    // API에서 데이터를 가져오는 함수
  const fetchHeaderData = async () => {
    try {
      const response = await axios.get('/api/StoreCategory'); // GET 요청을 통해 API 호출
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching the Header data:", error);
    }
  }; 

  useEffect(() => {
    fetchHeaderData();
  }, []);

  return (
    <div className='itmes-center min-w-80 mx-4 pt-2 fixed top-0 bg-orange-400'>
      <div className='flex justify-between'>
        <button className='h-8 w-8 bg-gray-400 items-center'>
          
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
                        <div className=''>
                            <button className='px-1 m-2 text-white font-bold drop-shadow-md' key={category.index}>
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
          <hr className='max-w-sm w-full'/>
        </div>
    </div>
  )

}