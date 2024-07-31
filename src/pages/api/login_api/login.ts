// src/pages/api/admin_login_api.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            // 이메일과 비밀번호를 터미널에 출력
            console.log('Email:', email);
            console.log('Password:', password);

            // DB 연결 및 쿼리 실행
            const [rows] = await pool.query('SELECT * FROM Admin WHERE email = ? AND passwd = ?', [email, password]);

            if ((rows as any).length > 0) {
                // 로그인 성공
                res.status(200).json({ message: '로그인이 완료되었습니다.', user: (rows as any)[0] });
            } else {
                // 로그인 실패
                res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
            }
        } catch (error) {
            console.error('DB 연결 오류:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
