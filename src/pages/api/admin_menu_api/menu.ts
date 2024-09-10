import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',  // 허용할 최대 크기 설정 (예: 10MB)
    },
  },
};

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

    return res.status(200).json(rows);
  } catch (error) {
    console.error('메뉴 조회 중 오류 발생:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 요청된 데이터가 제대로 들어오는지 확인하는 로그 추가
    console.log('POST Request Body:', req.body);

    const { menu_name, menu_price, menu_detail, menu_category, menu_status, base64Image } = req.body;
    const { adminId } = req.query;

    if (!menu_name || !menu_price || !menu_category || !menu_status || !base64Image) {
      return res.status(400).json({ 
        message: '필수 필드가 누락되었습니다.', 
        missingFields: { menu_name, menu_price, menu_category, menu_status, base64Image } 
      });
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

    // Base64 이미지를 파일로 저장하는 로직
    if (base64Image) {
      const imagePath = saveBase64ImageToFile(base64Image, menu_idx); // 이미지 파일 경로 생성
      console.log('Image saved to:', imagePath);  // 이미지 경로 로그 추가
      await pool.query(
        `INSERT INTO Menuimg (menu_idx, menu_image_path) VALUES (?, ?)`,
        [menu_idx, imagePath]
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
    console.log('PUT Request Body:', req.body);

    const { menu_idx, menu_name, menu_price, menu_detail, menu_category, menu_status, base64Image } = req.body;

    if (!menu_idx) {
      return res.status(400).json({ message: '업데이트 하려면 menu_idx가 필요합니다.' });
    }

    await pool.query(
      'UPDATE Menu SET menu_name = ?, menu_price = ?, menu_detail = ?, menu_category = ?, menu_status = ? WHERE menu_idx = ?',
      [menu_name, parseInt(menu_price, 10), menu_detail, menu_category, menu_status, menu_idx]
    );

    if (base64Image) {
      const [existingImageRows] = await pool.query<RowDataPacket[]>(
        'SELECT menu_image_path FROM Menuimg WHERE menu_idx = ?',
        [menu_idx]
      );

      if (existingImageRows.length > 0) {
        const oldImagePath = existingImageRows[0].menu_image_path;
        deleteLocalFile(oldImagePath);  // 기존 이미지 파일 삭제

        const imagePath = saveBase64ImageToFile(base64Image, menu_idx); // 이미지 파일 경로 생성
        console.log('Updated image saved to:', imagePath);  // 이미지 경로 로그 추가
        await pool.query(
          'UPDATE Menuimg SET menu_image_path = ? WHERE menu_idx = ?',
          [imagePath, menu_idx]
        );
      } else {
        const imagePath = saveBase64ImageToFile(base64Image, menu_idx);
        await pool.query(
          'INSERT INTO Menuimg (menu_idx, menu_image_path) VALUES (?, ?)',
          [menu_idx, imagePath]
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
  try {
    const { id } = req.body; // 삭제할 메뉴의 ID

    const [imageRows] = await pool.query<RowDataPacket[]>(
      'SELECT menu_image_path FROM Menuimg WHERE menu_idx = ?',
      [id]
    );

    if (imageRows.length > 0) {
      const imageUrl = imageRows[0].menu_image_path;
      deleteLocalFile(imageUrl); // 로컬 파일 삭제
    }

    await pool.query('DELETE FROM CartItems WHERE menu_idx = ?', [id]);
    await pool.query('DELETE FROM MenuOption WHERE menu_idx = ?', [id]);
    await pool.query('DELETE FROM Menuimg WHERE menu_idx = ?', [id]);
    await pool.query('DELETE FROM Menu WHERE menu_idx = ?', [id]);

    res.status(200).json({ message: '메뉴가 삭제되었습니다.' });
  } catch (error) {
    console.error('메뉴 삭제 중 오류 발생:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Base64 이미지를 파일로 저장하는 함수
function saveBase64ImageToFile(base64Image: string, menu_idx: number): string {
  const buffer = Buffer.from(base64Image, 'base64');
  const imagePath = `/uploads/menu_${menu_idx}.png`; // 저장될 파일 경로
  const absolutePath = path.join(process.cwd(), 'public', imagePath);

  fs.writeFileSync(absolutePath, buffer);

  return imagePath; // 파일 경로 반환
}

// 로컬 파일 삭제 함수
function deleteLocalFile(filePath: string) {
  const absolutePath = path.join(process.cwd(), filePath);
  fs.unlink(absolutePath, (err) => {
    if (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
  });
}
