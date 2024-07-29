import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            email,
            nickname,
            password,
            confirmPassword,
            phoneNumber,
            storeName,
            businessRegistrationNumber,
            storeImage,
            storeAddress,
            storePhoneNumber,
            storeCategory,
            storeOpeningHours,
            storeDescription
        } = req.body;

        // 여기에서 데이터베이스에 데이터를 저장하거나 추가적인 검증 로직을 수행
        console.log('회원가입 데이터:', req.body);

        // 성공적으로 처리되었음을 응답
        res.status(200).json({ message: '회원가입이 완료되었습니다.' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
