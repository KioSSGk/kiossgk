import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ViewOrderDetailsPage: React.FC = () => {
    const [orderData, setOrderData] = useState<any[]>([]);
    const [orderAcceptData, setOrderAcceptData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [storeId, setStoreId] = useState<string | null>(null); 
    const { adminId } = router.query;
    const [isOrderAccepted, setIsOrderAccepted] = useState<{ [key: number]: boolean }>({});

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/admin_view_order_details_api/order', {
                params: { storeId: storeId }
            });
            setOrderData(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching view orders:', error);
            setError('주문 목록을 불러오는데 실패했습니다.');
        }
    };
    
    const fetchOrdersAccept = async () => {
        try {
            const response = await axios.get('/api/admin_view_order_details_api/orderAccept', {
                params: { storeId: storeId }
            });
            setOrderAcceptData(response.data);
            setError(null);
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

        useEffect(() => {
        if (storeId) {
            fetchOrdersAccept();
        }
    }, [storeId]);


    const handleOrderAccept = async (orderId: number) => {
        setIsOrderAccepted(prevState => ({
            ...prevState,
            [orderId]: true,
        }));

        try {
            await axios.post(`/api/notice/send_order_notification`, {
                orderId: orderId,
                action: 'accept'
            });
            console.log('주문 접수 SMS 발송 성공');
        } catch (error) {
            console.error('주문 접수 SMS 발송 실패:', error);
        }
    };

    const handleCookingAccept = async (orderId: number) => {
        try {
            await axios.put('/api/admin_view_order_details_api/order', {
                orderId: orderId,
                orderState: '03'
            });
            fetchOrders();
            await axios.post(`/api/notice/send_order_notification`, {
                orderId: orderId,
                action: 'complete'
            });
            console.log('조리 완료 SMS 발송 성공');
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

        const handleCookingCompelte = async (orderId: number) => {
        try {
            await axios.put('/api/admin_view_order_details_api/orderAccept', {
                orderId: orderId,
                orderState: '05'
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
                                    {order.menu_name}&nbsp;x {order.count}
                                </div>
                                <div>
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                                            onClick={() => handleCookingAccept(order.order_idx)}
                                        >
                                            주문 접수
                                        </button>
                                        <button
                                                className="bg-red-500 text-white py-2 px-4 rounded mx-2 hover:bg-red-600 transition duration-200"
                                                onClick={() => handleCookingCancel(order.order_idx)}
                                            >
                                                주문취소
                                            </button>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div>
                        {orderAcceptData.map((order, index) => (
                            <div key={index} className="bg-white shadow-md rounded-md p-4 mb-4 min-w-[1280px] flex items-center justify-between">
                                <div>
                                    주문번호: {order.order_idx}
                                </div>
                                <div>
                                    주문시간: {order.created}
                                </div>
                                <div className="font-bold">
                                    {order.menu_name}&nbsp;x {order.count}
                                </div>
                                <div>
                                        <>
                                            <button
                                                className="bg-indigo-500 text-white py-2 px-4 rounded mx-2 hover:bg-indigo-600 transition duration-200"
                                                onClick={() => handleCookingCompelte(order.order_idx)}
                                            >
                                                조리완료
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-2 px-4 rounded mx-2 hover:bg-red-600 transition duration-200"
                                                onClick={() => handleCookingCancel(order.order_idx)}
                                            >
                                                주문취소
                                            </button>
                                        </>
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
