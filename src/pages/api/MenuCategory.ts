import pool from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        //쿼리문으로 내용을 바꾸어야 합니다.
        const { storeId } = req.query;
        const [rows] = await pool.execute(
            'SELECT DISTINCT menu_category FROM menu_table WHERE store_idx = ? AND menu_category IS NOT NULL',
            [storeId]
          );
         const categories=rows;
        res.status(200).json(categories);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
    };