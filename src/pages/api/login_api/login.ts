// src/pages/api/admin_login_api.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            console.log('Email:', email);
            console.log('Password:', password);

            const [rows] = await pool.query('SELECT * FROM Admin WHERE email = ? AND passwd = ?', [email, password]);

            if ((rows as any).length > 0) {
                const user = (rows as any)[0];
                const token = jwt.sign({ id: user.admin_idx, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
                
                res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
                res.status(200).json({ message: '로그인이 완료되었습니다.', token });
            } else {
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
