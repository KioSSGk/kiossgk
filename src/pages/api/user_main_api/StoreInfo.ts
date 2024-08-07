// src/pages/api/user_main_api/StoreInfo.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface StoreInfo extends RowDataPacket {
  store_idx: number;
  store_name: string;
  store_category: string;
  store_img_path: string;
}

// 사업장 가게 목록을 반환하는 API 핸들러
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
  }

  const { workplaceNumber } = req.query;

  if (!workplaceNumber) {
    return res.status(400).json({ message: '사업장 번호가 필요합니다.' });
  }

  try {
    const query = `
      SELECT s.store_idx, s.store_name, s.store_category, si.store_img_path
      FROM Store s
      JOIN Storeimg si ON s.store_idx = si.store_idx
      WHERE s.workplace_idx = ?
    `;
    const [rows] = await pool.query<StoreInfo[]>(query, [workplaceNumber]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '가게가 없습니다.' });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error('DB 연결 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export default handler;
