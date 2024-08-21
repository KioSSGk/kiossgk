// src/components/user_main/StoreSelect.tsx
import { useRouter } from 'next/router';
// import Image from 'next/image';


interface Store {
    store_idx: number;
    store_name: string;
    store_category: string;
    store_img_path: string;
    store_content: string;
}

interface StoreSelectProps {
    stores: Store[];
}

// 가게 목록을 보여주는 컴포넌트
const StoreSelect: React.FC<StoreSelectProps> = ({ stores }) => {
    const router = useRouter();
    const handleStoreClick = (id: number) => {
        // 가게 클릭 시 상세 페이지로 이동
        const url: string = `/user/storedetail/${id}`;
        router.push(url);
       // window.location.href = `/storedetail?id=${id}`;
    };

    return (
        <div className='flex justify-center h-dvh mt-24 min-w-80'>
            <div className='mx-4 mb-4 justify-center max-w-sm w-full'>
                {stores?.length > 0 ? (
                    stores.map((store) => (
                        <div>
                            <div className="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-4"
                                key={store.store_idx} 
                                onClick={() => handleStoreClick(store.store_idx)} 
                                style={{ cursor: 'pointer' }}
                                >
                                <div 
                                className="w-1/3 bg-cover " 
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80')" }}
                                >

                                </div>
                                    <div className="w-2/3 p-4 md:p-4">
                                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">{store.store_name}</h1>

                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{store.store_category}</p>

                                    <div className="flex mt-2 item-center">
                                        <svg className="w-5 h-5 text-gray-700 fill-current dark:text-gray-300" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                        </svg>

                                        <svg className="w-5 h-5 text-gray-700 fill-current dark:text-gray-300" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                        </svg>

                                        <svg className="w-5 h-5 text-gray-700 fill-current dark:text-gray-300" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                        </svg>

                                        <svg className="w-5 h-5 text-gray-500 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                        </svg>

                                        <svg className="w-5 h-5 text-gray-500 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                        </svg>
                                    </div>

                                    <div className="flex justify-between mt-3 item-center">
                                        <h1 className="text-lg font-bold text-gray-700 dark:text-gray-200 md:text-xl">{store.store_content}</h1>
                                        </div>
                                    </div>
                            </div>
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
