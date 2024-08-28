import React from 'react';
import { useRouter } from 'next/router';

interface CartModalProps {
  isOpen: boolean; // 모달 열림 상태
  onHome: () => void; // 홈으로 이동하는 함수
  onClose: () => void; // 이전 페이지로 이동하는 함수
  onCancel: () => void; // 모달을 닫는 함수
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onHome, onClose, onCancel }) => {
  if (!isOpen) return null; // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-bold mb-4">장바구니가 비어있습니다. 어디로 가시겠습니까?</h2>
        <div className="flex justify-between">
          <button
            className="bg-teal-400 font-bold text-white py-2 px-5 rounded-lg"
            onClick={onHome} // 홈으로 이동
          >
            홈으로 가기
          </button>
          <button
            className="bg-teal-400 font-bold text-white py-2 px-5 rounded-lg"
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
            className="bg-teal-400 font-bold text-white py-2 px-5 rounded-lg"
            onClick={onCancel} // 모달 닫기
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
