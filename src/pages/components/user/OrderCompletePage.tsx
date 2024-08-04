import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderCompletePage: React.FC = () => {
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get('/api/user_order_complete/order');
                setOrder(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching order:', error);
                setError('주문 내역을 불러오는데 실패했습니다.');
            }
        };

        fetchOrder();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!order) {
        return <p>주문 내역을 불러오는 중...</p>;
    }

    return (
        <div className='flex justify-center h-lvh'>
            <div className='max-w-sm w-full px-2'>
                <div className='bg-white p-4 rounded-xl shadow-lg'>
                    <div className='flex justify-center mb-4'>
                        <div className='font-bold'>주문이 완료되었습니다!</div>
                    </div>
                    <div>
                        <hr></hr>
                        <div className='my-4'>
                            <div className='flex justify-start '>
                                <p className='font-bold'>{order.storeName}</p>
                            </div>
                            <div className='flex justify-between my-2'>
                                <div>주문 번호</div> 
                                {order.id}
                            </div>
                            <div className='flex justify-between my-2'>
                                <div>주문 일시</div>
                                {order.orderDate}
                            </div>
                            <h2 className='flex justify-start font-bold mb-4 mt-8'>주문 내역</h2>
                        </div>
                        <div className='my-4'>
                            <div className='flex justify-between'>
                                <div className='flex justify-start w-24 '>메뉴 이름</div>
                                <div className='flex justify-start w-12'>수량</div>
                                <div className='flex justify-end w-24'>가격</div>
                            </div>
                            <div>
                                {order.items.map((item: any, index: number) => (
                                    <div className='flex justify-between' key={index}>
                                        <div className='flex justify-start w-24 overflow-hidden whitespace-nowrap text-ellipsis'>
                                            {item.name}
                                        </div>
                                        <div className='flex justify-start w-12'>
                                            {item.quantity}개
                                        </div>
                                        <div className='flex justify-end w-24 overflow-hidden whitespace-nowrap text-ellipsis'>
                                            {item.price}원
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <hr></hr>
                        <div className='flex justify-between mt-4 font-bold'>
                            <div>
                                총가격
                            </div>
                            <div>
                                {order.total}원
                            </div>
                        </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default OrderCompletePage;
