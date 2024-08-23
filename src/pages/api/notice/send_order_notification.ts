import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db'; // DB 연결 가져오기
import { sendSms } from '@/lib/sms'; // SMS 전송 함수 가져오기
import { RowDataPacket } from 'mysql2'; // MySQL에서의 행 데이터 타입

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { orderId } = req.body; // 클라이언트에서 주문 ID를 받아옴

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  try {
    // 주문 정보 가져오기
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
    const text = `가게 ${order.store_name}에서 주문하신 메뉴 ${menuNames} 준비되었습니다.`;

    // SMS 전송
    await sendSms(phoneNumber, text);

    return res.status(200).json({ message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ message: 'Failed to send SMS' });
  }
}