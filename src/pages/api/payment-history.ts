import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const { startDate, endDate } = req.query;

        const payments = [
            {
                date: '2024.07.13',
                time: '14시23분45초',
                details: '짜장면 x 2 짬뽕 x 1 탕수육 x 1...',
                amount: '37000원'
            },
            {
                date: '2024.07.14',
                time: '15시10분32초',
                details: '탕수육 x 1 짬뽕 x 2...',
                amount: '27000원'
            }
        ];

        const filteredPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.date.replace(/\./g, '-'));
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);
            return paymentDate >= start && paymentDate <= end;
        });

        res.status(200).json(filteredPayments);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
