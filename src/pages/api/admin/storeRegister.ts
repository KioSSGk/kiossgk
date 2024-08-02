import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import formidable, { Fields, Files, File } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

const storeRegister = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields: Fields, files: Files) => {
            if (err) {
                return res.status(500).json({ message: '파일 업로드 중 오류가 발생했습니다.' });
            }

            const storeName = Array.isArray(fields.storeName) ? fields.storeName[0] : fields.storeName;
            const workplaceIdx = Array.isArray(fields.workplaceIdx) ? fields.workplaceIdx[0] : fields.workplaceIdx;
            const storeNumber = Array.isArray(fields.storePhoneNumber) ? fields.storePhoneNumber[0] : fields.storePhoneNumber;
            const storeCategory = Array.isArray(fields.storeCategory) ? fields.storeCategory[0] : fields.storeCategory;
            const openTime = Array.isArray(fields.storeOpeningTime) ? `${fields.storeOpeningTime[0]}:00` : `${fields.storeOpeningTime}:00`;
            const closeTime = Array.isArray(fields.storeClosingTime) ? `${fields.storeClosingTime[0]}:00` : `${fields.storeClosingTime}:00`;
            const storeContent = Array.isArray(fields.storeDescription) ? fields.storeDescription[0] : fields.storeDescription;

            const storeImageArray = files.storeImage as File[] | undefined;
            const storeImage = storeImageArray ? storeImageArray[0] : undefined;

            if (!storeImage) {
                return res.status(400).json({ message: '가게 이미지는 필수 항목입니다.' });
            }

            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, storeImage.newFilename);
            fs.renameSync(storeImage.filepath, filePath);

            try {
                // admin_idx를 쿠키에서 받아오기
                const adminIdxCookie = req.headers.cookie?.split('; ').find(row => row.startsWith('adminIdx='));
                if (!adminIdxCookie) {
                    return res.status(400).json({ message: '유효하지 않은 관리자 정보입니다.' });
                }
                const adminIdx = adminIdxCookie.split('=')[1];

                const query = `
                    INSERT INTO Store (store_name, workplace_idx, admin_idx, store_number, store_category, open_time, close_time, store_content)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const [result] = await pool.query(query, [storeName, workplaceIdx, adminIdx, storeNumber, storeCategory, openTime, closeTime, storeContent]);

                const storeIdx = (result as any).insertId;

                const imageQuery = `
                    INSERT INTO Storeimg (store_idx, store_img_path)
                    VALUES (?, ?)
                `;
                await pool.query(imageQuery, [storeIdx, filePath]);

                return res.status(200).json({ message: '가게 등록이 완료되었습니다.' });
            } catch (error) {
                console.error('DB 연결 오류:', error);
                return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        });
    } else {
        return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
    }
};

export default storeRegister;
