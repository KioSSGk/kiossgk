import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import useAuth from '@/lib/useAuth';

const ViewOrderDetailsPage: React.FC = () => {
    const [orderData, setOrderData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [storeId, setStoreId] = useState<string | null>(null); 
    const { adminId } = router.query;

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/admin_view_order_details_api/order', {
                params: { storeId: storeId }
            });
            console.log('API 응답:', response.data);
            setOrderData(response.data);
            setError(null);
            console.log(orderData)
        } catch (error) {
            console.error('Error fetching view orders:', error);
            setError('주문 목록을 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        if (adminId) {
            setStoreId(adminId as string);  // adminId를 storeId로 설정
        }
    }, [adminId]);

    useEffect(() => {
        if (storeId) {
            fetchOrders();
        }
    }, [storeId]);

    const handleCookingComplete = async (orderId: number) => {
        try {
            await axios.put('/api/admin_view_order_details_api/order', {
                orderId: orderId,
                orderState: '05'
            });
            fetchOrders();
        } catch (error) {
            console.error('조리완료 업데이트 에러가 발생했습니다', error);
        }
    }

        const handleCookingCancel = async (orderId: number) => {
        try {
            await axios.put('/api/admin_view_order_details_api/order', {
                orderId: orderId,
                orderState: '04'
            });
            fetchOrders();
        } catch (error) {
            console.error('조리완료 업데이트 에러가 발생했습니다', error);
        }
    }

    return (
        <div className='flex justify-center'>
            <div>
                <div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div>
                            {orderData.map((order, index) => (
                                <div key={index} className=''>
                                    <div className='flex items-center justify-between rounded-md shadow-md bg-white p-4 mb-4 min-w-[1280px]'>
                                        <div className=''>
                                            주문번호 : 
                                            {order.order_idx}
                                        </div>
                                        <div>
                                            주문시간 :
                                            {order.created}
                                        </div>
                                        <div className='font-bold'>
                                            {order.menu_name}&nbsp;
                                            x {order.count}
                                        </div>
                                        <div>
                                            <button
                                                className='bg-indigo-500 text-white font-bold rounded-md mx-2 p-2'
                                                
                                                onClick={()=>handleCookingComplete(order.order_idx)}
                                                >
                                                조리완료
                                            </button>
                                            <button 
                                                className='bg-indigo-500 text-white font-bold rounded-md mx-2 p-2'
                                                onClick={()=>handleCookingCancel(order.order_idx)}
                                                >
                                                주문취소
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewOrderDetailsPage;
