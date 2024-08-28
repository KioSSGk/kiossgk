import React from 'react';
import { useRouter } from 'next/router';

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-bold mb-4">장바구니에 성공적으로 담았습니다!</h2>
        <div className="flex justify-between">
          <button
            className="bg-teal-400 text-white py-2 px-3 font-bold rounded-lg"
            onClick={() => {
                onClose();
                const lastStoreId = localStorage.getItem('lastStoreId');
                if (lastStoreId) {
                  router.push(`/user/storedetail/${lastStoreId}`);
                } else {
                  router.push('/'); // 기본적으로 메인 페이지로 이동
                }
              }}
          >
            계속 쇼핑하기
          </button>
          <button
            className="bg-teal-400 text-white py-2 px-3 font-bold rounded-lg"
            onClick={() => {
              onClose();
              router.push('/user/cart'); // 장바구니로 이동
            }}
          >
            장바구니로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
