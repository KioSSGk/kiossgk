import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import useAuth from '@/lib/useAuth';

const ViewOrderDetailsComponent: React.FC = () => {
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
                                    <div className='justify-between bg-white px-4 mb-2 min-w-[488px]'>
                                        <div className='border-[1px] border-gray-200 rounded-md px-6 py-3'>
                                            <div className='flex justify-between py-2'>
                                                <div>
                                                    주문번호 : 
                                                </div>
                                                <div>
                                                    {order.order_idx}
                                                </div>
                                            </div>
                                            <div className='flex justify-between py-2'>
                                                <div>
                                                    주문시간 :
                                                </div>
                                                <div>
                                                    {order.created}
                                                </div>
                                            </div>
                                            <div className='font-bold flex justify-between pt-2 pb-8'>
                                                <div>
                                                    {order.menu_name}&nbsp;
                                                </div>
                                                <div>
                                                    x {order.count}
                                                </div>
                                            </div>
                                            <div className='flex justify-between py-2'>
                                                <button
                                                    className='bg-indigo-500 text-white font-bold rounded-md w-[180px] h-[36px]'
                                                    
                                                    onClick={()=>handleCookingComplete(order.order_idx)}
                                                    >
                                                    조리완료
                                                </button>
                                                <button 
                                                    className='bg-indigo-500 text-white font-bold rounded-md w-[180px] h-[36px]'
                                                    onClick={()=>handleCookingCancel(order.order_idx)}
                                                    >
                                                    주문취소
                                                </button>
                                            </div>
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

export default ViewOrderDetailsComponent;
