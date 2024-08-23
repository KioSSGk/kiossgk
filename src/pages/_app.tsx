// src/pages/_app.tsx
import "@/styles/globals.css";
import "react-calendar/dist/Calendar.css"; // React Calendar 기본 스타일
import "@/styles/CalendarStyles.css"; // 캘린더 스타일 추가
import type { AppProps } from "next/app";
import { useEffect } from "react";  // useEffect 훅 임포트

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
  }, []);

  return <Component {...pageProps} />;
}
