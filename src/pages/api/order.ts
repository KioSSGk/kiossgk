import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const order = {
            id: 'ORD12345678',
            storeName: '맛있는 중식당',
            orderDate: '2024.07.13 14시23분45초',
            items: [
                { name: '짜장면', quantity: 2, price: 8000 },
                { name: '계란추가', quantity: 1, price: 500 }
            ],
            total: 16500
        };
        res.status(200).json(order);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
