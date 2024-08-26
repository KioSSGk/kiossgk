import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { sendSms } from '@/lib/sms';
import { RowDataPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { orderId, action } = req.body;

  if (!orderId || !action) {
    return res.status(400).json({ message: 'Order ID and action are required' });
  }

  try {
    const [orderResult] = await pool.query<RowDataPacket[]>(`
      SELECT o.store_idx, u.phone_number, m.menu_name, s.store_name
      FROM orders o
      JOIN Carts c ON o.cart_idx = c.cart_idx
      JOIN CartItems ci ON c.cart_idx = ci.cart_idx
      JOIN Menu m ON ci.menu_idx = m.menu_idx
      JOIN users u ON o.user_idx = u.user_idx
      JOIN Store s ON o.store_idx = s.store_idx
      WHERE o.order_idx = ?
    `, [orderId]);

    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult[0];
    const phoneNumber = order.phone_number;
    const menuNames = orderResult.map((item) => item.menu_name).join(', ');
    let text = '';

    // 액션에 따른 메시지 작성
    if (action === 'accept') {
      text = `가게 이름: ${order.store_name}\n주문하신 메뉴: ${menuNames}\n접수되었습니다.`;
    } else if (action === 'complete') {
      text = `가게 이름: ${order.store_name}\n주문하신 메뉴:\n- ${menuNames}\n조리가 완료되었습니다. 찾아가주세요~!`;
    } else {
      return res.status(400).json({ message: 'Invalid action type' });
    }

    await sendSms(phoneNumber, text);

    return res.status(200).json({ message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ message: 'Failed to send SMS' });
  }
}
