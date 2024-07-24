import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { id } = req.body;

        // 클릭된 가게 ID를 터미널에 출력
        console.log('Clicked store ID:', id);

        // 성공적으로 출력되었음을 응답
        res.status(200).json({ message: 'Store click logged.' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
