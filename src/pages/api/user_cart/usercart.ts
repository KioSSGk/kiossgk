import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
interface StoreIdxResult {
  store_idx: number;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let userId = req.cookies.userId;

  if (!userId) {
    userId = uuidv4();
    res.setHeader('Set-Cookie', `userId=${userId}; Path=/; HttpOnly`);
  }

  console.log("Incoming Request Method:", req.method);
  console.log("User ID:", userId);

  if (req.method === 'GET') {
    return handleGet(req, res, userId);
  } else if (req.method === 'POST') {
    return handlePost(req, res, userId);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res, userId);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id, menuId, storeId, quantity, options } = req.body;

  console.log("POST Request Body:", req.body);

  if (!quantity) {
    console.error('Missing required fields:', { id, menuId, storeId, quantity });
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user exists in the users table
    let [userCheck]: [RowDataPacket[], any] = await pool.query(
      `SELECT user_idx FROM users WHERE user_idx = ?`,
      [userId]
    );

    if (userCheck.length === 0) {
      // If user doesn't exist, create a new user
      await pool.query(
        `INSERT INTO users (user_idx) VALUES (?)`,
        [userId]
      );
      console.log(`Created new user with ID: ${userId}`);
    }
if (storeId!==undefined){
const[rows]=   await pool.query(`SELECT store_idx
FROM Carts
WHERE user_idx = ?;`,[userId]);
const resultRows = rows as StoreIdxResult[]; 
if (resultRows.length > 0) {
if(storeId!==resultRows[0].store_idx)//디비에서 조회한 가게랑 입력 값에서 받은 가게랑 다르면, 
//
{console.log(storeId,resultRows[0].store_idx);
  //두개를 출력하고 달라서 수정 못한다는 말을 해줘야 한다.
  //한번에 하나의 가게만 주문할 수 있습니다.라고 알림이 오게 만들어야 합니다.
  return res.status(400).json({ message: '서로 다른 가게의 메뉴를 장바구니에 한번에 담을 수 없습니다. 장바구니를 비우시거나, 장바구니를 확인해주세요.' });
}
}
}

    if (id) {
      // Update quantity for existing item
      await pool.query(
        `UPDATE CartItems SET count = ? WHERE cart_item_idx = ?`,
        [quantity, id]
      );
      console.log("Updated Cart Item Quantity:", quantity);
      return res.status(200).json({ message: 'Cart item quantity updated successfully' });
    } else {
      if (!menuId || !storeId) {
        console.error('Missing required fields for new item:', { menuId, storeId });
        return res.status(400).json({ message: 'Missing required fields for new item' });
      }

      // Check if user's cart exists
      let [cart]: [RowDataPacket[], any] = await pool.query(
        `SELECT cart_idx FROM Carts WHERE user_idx = ? AND store_idx = ?`,
        [userId, storeId]
      );

      let cartId;

      if (cart.length > 0) {
        cartId = cart[0].cart_idx;
      } else {
        const [result]: [ResultSetHeader, any] = await pool.query(
          `INSERT INTO Carts (user_idx, store_idx) VALUES (?, ?)`,
          [userId, storeId]
        );
        cartId = result.insertId;
        console.log("Inserted new Cart ID:", cartId);
      }

      // Check if the same menu item with the same options already exists
      let [existingCartItem]: [RowDataPacket[], any] = await pool.query(
        `SELECT cart_item_idx, count FROM CartItems WHERE cart_idx = ? AND menu_idx = ? AND (option_idx IS NULL OR option_idx = ?)`,
        [cartId, menuId, options.length > 0 ? options[0].id : null]
      );

      if (existingCartItem.length > 0) {
        const newQuantity = existingCartItem[0].count + quantity;
        await pool.query(
          `UPDATE CartItems SET count = ? WHERE cart_item_idx = ?`,
          [newQuantity, existingCartItem[0].cart_item_idx]
        );
        console.log("Updated Cart Item Quantity:", newQuantity);
      } else {
        const [result]: [ResultSetHeader, any] = await pool.query(
          `INSERT INTO CartItems (cart_idx, menu_idx, count, option_idx) 
          VALUES (?, ?, ?, ?)`,
          [cartId, menuId, quantity, options.length > 0 ? options[0].id : null]
        );

        const cartItemId = result.insertId;
        console.log("Inserted Cart Item ID:", cartItemId);
      }

      res.status(201).json({ message: 'Item added or updated in cart successfully' });
    }
  } catch (error) {
    console.error('Error processing cart:', (error as Error).message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


async function handleGet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    console.log("Handling GET request for userId:", userId);

    const [rows]: [RowDataPacket[], any] = await pool.query(
      `SELECT 
        ci.cart_item_idx AS cartItemId,
        m.menu_name AS name,
        m.menu_price AS price,
        ci.count AS quantity,
        mo.options AS optionName,
        mo.price AS optionPrice,
        ci.menu_idx AS menuId,
        c.store_idx AS storeId,
        ci.option_idx AS optionId
      FROM 
        CartItems ci
      JOIN 
        Carts c ON ci.cart_idx = c.cart_idx
      JOIN 
        Menu m ON ci.menu_idx = m.menu_idx
      LEFT JOIN 
        MenuOption mo ON ci.option_idx = mo.option_idx
      WHERE 
        c.user_idx = ?`,
      [userId]
    );

    console.log("Fetched Cart Items from DB:", rows);

    const cartItems = rows.map((row: any) => ({
      cartItemId: row.cartItemId,
      name: row.name,
      price: row.price,
      quantity: row.quantity,
      options: row.optionName ? [{ name: row.optionName, price: row.optionPrice }] : [],
      menuId: row.menuId,
      storeId: row.storeId,
      optionId: row.optionId,
    }));

    const totalPrice = cartItems.reduce((total: number, item: any) => {
      const itemTotal = item.price * item.quantity;
      const optionsTotal = item.options.reduce(
        (optTotal: number, opt: any) => optTotal + opt.price * item.quantity,
        0
      );
      return total + itemTotal + optionsTotal;
    }, 0);

    res.status(200).json({ cartItems, totalPrice });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
async function handleDelete(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { cartItemId } = req.body;

  console.log("DELETE Request Body:", req.body);

  if (!cartItemId) {
    console.error('Cart Item ID is required');
    return res.status(400).json({ message: 'Cart Item ID is required' });
  }

  try {
    // 먼저 CartItem을 삭제합니다.
    await pool.query(
      `DELETE FROM CartItems WHERE cart_item_idx = ?`,
      [cartItemId]
    );
    console.log(`Deleted Cart Item ID ${cartItemId} for User ID ${userId}`);

    // 해당 유저의 카트에 남은 아이템이 있는지 확인합니다.
    const [remainingItems]: [RowDataPacket[], any] = await pool.query(
      `SELECT ci.cart_item_idx 
       FROM CartItems ci
       JOIN Carts c ON ci.cart_idx = c.cart_idx
       WHERE c.user_idx = ?`,
      [userId]
    );

    if (remainingItems.length === 0) {
      // 카트가 비어 있으면 유저 ID 쿠키를 삭제합니다.
      res.setHeader('Set-Cookie', 'userId=; Path=/; Max-Age=0; HttpOnly');
      console.log(`Cart is empty, deleted userId cookie for User ID ${userId}`);
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

