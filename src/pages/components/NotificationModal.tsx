import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useRouter } from 'next/router';
import useAuth from '@/lib/useAuth';

Modal.setAppElement('#__next');

const NotificationModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // 유저 에이전트를 통해 모바일 여부 확인
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    

    // 모바일이 아니면 데스크탑으로 간주
    setIsDesktop(!isMobile);

    if (!isMobile) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', function(event) {
          const data = event.data.notification;
          setNotification({
            title: data.title,
            body: data.body,
          });
          setModalIsOpen(true);
        });
      }
    }
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
    const url = `/admin/${(user as any)?.id }/ViewOrderDetails`;
    // 확인 버튼을 클릭하면 ViewOrderDetailsPage로 이동하고 새로고침
    router.push(url).then(() => {
      router.reload(); // 페이지를 새로고침
    });
  };

  if (!isDesktop) {
    return null; // 데스크톱이 아니면 모달을 렌더링하지 않음
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="알림"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">{notification.title}</h2>
          <p className="text-gray-600 text-center mb-6">{notification.body}</p>
          <div className="flex justify-center">
            <button
              onClick={closeModal}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationModal;