// src/pages/_app.tsx
import "@/styles/globals.css";
import "react-calendar/dist/Calendar.css"; // React Calendar 기본 스타일
import "@/styles/CalendarStyles.css"; // 캘린더 스타일 추가
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
