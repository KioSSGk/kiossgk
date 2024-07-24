import { NextApiRequest, NextApiResponse } from 'next';

let menuItems = [
    {
        id: 1,
        name: '짜장면',
        price: '8000',
        description: '맛있는 짜장면',
        category: '중식',
        status: '주문가능',
        image: '짜장면.jpg',
    },
    {
        id: 2,
        name: '짬뽕',
        price: '9000',
        description: '얼큰한 짬뽕',
        category: '중식',
        status: '주문가능',
        image: '짬뽕.jpg',
    },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, price, description, category, status, image } = req.body;
        const newItem = {
            id: menuItems.length + 1,
            name,
            price,
            description,
            category,
            status,
            image,
        };
        menuItems.push(newItem);
        console.log('상품 등록 완료');
        return res.status(201).json(newItem);
    } else if (req.method === 'PUT') {
        const { id, name, price, description, category, status, image } = req.body;
        const index = menuItems.findIndex(item => item.id === id);
        if (index !== -1) {
            menuItems[index] = { id, name, price, description, category, status, image };
            console.log('상품 수정 완료');
            return res.status(200).json(menuItems[index]);
        }
        return res.status(404).json({ message: 'Item not found' });
    } else if (req.method === 'DELETE') {
        const { id } = req.body;
        menuItems = menuItems.filter(item => item.id !== id);
        console.log('상품 삭제 완료');
        return res.status(200).json({ message: '삭제 완료' });
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
