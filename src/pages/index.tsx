import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

    const redirectAfterDelay = () => {
      if (isMobile) {
        router.push('/user');
      } else {
        router.push('/admin/login');
      }
    };

    const timeoutId = setTimeout(redirectAfterDelay, 5000); // 5초 후 리디렉션

    return () => clearTimeout(timeoutId); // 컴포넌트 언마운트 시 타이머 클리어
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="relative">
        {/* 커스텀 애니메이션 */}
        <div className="w-16 h-16 bg-white animate-crazy"></div>
      </div>
      <style jsx>{`
        @keyframes crazyAnimation {
          0% {
            transform: scale(1) rotate(0deg);
            background-color: hsl(0, 100%, 50%);
            border-radius: 50%;
          }
          20% {
            transform: scale(1.5) rotate(45deg);
            background-color: hsl(60, 100%, 50%);
            border-radius: 20%;
          }
          40% {
            transform: scale(0.8) rotate(90deg);
            background-color: hsl(120, 100%, 50%);
            border-radius: 30% 70% 70% 30%;
          }
          50% {
            transform: scale(1) rotate(135deg);
            background-color: hsl(180, 100%, 50%);
            border-radius: 50% 50% 0 0;
          }
          60% {
            transform: scale(1.2) rotate(180deg);
            background-color: hsl(240, 100%, 50%);
            border-radius: 40% 60% 60% 40%;
          }
          80% {
            transform: scale(1.5) rotate(225deg);
            background-color: hsl(300, 100%, 50%);
            border-radius: 30% 30% 70% 70%;
          }
          95% {
            transform: scale(1) rotate(360deg);
            background-color: #5eead4; /* teal-300 */
            border-radius: 50%;
          }
          100% {
            transform: scale(50) rotate(360deg);
            background-color: #5eead4; /* teal-300 */
            border-radius: 50%;
          }
        }

        .animate-crazy {
          animation: crazyAnimation 5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
