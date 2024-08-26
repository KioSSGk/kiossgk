import "@/styles/globals.css";
import "react-calendar/dist/Calendar.css"; // React Calendar 기본 스타일
import "@/styles/CalendarStyles.css"; // 캘린더 스타일 추가
import type { AppProps } from "next/app";
import { useEffect } from "react";
import NotificationModal from "@/pages/components/NotificationModal";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(function (registration) {
          console.log('서비스 워커 등록 성공:', registration);
        })
        .catch(function (err) {
          console.log('서비스 워커 등록 실패:', err);
        });
    }

    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('알림 권한이 허용되었습니다.');
        } else {
          console.warn('알림 권한이 거부되었습니다.');
        }
      } catch (error) {
        console.error('알림 권한 요청 중 오류 발생:', error);
      }
    };

    requestNotificationPermission();
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <NotificationModal />
    </>
  );
}