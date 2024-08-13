import React from 'react';
import UserHeader from '@/pages/components/UserHeader';
import StoreDetail_idx from '@/pages/components/user/StoreDetailIdx';
import UserFooter from '@/pages/components/UserFooter';
import { useRouter } from 'next/router';

const StoreDetail = () => {
    const router = useRouter();
    const { storeId } = router.query; // URL에서 storeId를 가져옵니다.

    const numericStoreId = parseInt(storeId as string, 10); // storeId를 숫자로 변환합니다.

    if (isNaN(numericStoreId)) {
        console.error('Invalid store ID');
        return <div>잘못된 스토어 ID입니다.</div>;
    }

    return (
        <div>
            <UserHeader storeId={numericStoreId} />
            <StoreDetail_idx />
            <UserFooter />
        </div>
    );
};

export default StoreDetail;
