import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db'; // 데이터베이스 연결 설정을 위한 모듈

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const { startDate, endDate, adminId } = req.query;
            console.log('Received adminId:', adminId);
            console.log('Query parameters:', { startDate, endDate, adminId });
    
            if (!adminId) {
                return res.status(400).json({ message: 'Store ID is required' });
            }

            const start = new Date(startDate as string);
            const end = new Date(endDate as string);
            
            // orders 테이블에서 스토어 아이디에 해당하는 주문을 날짜 범위로 필터링
            const [orders]: any = await pool.query(
                `SELECT o.order_idx, o.created, o.cart_idx, o.amount
                 FROM orders o
                 WHERE o.store_idx = ? AND o.created BETWEEN ? AND ?`,
                [adminId, start, end]
            );

            const payments = [];

            for (const order of orders) {
                // 각 주문에 대해 카트 아이템을 조회
                const [cartItems]: any = await pool.query(
                    `SELECT m.menu_name AS name, ci.count 
                     FROM CartItems ci
                     JOIN Menu m ON ci.menu_idx = m.menu_idx
                     WHERE ci.cart_idx = ?`,
                    [order.cart_idx]
                );

                // 카트 아이템 정보를 details 문자열로 변환
                const details = cartItems.map((item: any) => `${item.name} x ${item.count}`).join(' ');
                console.log('Orders:', orders);
                console.log('Cart Items:', cartItems);

                // 날짜와 시간을 분리
                const date = new Date(order.created);
                const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '.');
                const formattedTime = date.toTimeString().split(' ')[0];
                const amount = order.amount ? Math.floor(Number(order.amount)).toLocaleString() : '0';
                payments.push({
                    date: formattedDate,
                    time: formattedTime,
                    details: details,
                    amount: `${amount}원`
                });
            }

            res.status(200).json(payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
