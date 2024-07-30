import { NextApiRequest, NextApiResponse } from 'next';

let cartItems = [
  {
    id: 1,
    name: '짜장면',
    price: 8000,
    quantity: 1,
    options: [
      { id: 1, name: '계란추가', price: 500, quantity: 1 },
      { id: 2, name: '면추가', price: 1000, quantity: 1 }
    ],
  },
  {
    id: 2,
    name: '짬뽕',
    price: 9000,
    quantity: 2,
    options: [
      { id: 1, name: '해물추가', price: 2000, quantity: 1 }
    ],
  },
  {
    id: 3,
    name: '볶음밥',
    price: 7000,
    quantity: 1,
    options: [
      { id: 1, name: '계란추가', price: 500, quantity: 2 },
      { id: 2, name: '새우추가', price: 1500, quantity: 1 }
    ],
  },
  {
    id: 4,
    name: '짜장면',
    price: 8000,
    quantity: 1,
    options: [
      { id: 3, name: '추가 계란', price: 500, quantity: 2 },
    ],
  },
];

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.status(200).json(cartItems);
  } else if (req.method === 'POST') {
    const updatedItem = req.body;
    cartItems = cartItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    res.status(200).json({ message: 'Cart item updated successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
