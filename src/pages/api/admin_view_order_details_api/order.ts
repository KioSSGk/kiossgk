import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'PUT':
      return handleUpdate(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { storeId } = req.query;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT o.order_idx, o.user_idx, o.store_idx, o.created, o.order_date, 
              GROUP_CONCAT(CONCAT(m.menu_name, ' x ', c.count) SEPARATOR ', ') AS menu_details, o.order_state
       FROM orders o
       LEFT JOIN CartItems c ON o.cart_idx = c.cart_idx
       LEFT JOIN Menu m ON c.menu_idx = m.menu_idx 
       WHERE o.store_idx = ? AND (o.order_state = '02' OR o.order_state = '03')
       GROUP BY o.order_idx, o.user_idx, o.store_idx, o.created, o.order_date, o.order_state`,
      [storeId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('주문 조회 중 오류 발생:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function handleUpdate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { orderId, orderState } = req.body;

    await pool.query('UPDATE orders SET order_state = ? WHERE order_idx = ?', [orderState, orderId]);

    res.status(200).json({ message: '주문 상태가 업데이트 되었습니다' });
  } catch (error) {
    console.error('주문 상태 업데이트 중 오류 발생:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
