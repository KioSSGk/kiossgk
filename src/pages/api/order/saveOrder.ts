import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { Order } from '@/types/order';
import admin from 'firebase-admin';

const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!privateKey) {
  throw new Error('FIREBASE_PRIVATE_KEY is not defined in environment variables.');
}

// Firebase Admin SDK 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

const sendAdminNotification = async (fcmToken: string, message: { title: string, body: string }) => {
  const payload = {
    token: fcmToken,
    notification: {
      title: message.title,
      body: message.body,
    },
  };

  try {
    const response = await admin.messaging().send(payload);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        order_idx,
        requests,
        amount,
        agency_id,
        total_price,
      } = req.body as Partial<Order>;

      const userId = req.cookies.userId;

      if (!userId) {
        return res.status(400).json({ message: '유효한 유저 ID가 없습니다.' });
      }

      const [rows]: [any[], any] = await pool.query(
        `SELECT cart_idx, store_idx FROM Carts WHERE user_idx = ?`,
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: '해당 유저의 카트를 찾을 수 없습니다.' });
      }

      const { cart_idx, store_idx } = rows[0];

      const currentDate = new Date().toISOString();

      await pool.query(
        `INSERT INTO orders (order_idx, user_idx, store_idx, cart_idx, order_state, requests, amount, agency_id, created, total_price, order_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [order_idx, userId, store_idx, cart_idx, '02', requests, amount, agency_id, currentDate, total_price, currentDate]
      );

      const [storeRows]: [any[], any] = await pool.query(`SELECT admin_idx FROM Store WHERE store_idx = ?`, [store_idx]);

      if (storeRows.length === 0) {
        return res.status(404).json({ message: '해당 가게를 찾을 수 없습니다.' });
      }

      const { admin_idx } = storeRows[0];

      const [adminRows]: [any[], any] = await pool.query(`SELECT fcm_token FROM Admin WHERE admin_idx = ?`, [admin_idx]);

      if (adminRows.length === 0 || !adminRows[0].fcm_token) {
        return res.status(404).json({ message: '해당 어드민의 FCM 토큰을 찾을 수 없습니다.' });
      }

      const fcmToken = adminRows[0].fcm_token;

      await sendAdminNotification(fcmToken, {
        title: '새 주문 알림',
        body: `새로운 주문이 들어왔습니다. 주문 번호: ${order_idx}`,
      });

      res.status(201).json({ message: '주문이 성공적으로 저장되었습니다.' });

    } catch (error) {
      console.error('주문 저장 중 오류 발생:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
