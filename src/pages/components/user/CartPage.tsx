import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadTossPayments, ANONYMOUS,TossPaymentsPayment} from "@tosspayments/tosspayments-sdk";
import PhoneNumberModal from './userPhoneInputmodal';
export interface CartItem {
  cartItemId: number;
  name: string;
  price: number;
  quantity: number;
  options: { name: string; price: number }[];
  menuId: number;
  storeId: number;
  optionId: number | null;
}
const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const customerKey ="test_sk_LkKEypNArWLZqYX1gMej8lmeaxYG";

const fetchCartItems = async (): Promise<CartItem[]> => {
  try {
    const response = await axios.get(`/api/user_cart/usercart`);
    console.log("Fetched Cart Items:", response.data);
    return response.data.cartItems;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

const updateCartItem = async (cartItemId: number, quantity: number): Promise<void> => {
  try {
    console.log("Updating Cart Item:", { cartItemId, quantity });
    await axios.post(`/api/user_cart/usercart`, { id: cartItemId, quantity });
  } catch (error) {
    console.error('Error updating cart item:', error);
  }
};

const deleteCartItem = async (cartItemId: number): Promise<void> => {
  try {
    console.log("Deleting Cart Item with ID:", cartItemId);
    await axios.delete(`/api/user_cart/usercart`, { data: { cartItemId } });
  } catch (error) {
    console.error('Error deleting cart item:', error);
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
};

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<TossPaymentsPayment|null>(null);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    // 추가된 상태: 모달이 열려 있는지 여부와 입력된 전화번호를 관리
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false); // 모달 열림 상태 관리
    const [phoneNumber, setPhoneNumber] = useState(''); // 입력된 전화번호 상태 관리

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

    // 추가된 함수: 전화번호 저장 처리
    const handleSavePhoneNumber = (phone: string) => {
      setPhoneNumber(phone); // 저장된 전화번호 상태 업데이트
      //requestPayment(phoneNumber); // 결제 요청 진행
  };
  
  async function requestPayment(phoneNumber:string) {

    if (!phoneNumber) { // 전화번호가 입력되지 않은 경우
      setIsPhoneModalOpen(true); // 모달 열기
      //return; // 전화번호 입력을 기다림
  }
    await payment?.requestPayment({
      method: 'CARD', // 카드 및 간편결제
      amount:{
        currency: "KRW",
        value: calculateTotalPrice(),
      },

      orderId: generateOrderId().toString(), // 고유 주문번호
      orderName: "토스 티셔츠 외 2건",
      successUrl: window.location.origin + "/user/payment/success", // 결제 요청이 성공하면 리다이렉트되는 URL
      failUrl: window.location.origin + "/user/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
      customerMobilePhone:  phoneNumber,
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

  const handleQuantityChange = (cartItemId: number, amount: number) => {
    console.log(`Changing Quantity for Cart Item ID: ${cartItemId} by Amount: ${amount}`);
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = item.quantity + amount;
          if (newQuantity > 0) {
            updateCartItem(cartItemId, newQuantity);
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (cartItemId) {
      await deleteCartItem(cartItemId);
      setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
    } else {
      console.error("Cart Item ID is undefined, cannot remove item.");
    }
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const optionsTotal = item.options.reduce(
        (optionTotal, option) => optionTotal + option.price * item.quantity,
        0
      );
      return total + itemTotal + optionsTotal;
    }, 0);
    console.log("Total Price Calculated:", totalPrice);
    return totalPrice;
  };

  return (
    <div className='flex justify-center mt-5'>
      <div className='max-w-sm w-full px-2 pt-24 text-sm'>
        {cartItems.map((item) => (
          <div className='p-4 mb-6 bg-white rounded-xl shadow-lg' key={item.cartItemId}>
            <div className='flex justify-between'>
              <div className='font-bold'>{item.name}</div>
              <div>
                <button onClick={() => handleQuantityChange(item.cartItemId, -1)}>
                  &lt;
                </button>
                <span className='font-bold p-2'>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.cartItemId, 1)}>
                  &gt;
                </button>
              </div>
            </div>
            <div> {formatPrice(item.price)}</div>
            {item.options.map((option, index) => (
              <div className='my-4' key={index}>
                <div className='flex justify-between'>
                  <div className='font-bold'>{option.name}</div>
                  <div>+ {formatPrice(option.price)}</div>
                </div>
              </div>
            ))}
            <div className='flex justify-end'>
              <button
                className='bg-teal-400 p-2 rounded-lg text-white font-bold text-sm'
                onClick={() => handleRemoveItem(item.cartItemId)}
              >
                삭제하기
              </button>
            </div>
          </div>
        ))}
        <div className='py-12'></div>
      </div>
      <div
        className='flex bg-white w-full justify-center fixed bottom-0 drop-shadow-lg'
        style={{ height: '56px' }}
      >
        <div className='flex justify-between w-full max-w-sm px-2 items-center'>
          <div className='font-bold'>
            <h2>총금액: {formatPrice(calculateTotalPrice())}</h2>
          </div>
          <div>

          <button className="bg-teal-400 p-2 text-white font-bold text-sm rounded-lg" onClick={() => requestPayment(phoneNumber)}>
          결제하기
        </button>

          </div>
        </div>
        
      </div>
                  {/* 추가된 모달 컴포넌트 */}
                  <PhoneNumberModal
              isOpen={isPhoneModalOpen}
              onClose={() => setIsPhoneModalOpen(false)}
              onSavePhoneNumber={handleSavePhoneNumber}  // 전화번호 저장 처리 함수
            />
    </div>
  );
};

export default CartPage;


