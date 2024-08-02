import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { email, name, password, phoneNumber, businessRegistrationNumber } = req.body;

        try {
            // 비밀번호 암호화
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // DB에 삽입
            const [result] = await pool.query(
                `INSERT INTO Admin (email, admin_name, passwd, phone,  use_state) VALUES (?, ?, ?, ?, ?)`,
                [email, name, hashedPassword, phoneNumber, 1]
            );

            res.status(200).json({ message: '회원가입이 완료되었습니다.' });
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
