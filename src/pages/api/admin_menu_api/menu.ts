import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Menu } from '@/types/menu'; // Menu 및 Menuimg 타입을 임포트합니다.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    // case 'POST':
    //   return handlePost(req, res);
    // case 'PUT':
    //   return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { storeId } = req.query;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT m.menu_idx, m.store_idx, m.menu_name, m.menu_price, m.menu_detail, m.menu_category, m.menu_status, mi.menu_image_path 
       FROM Menu m 
       LEFT JOIN Menuimg mi ON m.menu_idx = mi.menu_idx 
       WHERE m.store_idx = ?`, [storeId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('메뉴 조회 중 오류 발생:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



// async function handlePost(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const { menu_name, menu_price, menu_detail, menu_category, menu_status } = req.body as Menu;
//     const { storeId } = req.query;
//     const [result] = await pool.query<ResultSetHeader>(
//       'INSERT INTO Menu (store_idx, menu_name, menu_price, menu_detail, menu_category, menu_status) VALUES (?, ?, ?, ?, ?, ?)',
//       [storeId, menu_name, menu_price, menu_detail, menu_category, menu_status]
//     );

//     const menu_idx = result.insertId;

//     res.status(201).json({ id: menu_idx });
//   } catch (error) {
//     console.error('메뉴 생성 중 오류 발생:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }


// async function handlePost(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const { menu_name, menu_price, menu_detail, menu_category, menu_status, menu_image_path } = req.body as Menu & { menu_image_path: string };
//     const { adminId } = req.query;

//     const [storeRow] = await pool.query<RowDataPacket[]>('SELECT store_idx FROM Store WHERE admin_idx = ?', [adminId]);
//     if (storeRow.length === 0) {
//       return res.status(404).json({ message: 'Store not found' });
//     }
//     const store_idx = storeRow[0].store_idx;

//     const [result] = await pool.query<ResultSetHeader>(
//       'INSERT INTO Menu (store_idx, menu_name, menu_price, menu_detail, menu_category, menu_status) VALUES (?, ?, ?, ?, ?, ?)',
//       [store_idx, menu_name, menu_price, menu_detail, menu_category, menu_status]
//     );

//     const menu_idx = result.insertId;

//     if (menu_image_path) {
//       await pool.query<ResultSetHeader>(
//         'INSERT INTO Menuimg (menu_idx, menu_image_path) VALUES (?, ?)',
//         [menu_idx, menu_image_path]
//       );
//     }

//     res.status(201).json({ id: menu_idx });
//   } catch (error) {
//     console.error('메뉴 생성 중 오류 발생:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

// async function handlePut(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const { menu_idx, menu_name, menu_price, menu_detail, menu_category, menu_status, menu_image_path } = req.body as Menu & { menu_image_path: string };
//     const { storeId } = req.query;
//     await pool.query(
//       'UPDATE Menu SET menu_name = ?, menu_price = ?, menu_detail = ?, menu_category = ?, menu_status = ? WHERE menu_idx = ? AND store_idx = ?',
//       [menu_name, menu_price, menu_detail, menu_category, menu_status, menu_idx, storeId]
//     );

//     if (menu_image_path) {
//       await pool.query(
//         'REPLACE INTO Menuimg (menu_idx, menu_image_path) VALUES (?, ?)',
//         [menu_idx, menu_image_path]
//       );
//     }

//     res.status(200).json({ message: '메뉴가 수정되었습니다.' });
//   } catch (error) {
//     console.error('메뉴 수정 중 오류 발생:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;
    await pool.query('DELETE FROM Menu WHERE menu_idx = ?', [id]);
    await pool.query('DELETE FROM Menuimg WHERE menu_idx = ?', [id]);
    res.status(200).json({ message: '메뉴가 삭제되었습니다.' });
  } catch (error) {
    console.error('메뉴 삭제 중 오류 발생:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
