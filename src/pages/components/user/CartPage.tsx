import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadTossPayments, ANONYMOUS,TossPaymentsPayment} from "@tosspayments/tosspayments-sdk";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  options: { id: number; name: string; price: number; quantity: number }[];
}
const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const customerKey ="test_sk_LkKEypNArWLZqYX1gMej8lmeaxYG";
function generateOrderId():string{
  
  
  
  return "";};
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
  const [payment, setPayment] = useState<TossPaymentsPayment|null>(null);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);


  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
        // const payment = tossPayments.payment({
        //   customerKey,
        // });
        // 비회원 결제
        const payment = tossPayments.payment({ customerKey: ANONYMOUS });

        setPayment(payment);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    }

    fetchPayment();
  }, [clientKey, customerKey]);

  function generateOrderId(): number {
    // 현재 날짜를 가져옴
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(now.getDate()).padStart(2, '0');
  
    // 3자리 랜덤 숫자 생성
    const randomInt = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
    // "YYYYMMDDRRR" 형태의 문자열을 정수로 변환하여 반환
    return parseInt(`${year}${month}${day}${randomInt}`, 10);
  }



  async function requestPayment() {
    await payment?.requestPayment({
      method: 'CARD', // 카드 및 간편결제
      amount:{
        currency: "KRW",
        value: 50000,
      },

      orderId: generateOrderId().toString(), // 고유 주문번호
      orderName: "토스 티셔츠 외 2건",
      successUrl: window.location.origin + "/user/payment/success", // 결제 요청이 성공하면 리다이렉트되는 URL
      failUrl: window.location.origin + "/user/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
      customerMobilePhone: "01012341234",
      card: {
        useEscrow: false,
        flowMode: "DEFAULT",
        useCardPoint: false,
        useAppCardOnly: false,
      },
    });



  }
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
        <div className='flex bg-white w-full justify-center fixed bottom-0 drop-shadow-lg' style={{height:'56px'}}>
            <div className='flex justify-between w-full max-w-sm px-2 items-center'>
              <div className='font-bold'>
                <h2>
                  총금액: {calculateTotalPrice()}원
                </h2>
              </div>
              <div className=''>
                {/* <button className='bg-orange-400 p-2 text-white font-bold text-sm rounded-lg'>결제하기</button> */}
                <button className="bg-orange-400 p-2 text-white font-bold text-sm rounded-lg" onClick={() => requestPayment()}>
          결제하기
        </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default CartPage;


