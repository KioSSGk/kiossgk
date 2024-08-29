import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { deleteFileFromS3 } from '@/lib/s3'; 
import { connect } from 'http2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
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

       // 이미지 URL이 올바르게 포함되어 있는지 확인
    rows.forEach(row => {
      console.log('Image URL:', row.menu_image_path); // URL을 콘솔에 출력하여 확인
    });

    return res.status(200).json(rows);
  } catch (error) {
    console.error('메뉴 조회 중 오류 발생:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { menu_name, menu_price, menu_detail, menu_category, menu_status, image } = req.body;
    const { adminId } = req.query;

    if (!menu_name || !menu_price || !menu_category || !menu_status) {
      return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
    }

    if (!adminId) {
      return res.status(400).json({ message: 'adminId is required' });
    }

    const [storeRow] = await pool.query<RowDataPacket[]>(`SELECT store_idx FROM Store WHERE admin_idx = ?`, [adminId]);

    if (storeRow.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const store_idx = storeRow[0].store_idx;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Menu (store_idx, menu_name, menu_price, menu_detail, menu_category, menu_status) VALUES (?, ?, ?, ?, ?, ?)`,
      [store_idx, menu_name, parseInt(menu_price, 10), menu_detail, menu_category, menu_status]
    );

    const menu_idx = result.insertId;

    if (image) {
      await pool.query(
        `INSERT INTO Menuimg (menu_idx, menu_image_path) VALUES (?, ?)`,
        [menu_idx, image]
      );
    }

    return res.status(201).json({ id: menu_idx });
  } catch (error) {
    console.error('메뉴 생성 중 오류 발생:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { menu_idx, menu_name, menu_price, menu_detail, menu_category, menu_status, image } = req.body;

    if (!menu_idx) {
      return res.status(400).json({ message: '업데이트 하려면 menu_idx가 필요합니다.' });
    }

    await pool.query(
      'UPDATE Menu SET menu_name = ?, menu_price = ?, menu_detail = ?, menu_category = ?, menu_status = ? WHERE menu_idx = ?',
      [menu_name, parseInt(menu_price, 10), menu_detail, menu_category, menu_status, menu_idx]
    );

    if (image) {
      // 이미 메뉴 이미지가 존재하는지 확인
      const [existingImageRows] = await pool.query<RowDataPacket[]>(
        'SELECT menu_image_path FROM Menuimg WHERE menu_idx = ?',
        [menu_idx]
      );

      if (existingImageRows.length > 0) {
        // 기존 이미지가 있는 경우 업데이트
        await pool.query(
          'UPDATE Menuimg SET menu_image_path = ? WHERE menu_idx = ?',
          [image, menu_idx]
        );
      } else {
        // 기존 이미지가 없을 경우 삽입
        await pool.query(
          'INSERT INTO Menuimg (menu_idx, menu_image_path) VALUES (?, ?)',
          [menu_idx, image]
        );
      }
    }

    return res.status(200).json({ message: '메뉴가 수정되었습니다.' });
  } catch (error) {
    console.error('메뉴 수정 중 오류 발생:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.body; // 삭제할 메뉴의 ID

    // S3에서 이미지를 삭제하기 위해 이미지 경로 가져오기
    const [imageRows] = await pool.query<RowDataPacket[]>(
      'SELECT menu_image_path FROM Menuimg WHERE menu_idx = ?',
      [id]
    );

    if (imageRows.length > 0) {
      const imageUrl = imageRows[0].menu_image_path;
      const imageKey = extractFileKeyFromUrl(imageUrl);
      await deleteFileFromS3(imageKey);
    }

    // CartItems 테이블에서 해당 메뉴에 연결된 레코드 삭제
    await pool.query('DELETE FROM CartItems WHERE menu_idx = ?', [id]);

    // MenuOption 테이블에서 해당 메뉴에 연결된 옵션 레코드 삭제
    await pool.query('DELETE FROM MenuOption WHERE menu_idx = ?', [id]);

    // Menuimg 테이블에서 해당 메뉴에 연결된 이미지 레코드 삭제
    await pool.query('DELETE FROM Menuimg WHERE menu_idx = ?', [id]);

    // Menu 테이블에서 해당 메뉴 레코드 삭제
    await pool.query('DELETE FROM Menu WHERE menu_idx = ?', [id]);


    res.status(200).json({ message: '메뉴가 삭제되었습니다.' });
  } catch (error) {
    console.error('메뉴 삭제 중 오류 발생:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }



// 이미지 URL에서 S3 파일 키 추출 함수
function extractFileKeyFromUrl(url: string): string {
  const urlObj = new URL(url);
  return urlObj.pathname.substring(1); // 앞의 슬래시 제거
}
}