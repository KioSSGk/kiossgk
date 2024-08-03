// src/components/user_main/StoreSelect.tsx
import React from 'react';
import Image from 'next/image';

interface Store {
    store_idx: number;
    store_name: string;
    store_category: string;
    store_img_path: string;
}

interface StoreSelectProps {
    stores: Store[];
}

// 가게 목록을 보여주는 컴포넌트
const StoreSelect: React.FC<StoreSelectProps> = ({ stores }) => {
    const handleStoreClick = (id: number) => {
        // 가게 클릭 시 상세 페이지로 이동
        window.location.href = `/storedetail?id=${id}`;
    };

    return (
        <div className='flex justify-center h-dvh mt-24 min-w-80'>
            <div className='mx-4 mb-4 justify-center max-w-sm w-full'>
                {stores?.length > 0 ? (
                    stores.map((store) => (
                        <div className='rounded-xl shadow-xl my-3 bg-white mx-2' key={store.store_idx} onClick={() => handleStoreClick(store.store_idx)} style={{ cursor: 'pointer' }}>
                            <div className='flex justify-start p-4'>
                                <div className='rounded-lg w-16 h-16'>
                                    <Image className='rounded-lg' src={store.store_img_path} alt={store.store_name} width={64} height={64} />
                                </div>
                                <div className='flex items-center w-64 px-3 truncate h-16'>
                                    <div>
                                        <h3 className='mb-4'>{store.store_name}</h3>
                                        <p>설명: {store.store_category}</p>
                                    </div>
                                </div>
                            </div>
                            <p className='px-4 pb-4'>{store.store_category}</p>
                        </div>
                    ))
                ) : (
                    <p>가게 정보를 불러오는 중...</p>
                )}
            </div>
        </div>
    );
};

export default StoreSelect;
