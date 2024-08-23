import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, Messaging, getToken } from "firebase/messaging";

// 환경 변수를 사용하여 Firebase 설정을 불러옵니다.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 필요한 경우 Analytics 초기화
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Messaging 초기화 (클라이언트 측에서만)
let messaging: Messaging | undefined;
if (typeof window !== "undefined" && firebaseConfig.messagingSenderId) {
  console.log("Firebase Messaging 초기화 중..."); // 추가 로그
  messaging = getMessaging(app);
} else {
  console.warn("Firebase Messaging이 초기화되지 않았습니다.");
}

export { app, analytics, messaging, getToken };
