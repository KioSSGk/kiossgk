import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db'; // 데이터베이스 연결 설정을 위한 모듈

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            // 1. 쿠키에서 유저 아이디를 조회
            const userId = req.cookies.userId;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is missing in cookies' });
            }

            // 2. 유저 아이디를 기준으로 오더 테이블에서 주문 정보를 불러옴
            const [orders]: any = await pool.query(
                `SELECT o.order_idx, o.store_idx, s.store_name, o.order_date, o.amount, o.cart_idx 
                 FROM orders o
                 JOIN Store s ON o.store_idx = s.store_idx
                 WHERE o.user_idx = ?
                 ORDER BY o.order_date DESC 
                 LIMIT 1`, // 가장 최근 주문만 가져옴
                [userId]
            );

            if (orders.length === 0) {
                return res.status(404).json({ message: 'No orders found for this user' });
            }

            const order = orders[0];

            // 4. 불러온 카트 아이디를 기반으로 카트 아이템에서 해당하는 아이템 이름과 수량을 불러옴
            const [cartItems]: any = await pool.query(
                `SELECT 
                    m.menu_name AS name, 
                    m.menu_price AS menuPrice, 
                    ci.count, 
                    mo.options AS optionName, 
                    mo.price AS optionPrice 
                 FROM 
                    CartItems ci
                 JOIN 
                    Menu m ON ci.menu_idx = m.menu_idx
                 LEFT JOIN 
                    MenuOption mo ON ci.option_idx = mo.option_idx
                 WHERE 
                    ci.cart_idx = ?`,
                [order.cart_idx]
            );
            
            // 5. 불러온 정보를 '오더' 객체에 저장
            const orderDetails = {
                id: order.order_idx,
                storeName: order.store_name,
                orderDate: order.order_date,
                items: cartItems.map((item: any) => ({
                    name: item.name,
                    quantity: item.count,
                    price: item.menuPrice,option: item.optionName ? {
                        name: item.optionName,
                        price: item.optionPrice
                    } : null // 옵션이 있으면 포함하고, 없으면 null
                })),
                total: order.amount
            };

            // 6. 유저 아이디를 쿠키에서 삭제
            res.setHeader('Set-Cookie', 'userId=; Path=/; Max-Age=0; HttpOnly');

            res.status(200).json(orderDetails);
        } catch (error) {
            console.error('Error fetching order details:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
