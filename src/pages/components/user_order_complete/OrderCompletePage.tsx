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
        <div style={{ backgroundColor: '#FFA500', minHeight: '100vh', padding: '20px', color: 'black' }}>
            <h1 style={{ textAlign: 'center' }}>주문이 완료되었습니다!</h1>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>주문 정보</h2>
                <p><strong>가게 이름:</strong> {order.storeName}</p>
                <p><strong>주문 번호:</strong> {order.id}</p>
                <p><strong>주문 일시:</strong> {order.orderDate}</p>
                <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>주문 내역</h2>
                <table style={{ width: '100%', marginBottom: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px 0' }}>메뉴 이름</th>
                            <th style={{ textAlign: 'right', padding: '10px 0' }}>수량</th>
                            <th style={{ textAlign: 'right', padding: '10px 0' }}>가격</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item: any, index: number) => (
                            <tr key={index}>
                                <td style={{ padding: '10px 0' }}>{item.name}</td>
                                <td style={{ textAlign: 'right', padding: '10px 0' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right', padding: '10px 0' }}>{item.price}원</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3 style={{ textAlign: 'right' }}>총가격: {order.total}원</h3>
            </div>
        </div>
    );
};

export default OrderCompletePage;
