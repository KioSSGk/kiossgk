import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET|| 'default-secret-key'; // 일단 환경 변수로 설정하고 환경 변수가 없는 경우를 대비해 입시 값을 넣어두었습니다.

// JWT 토큰 생성
export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// JWT 토큰 검증
export const verifyToken = (token: string): object | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as object;
    } catch (err) {
        console.error('토큰 검증 실패:', err);
        return null;
    }
};

// 인증 미들웨어
export const authMiddleware = (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: '인증이 필요합니다.' });
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            res.status(401).json({ message: '잘못된 토큰입니다.' });
            return;
        }

        (req as any).user = decoded;
        return handler(req, res);
    };
};
