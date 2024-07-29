import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        // 가게 정보 배열을 생성
        const detail = [
            {
                id: 1,
                name: '짜장면',
                price: '8000',
                description: '맛있는 짜장면',
                category: '중식',
                status: '주문가능',
                image: new File([""], "짜장면.jpg", { type: 'image/jpeg' }),
               
            }
    
        ];

        // 가게 정보 배열을 응답으로 반환
        res.status(200).json(detail);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
