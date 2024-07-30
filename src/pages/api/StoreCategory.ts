import { NextApiRequest, NextApiResponse } from 'next';


export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const categories = [
            {
                index: 1,
                item: '전체'
            },
            {
                index: 2,
                item: '한식'
            },
            {
                index: 3,
                item: '양식'
            },
            {
                index: 4,
                item: '일식'
            },
            {
                index: 5,
                item: '중식'
            },
            {   
                index: 6,
                item: '패스트푸드'
            },
            {
                index: 7,
                item: '디저트'
            }
        ];

        res.status(200).json(categories);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
    };