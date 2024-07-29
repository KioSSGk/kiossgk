import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // 이메일과 비밀번호를 터미널에 출력
        console.log('Email:', email);
        console.log('Password:', password);

        // 성공적으로 출력되었음을 응답
        res.status(200).json({ message: '로그인이 완료되었습니다.' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
