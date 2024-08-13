import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { Menu } from '@/types/menu'; // Menu 및 Menuimg 타입을 임포트합니다.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { storeId } = req.query;

    if (!storeId) {
      return res.status(400).json({ message: 'Store ID is required' });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT m.menu_idx, m.store_idx, m.menu_name, m.menu_price, m.menu_detail, m.menu_category, m.menu_status, mi.menu_image_path 
       FROM Menu m 
       LEFT JOIN Menuimg mi ON m.menu_idx = mi.menu_idx 
       WHERE m.store_idx = ?`, [storeId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No menus found for this store' });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('메뉴 조회 중 오류 발생:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
