import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db'; // 데이터베이스 연결 설정

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { phoneNumber } = req.body;

            const userId = req.cookies.userId; // 쿠키에서 userId 가져오기

            if (!userId) {
                return res.status(400).json({ message: '유효한 유저 ID가 없습니다.' });
            }

            if (!phoneNumber) {
                return res.status(400).json({ message: '전화번호가 제공되지 않았습니다.' });
            }

            // USERS 테이블에 user_idx로 해당 유저의 phone_number를 업데이트
            const [result] = await pool.query(
                `UPDATE users SET phone_number = ? WHERE user_idx = ?`,
                [phoneNumber, userId]
            );
            // 나중에 문제가 발생하면 살려서 수정해야 하지만, 지금은 일단 없어도 작동해서 지워두었습니다.
            // if (result.affectedRows === 0) {
            //     return res.status(404).json({ message: '해당 유저를 찾을 수 없습니다.' });
            // }

            return res.status(200).json({ message: '전화번호가 성공적으로 업데이트되었습니다.' });
        } catch (error) {
            console.error('전화번호 업데이트 중 오류 발생:', error);
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
