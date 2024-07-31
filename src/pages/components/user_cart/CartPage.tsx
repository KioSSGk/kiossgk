import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  options: { id: number; name: string; price: number; quantity: number }[];
}

const fetchCartItems = async (): Promise<CartItem[]> => {
  try {
    const response = await axios.get<CartItem[]>('/api/user_cart/usercart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

const updateCartItem = async (cartItem: CartItem): Promise<void> => {
  try {
    await axios.post('/api/user_cart/usercart', cartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
  }
};

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const getCartItems = async () => {
      const items = await fetchCartItems();
      setCartItems(items);
    };
    getCartItems();
  }, []);

  const handleQuantityChange = (itemId: number, amount: number) => {
    setCartItems((prevItems) =>
      prevItems.flatMap((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + amount;
          if (newQuantity > 0) {
            const updatedItem = { ...item, quantity: newQuantity };
            updateCartItem(updatedItem);
            return [updatedItem];
          } else {
            return [];
          }
        }
        return [item];
      })
    );
  };

  const handleOptionQuantityChange = (
    itemId: number,
    optionId: number,
    amount: number
  ) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const updatedOptions = item.options.flatMap((option) => {
            if (option.id === optionId) {
              const newQuantity = option.quantity + amount;
              if (newQuantity > 0) {
                return [{ ...option, quantity: newQuantity }];
              } else {
                return [];
              }
            }
            return [option];
          });
          const updatedItem = { ...item, options: updatedOptions };
          updateCartItem(updatedItem);
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const optionsTotal = item.options.reduce((optionTotal, option) => optionTotal + option.price * option.quantity, 0);
      return total + itemTotal + optionsTotal;
    }, 0);
  };

  return (
    <div className='flex justify-center'>
      <div className='max-w-sm w-full px-2 pt-24 text-sm'>
        {cartItems.map((item) => (
          <div className='p-4 mb-6 bg-white rounded-xl shadow-lg' key={item.id}>
              <div className='flex justify-between'>
                  <div className='font-bold'>
                    {item.name}
                  </div>
                  <div>
                  <button onClick={() => handleQuantityChange(item.id, -1)}>
                    &lt;
                  </button>
                  <span className='font-bold p-2'>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)}>
                    &gt;
                  </button>
                  </div>
                </div>
              <div>
                + {item.price}원
            </div>
            {item.options.map((option) => (
              <div className='my-4' key={option.id}>
                <div className='flex justify-between'>
                  <div className='font-bold'>
                    {option.name}
                  </div>
                  <div>
                  <button
                    onClick={() => handleOptionQuantityChange(item.id, option.id, -1)}
                  >
                    &lt;
                  </button>
                  <span className='font-bold p-2'>{option.quantity}</span>
                  <button
                    onClick={() => handleOptionQuantityChange(item.id, option.id, 1)}
                  >
                    &gt;
                  </button>
                  </div>
                </div>
                <div>
                  + {option.price}원
                </div>
                
              </div>
            ))}
            <div className='flex justify-end '>
              <button className='bg-orange-400 p-2 rounded-lg text-white font-bold text-sm' onClick={() => handleRemoveItem(item.id)}>
                삭제하기
              </button>
            </div>
          </div>
        ))}
        <div className='py-12'></div>
      </div>
        <div className='flex bg-white p-3 w-full justify-center fixed bottom-0 drop-shadow-lg'>
            <div className='flex justify-between w-full max-w-sm px-2 items-center'>
              <div className='font-bold'>
                <h2>
                  총금액: {calculateTotalPrice()}원
                </h2>
              </div>
              <div className=''>
                <button className='bg-orange-400 p-2 text-white font-bold text-sm rounded-lg'>결제하기</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default CartPage;
