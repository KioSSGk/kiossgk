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
    <div>
      {cartItems.map((item) => (
        <div key={item.id}>
          <div>
            <div>{item.name}</div>
            <div>+ {item.price}원</div>
            <div>
              <button onClick={() => handleQuantityChange(item.id, -1)}>
                &lt;
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, 1)}>
                &gt;
              </button>
            </div>
          </div>
          {item.options.map((option) => (
            <div key={option.id} style={{ paddingLeft: '20px' }}>
              <div>{option.name}</div>
              <div>+ {option.price}원</div>
              <div>
                <button
                  onClick={() => handleOptionQuantityChange(item.id, option.id, -1)}
                >
                  &lt;
                </button>
                <span>{option.quantity}</span>
                <button
                  onClick={() => handleOptionQuantityChange(item.id, option.id, 1)}
                >
                  &gt;
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => handleRemoveItem(item.id)}>삭제하기</button>
        </div>
      ))}
      <div>
        <h2>총금액: {calculateTotalPrice()}원</h2>
      </div>
      <button>결제하기</button>
    </div>
  );
};

export default CartPage;
