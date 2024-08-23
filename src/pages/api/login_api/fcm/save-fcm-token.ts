// pages/api/login_api/fcm/save-fcm-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db'; // 데이터베이스 연결

export default async function saveFcmToken(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { adminId, fcmToken } = req.body;

  if (!adminId || !fcmToken) {
    return res.status(400).json({ message: 'adminId와 fcmToken이 필요합니다.' });
  }

  try {
    // FCM 토큰을 데이터베이스에 저장 또는 갱신
    await pool.query(`
      UPDATE Admin SET fcm_token = ? WHERE admin_idx = ?
    `, [fcmToken, adminId]);

    return res.status(200).json({ message: 'FCM 토큰이 성공적으로 저장되었습니다.' });
  } catch (error) {
    console.error('FCM 토큰 저장 중 오류 발생:', error);
    return res.status(500).json({ message: 'FCM 토큰 저장에 실패했습니다.' });
  }
}
