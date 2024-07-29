import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        // 가게 정보 배열을 생성
        const stores = [
            {
                id: 1,
                name: '신세계 중식당 센텀시티점',
                hours: '11:00 - 20:30',
                description: '신세계 푸드코트 내부의 중식당~~',
                image: 'https://via.placeholder.com/50'
            },
            {
                id: 2,
                name: '스타벅스 신세계 센텀시티 지하점',
                hours: '07:00 - 22:00',
                description: '스타벅스에서 커피 한 잔의 여유를 즐기세요.',
                image: 'https://via.placeholder.com/50'
            },
            {
                id: 3,
                name: '타코 개 비싸게 파는 가게',
                hours: '10:00 - 21:00',
                description: '타코 먹고 가세용~',
                image: 'https://via.placeholder.com/50'
            }
        ];

        // 가게 정보 배열을 응답으로 반환
        res.status(200).json(stores);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
