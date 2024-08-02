import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET!; // 환경 변수로 관리하세요

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            console.log('Email:', email);
            console.log('Password:', password);

            // 사용자 정보 조회
            const [rows] = await pool.query('SELECT * FROM Admin WHERE email = ?', [email]);
            const user = (rows as any)[0];

            if (!user) {
                res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
                return;
            }

            // 비밀번호 비교
            const isPasswordValid = await bcrypt.compare(password, user.passwd);

            if (!isPasswordValid) {
                res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
                return;
            }

            // JWT 토큰 생성
            const token = jwt.sign({ id: user.admin_idx, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

            // 토큰을 HTTP Only 쿠키에 저장
            res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
            res.status(200).json({ message: '로그인이 완료되었습니다.', token });
        } catch (error) {
            console.error('DB 연결 오류:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
