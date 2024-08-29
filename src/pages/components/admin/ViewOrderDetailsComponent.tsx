import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ViewOrderDetailsComponent: React.FC = () => {
    const [orderData, setOrderData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { adminId } = router.query;
    const [isOrderAccepted, setIsOrderAccepted] = useState<{ [key: number]: boolean }>({});

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/admin_view_order_details_api/order', {
                params: { storeId: adminId }
            });
            const data = response.data;
            setOrderData(data);

            // 주문 상태를 초기화
            const acceptedOrders = data.reduce((acc: { [key: number]: boolean }, order: any) => {
                acc[order.order_idx] = order.order_state === '03'; // 상태가 '03'이면 접수된 상태로 설정
                return acc;
            }, {});
            setIsOrderAccepted(acceptedOrders);

            setError(null);
        } catch (error) {
            console.error('Error fetching view orders:', error);
            setError('주문 목록을 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        if (adminId) {
            fetchOrders();
        }
    }, [adminId]);

    const handleOrderAccept = async (orderId: number) => {
        try {
            await axios.put('/api/admin_view_order_details_api/order', {
                orderId: orderId,
                orderState: '03'
            });
            setIsOrderAccepted(prevState => ({
                ...prevState,
                [orderId]: true,  // 주문 접수 시 상태 변경
            }));
            await axios.post('/api/notice/send_order_notification', {
                orderId: orderId,
                action: 'accept'
            });
            fetchOrders();
        } catch (error) {
            console.error('주문 접수 업데이트 에러가 발생했습니다', error);
        }
    };

    const handleCookingComplete = async (orderId: number) => {
        try {
            await axios.put('/api/admin_view_order_details_api/order', {
                orderId: orderId,
                orderState: '04'
            });
            await axios.post('/api/notice/send_order_notification', {
                orderId: orderId,
                action: 'complete'
            });
            fetchOrders();
        } catch (error) {
            console.error('조리완료 업데이트 에러가 발생했습니다', error);
        }
    };

    const handleOrderCancel = async (orderId: number) => {
        try {
            await axios.put('/api/admin_view_order_details_api/order', {
                orderId: orderId,
                orderState: '05'
            });
            fetchOrders();
        } catch (error) {
            console.error('주문 취소 중 오류가 발생했습니다', error);
        }
    };

    return (
        <div className='flex justify-center'>
            <div>
                <div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div>
                        {orderData.map((order, index) => (
                            <div key={index} className='justify-between bg-white px-4 mb-2 min-w-[488px]'>
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
                                        {!isOrderAccepted[order.order_idx] ? (
                                            <>
                                                <button
                                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                                                    onClick={() => handleOrderAccept(order.order_idx)}
                                                >
                                                    주문 접수
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white py-2 px-4 rounded mx-2 hover:bg-red-600 transition duration-200"
                                                    onClick={() => handleOrderCancel(order.order_idx)}
                                                >
                                                    주문 취소
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-200"
                                                    onClick={() => handleCookingComplete(order.order_idx)}
                                                >
                                                    조리완료
                                                </button>
                                            </>
                                        )}
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
