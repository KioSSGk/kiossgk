// src/pages/api/user_main_api/StoreInfo.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

// 사업장 가게 목록을 반환하는 API 핸들러
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { workplaceNumber } = req.query;

    if (req.method === 'GET') {
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
            const [rows] = await pool.query(query, [workplaceNumber]);
            res.status(200).json(rows);
        } catch (error) {
            console.error('DB 연결 오류:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    } else {
        res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
    }
};
