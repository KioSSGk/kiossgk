import { useRouter } from 'next/router';

interface Store {
    store_idx: number;
    store_name: string;
    store_category: string;
    store_img_path: string; // 이 값이 Base64로 저장된 이미지 데이터임
    store_content: string;
}

interface StoreSelectProps {
    stores: Store[];
}

const StoreSelect: React.FC<StoreSelectProps> = ({ stores }) => {
    const router = useRouter();

    const handleStoreClick = (id: number) => {
        localStorage.setItem('lastStoreId', id.toString());
        router.push(`/user/storedetail/${id}`);
    };

    return (
        <div className='flex justify-center min-h-dvh h-full pb-16 mt-24 min-w-80'>
            <div className='mx-4 mb-4 justify-center max-w-sm w-full'>
                {stores?.length > 0 ? (
                    stores.map((store) => (
                        <div 
                            key={store.store_idx} 
                            className="flex max-w-md overflow-hidden bg-teal-50 border-slate-200 rounded-lg border-2 drop-shadow-sm dark:bg-gray-800 mb-4" 
                            onClick={() => handleStoreClick(store.store_idx)} 
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="w-1/3 bg-cover">
                                <div style={{ position: 'relative', width: '128px', height: '156px' }}>
                                    {/* Base64 이미지 데이터를 보여주는 부분 */}
                                    <img 
                                        src={`data:image/jpeg;base64,${store.store_img_path}`} 
                                        alt={store.store_name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                            <div className="w-2/3 p-4 md:p-4 items-center">
                                <h1 className="text-xl font-bold text-gray-800 dark:text-white">{store.store_name}</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{store.store_category}</p>
                                <div className="flex justify-between mt-3 item-center h-14 overflow-hidden">
                                    <h1 className="text-lg font-bold text-gray-700 dark:text-gray-200">{store.store_content}</h1>
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
