import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ViewOrderDetailsPage: React.FC = () => {
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
            console.log('Fetched Orders:', data);
            setOrderData(data);

            const acceptedOrders = data.reduce((acc: { [key: number]: boolean }, order: any) => {
                acc[order.order_idx] = order.order_state === '03';
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
                [orderId]: true,
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
                {error && <p className="text-red-500">{error}</p>}
                <div>
                    {orderData.map((order, index) => (
                        <div key={index} className="bg-white shadow-md rounded-md p-4 mb-4 min-w-[1280px] flex items-center justify-between">
                            <div>
                                주문번호: {order.order_idx}
                            </div>
                            <div>
                                주문시간: {order.created}
                            </div>
                            <div className="font-bold">
                                {order.menu_details}
                            </div>
                            <div>
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
                                    <button
                                        className="bg-indigo-500 text-white py-2 px-4 rounded mx-2 hover:bg-indigo-600 transition duration-200"
                                        onClick={() => handleCookingComplete(order.order_idx)}
                                    >
                                        조리완료
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewOrderDetailsPage;
