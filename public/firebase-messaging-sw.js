// public/firebase-messaging-sw.js
console.log('서비스 워커가 로드되었습니다.');
// 최신 Firebase SDK 로드
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

console.log('Firebase 스크립트가 로드되었습니다.');

// Firebase 구성 객체
const firebaseConfig = {
  apiKey: 'AIzaSyCKteMt4Ey32utc_bdMAX-2NE66jZjBJRA',
  authDomain: 'kiossgk.firebaseapp.com',
  projectId: 'kiossgk',
  storageBucket: 'kiossgk.appspot.com',
  messagingSenderId: '471557583170',
  appId: '1:471557583170:web:7b6ccbe1a8d171299718db',
  measurementId: 'G-358C69NY5V',
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firebase Messaging 인스턴스 가져오기
const messaging = firebase.messaging();

// 백그라운드 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신:', payload);
  const notificationTitle = payload.notification.title || '알림 제목';
  const notificationOptions = {
    body: payload.notification.body || '알림 내용',
    icon: '/firebase-logo.png', // 아이콘 경로를 실제 아이콘으로 변경
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
