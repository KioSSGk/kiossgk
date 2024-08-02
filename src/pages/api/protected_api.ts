// src/pages/api/protected_api.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';

const protectedApi = (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: '잘못된 토큰입니다.' });
    }

    return res.status(200).json({ user: decoded });
};

export default protectedApi;
