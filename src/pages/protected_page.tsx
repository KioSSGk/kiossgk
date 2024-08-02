// src/pages/protected_page.tsx
import React, { useEffect } from 'react';
import useAuth from '@/lib/useAuth'; // 혹은 '@/hooks/useAuth'로 변경
import { useRouter } from 'next/router';

const ProtectedPage = () => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return <div>이것은 보호된 페이지입니다. {user}</div>;
};

export default ProtectedPage;
